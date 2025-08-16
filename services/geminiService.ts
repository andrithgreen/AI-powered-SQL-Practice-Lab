import { GoogleGenAI, Type } from "@google/genai";
import { Problem, EvaluationResult, TableSchema } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. The app will not function correctly without a valid API key.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY! });

interface GeminiValidationResponse {
    isCorrect: boolean;
    feedback: string;
    resultDataString: string;
}

interface GeminiRunResponse {
    resultDataString: string;
}


const generateRunPrompt = (userQuery: string, schema: TableSchema[]): string => {
    const schemaString = schema.map(table =>
        `Table Name: **${table.name}**\n${table.description ? `Description: ${table.description}\n` : ''}${table.columns.length > 0 ? 'Columns:\n' + table.columns.map(col => `- **${col.name}**: ${col.type}${col.description ? ` (${col.description})` : ''}`).join('\n') : ''}`
    ).join('\n\n');

    return `
You are a database simulator.
Based on the provided database schema, execute the user's SQL query and return the result. Your only output should be the JSON specified in the response schema.

**Database Schema:**
${schemaString}

**User's SQL Query:**
\`\`\`sql
${userQuery}
\`\`\`

**Instructions:**
- Simulate the execution of the user's query.
- For DQL (SELECT), generate a realistic, small result set (2-5 rows is ideal, unless the query is an aggregate like COUNT which should return 1 row).
- For DDL (CREATE, ALTER, DROP) and DML (INSERT, UPDATE, DELETE), the result set is an empty array.
- If the user's query has a syntax error or is invalid, the result set is also an empty array.
- Return the result set as a JSON string in the 'resultDataString' field.
`;
};

const generateValidatePrompt = (userQuery: string, problem: Problem): string => {
    const schemaString = problem.schema.map(table =>
        `Table Name: **${table.name}**\n${table.description ? `Description: ${table.description}\n` : ''}${table.columns.length > 0 ? 'Columns:\n' + table.columns.map(col => `- **${col.name}**: ${col.type}${col.description ? ` (${col.description})` : ''}`).join('\n') : ''}`
    ).join('\n\n');

    return `
You are an expert SQL instructor and database simulator.
A user is solving a SQL problem. Your task is to perform the following steps:
1. Analyze the user's SQL query.
2. Compare it conceptually to the correct solution provided. Determine if the user's query correctly solves the problem. A query can be syntactically different but still correct if it produces the right result. For example, using '!=' instead of '<>' is correct. For CREATE TABLE, the column types might be slightly different but equivalent (e.g. INT vs INTEGER).
3. Provide brief, helpful, and encouraging feedback on their query. If it's correct, congratulate them. If it's incorrect, gently point out the mistake without giving away the direct answer.
4. Simulate the execution of the user's query.
  - For DQL (SELECT), generate a realistic, small result set (2-5 rows is ideal, unless the query is an aggregate like COUNT which should return 1 row).
  - For DDL (CREATE, ALTER, DROP) and DML (INSERT, UPDATE, DELETE), the result set is typically empty. Acknowledge that the command was executed successfully by providing feedback. For these operations, 'resultDataString' should be '[]'.
5. If the user's query has a clear syntax error or is logically incorrect, set 'isCorrect' to false, provide feedback explaining the error, and ensure 'resultDataString' is an empty array string '[]'.

Here is the context:

**Database Schema & Context:**
${schemaString}

**The Problem Description:**
${problem.question}

**The User's SQL Query:**
\`\`\`sql
${userQuery}
\`\`\`

**Reference Correct SQL Query (for your internal evaluation only, do not show this to the user):**
\`\`\`sql
${problem.correctQuery}
\`\`\`

Return your response ONLY in the specified JSON format. Do not include any other text, comments, or markdown formatting like \`\`\`json.
The 'resultDataString' value MUST be a JSON string representation of an array of objects. Each object is a row, and its keys are the column names from the user's SELECT statement. If the query is a DDL/DML statement or would produce no results, this string should be '[]'.
`;
};

export const runQueryAndSimulate = async (userQuery: string, schema: TableSchema[]): Promise<{ data: Record<string, any>[], error?: string }> => {
    if (!API_KEY) {
        return { data: [], error: "API_KEY is not configured. Please set up your API key to use this feature." };
    }
    
    try {
        const prompt = generateRunPrompt(userQuery, schema);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        resultDataString: { 
                            type: Type.STRING,
                            description: "A stringified JSON array of result objects. Example: '[{\"column\":\"value\"}]' or '[]'."
                        }
                    },
                    required: ["resultDataString"],
                },
            },
        });

        const jsonText = response.text.trim();
        const geminiResult = JSON.parse(jsonText) as GeminiRunResponse;

        let resultData = [];
        if (geminiResult.resultDataString && geminiResult.resultDataString.trim() !== "") {
             resultData = JSON.parse(geminiResult.resultDataString);
        }
        
        return { data: resultData };

    } catch (error) {
        console.error("Error running query with Gemini:", error);
        let errorMessage = "An unknown error occurred while running the query.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return { data: [], error: errorMessage };
    }
};

export const validateAndRunQuery = async (userQuery: string, problem: Problem): Promise<EvaluationResult> => {
    if (!API_KEY) {
         return {
            isCorrect: false,
            feedback: "API_KEY is not configured. Please set up your API key to use this feature.",
            resultData: [],
            error: "Missing API Key"
        };
    }
    
    try {
        const prompt = generateValidatePrompt(userQuery, problem);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isCorrect: { type: Type.BOOLEAN },
                        feedback: { type: Type.STRING },
                        resultDataString: { 
                            type: Type.STRING,
                            description: "A stringified JSON array of result objects. Example: '[{\"column\":\"value\"}]' or '[]'."
                        }
                    },
                    required: ["isCorrect", "feedback", "resultDataString"],
                },
            },
        });

        const jsonText = response.text.trim();
        const geminiResult = JSON.parse(jsonText) as GeminiValidationResponse;

        let resultData = [];
        try {
            if (geminiResult.resultDataString && geminiResult.resultDataString.trim() !== "") {
                 resultData = JSON.parse(geminiResult.resultDataString);
            }
        } catch (e) {
            console.error("Failed to parse resultDataString:", geminiResult.resultDataString, e);
        }

        return {
            isCorrect: geminiResult.isCorrect,
            feedback: geminiResult.feedback,
            resultData: resultData,
        };

    } catch (error) {
        console.error("Error evaluating query with Gemini:", error);
        let errorMessage = "An unknown error occurred while evaluating the query.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return {
            isCorrect: false,
            feedback: "There was an error processing your query. The AI model might have returned an invalid response. Please check the console for details.",
            resultData: [],
            error: errorMessage
        };
    }
};