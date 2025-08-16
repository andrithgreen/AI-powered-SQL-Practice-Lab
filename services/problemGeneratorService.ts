
import { GoogleGenAI, Type } from "@google/genai";
import { Problem, UserStats } from '../types';
import { PROBLEMS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set. This is required to generate problems.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const problemExamples = PROBLEMS.map(p => {
    const schemaString = p.schema.map(s => {
        const columns = s.columns.length > 0 
            ? s.columns.map(c => `- ${c.name}: ${c.type}${c.description ? ` (${c.description})` : ''}`).join('\n')
            : ' (No columns defined)';
        return `Table: ${s.name}\n${s.description ? `Description: ${s.description}\n` : ''}Columns:\n${columns}`;
    }).join('\n\n');
    
    return `
Title: ${p.title}
Schema:
${schemaString}
Question:
${p.question}
Correct Query:
\`\`\`sql
${p.correctQuery}
\`\`\`
Default Query (for user):
\`\`\`sql
${p.defaultQuery}
\`\`\`
`;
}).join('\n\n---\n\n');


const generateCreationPrompt = (options?: {
    history?: { lastProblem: Problem; attempts: number; confidence: number };
    category?: string;
    stats?: UserStats;
}): string => {
    let adaptiveInstructionsSection = '';

    // Priority 1: Specific category request
    if (options?.category) {
        adaptiveInstructionsSection = `
**Priority Instruction:**
You MUST generate a problem from the following specific category: **${options.category}**. Ignore the user's performance history for this request and focus on creating a new, unique problem within the specified category.
`;
    }
    // Priority 2: Adaptive logic based on full user stats
    else if (options?.stats && Object.keys(options.stats.byCategory).length > 0) {
        const performanceSummary = Object.values(options.stats.byCategory)
            .map(cat => {
                const accuracy = cat.totalAttempts > 0 ? (cat.correct / cat.totalAttempts) * 100 : 0;
                const avgAttempts = cat.completed > 0 ? cat.totalAttempts / cat.completed : 0;
                return `- Category: ${cat.category}, Accuracy: ${accuracy.toFixed(1)}%, Avg Attempts: ${avgAttempts.toFixed(1)}, Problems Completed: ${cat.completed}`;
            })
            .join('\n');

        adaptiveInstructionsSection = `
**User's Overall Performance Summary (for context):**
${performanceSummary}

**Adaptive Instructions:**
Analyze the user's performance summary. Identify the categories where they are struggling the most (e.g., lowest accuracy, highest average attempts).
Your primary goal is to generate a new, unique problem from one of those weaker categories to help them practice and improve.
Avoid categories where the user has consistently high accuracy.
`;
    }
    // Priority 3: Fallback to last problem history
    else if (options?.history?.lastProblem.category && options?.history?.confidence) {
        const { history } = options;
        adaptiveInstructionsSection = `
**User's Previous Performance (for context):**
- Previous Problem Category: ${history.lastProblem.category}
- User Confidence (1=low, 5=high): ${history.confidence}/5
- Attempts to Solve: ${history.attempts}

**Adaptive Instructions:**
- If the user's confidence was high (4 or 5) and they had few attempts (1-2), generate a problem from a **DIFFERENT category**. Challenge them with something new.
- If the user's confidence was low (1 or 2) or they took many attempts, generate a problem from the **SAME category** to provide more practice. The new problem must be different from the previous one (e.g., different tables, columns, or conditions) but test the same core concept.
- If confidence was average (3), you have the flexibility to choose a related or new topic.
`;
    }

    return `
You are an expert SQL curriculum designer creating an adaptive learning experience. Your task is to generate a single, unique SQL practice problem that is similar in style, scope, and difficulty to the provided examples, while adapting to the user's performance or specific requests.

${adaptiveInstructionsSection}

**Guidelines for Generation:**
1.  **Topic Variety:** Create a problem that is conceptually different from the examples, but maintains a similar level of complexity. Invent new table names and scenarios (e.g., 'Products', 'Orders', 'Students', 'Courses', 'Employees', 'Departments').
2.  **Schema Design:** Define a clear and simple schema (1 or 2 tables) that is relevant to the problem. The tables should have a few columns (3-6) with common SQL data types.
3.  **Problem Statement:** Write a clear and concise question. If the question involves a list of items or steps (e.g., column definitions, data to insert), format them using markdown bullet points (e.g., "- First item").
4.  **Correct Query:** Provide the canonical correct SQL query for the problem. Format the query with each major clause (SELECT, FROM, WHERE, etc.) on a new line for readability.
5.  **Default Query:** Provide a starting template or "scaffolding" for the user's query. This should be a partially completed query that includes SQL comments (\`--\`) guiding the user on what to do for each line. For example: \`SELECT -- Select the customer name\\nFROM -- From the Customers table\\nWHERE -- Filter for customers in 'USA';\`. The comments should be brief and helpful.
6.  **Title:** The title should follow the pattern "Practice Lab: [Topic]". For example, "Practice Lab: Creating Views" or "Practice Lab: Filtering with WHERE".
7.  **Category:** Provide a short category for the problem (e.g., 'DDL - CREATE TABLE', 'DQL - JOINs', 'DML - INSERT'). This is crucial for the adaptive learning feedback loop.

**Example Problems for Style and Complexity Reference:**
---
${problemExamples}
---

Now, generate a new problem. Return your response ONLY in the specified JSON format. Do not include any other text, comments, or markdown formatting.
`;
};


const problemSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        category: { 
            type: Type.STRING,
            description: "A short category for the problem, e.g., 'DDL - CREATE TABLE', 'DQL - JOINs', 'DML - INSERT'. This should reflect the main SQL concept being tested."
        },
        schema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    columns: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                type: { type: Type.STRING },
                                description: { type: Type.STRING }
                            },
                             required: ["name", "type"]
                        }
                    }
                },
                required: ["name", "columns"]
            }
        },
        question: { type: Type.STRING },
        correctQuery: { type: Type.STRING },
        defaultQuery: { type: Type.STRING }
    },
    required: ["title", "category", "schema", "question", "correctQuery", "defaultQuery"]
};


export const generateNewProblem = async (options?: {
    history?: { lastProblem: Problem; attempts: number; confidence: number };
    category?: string;
    stats?: UserStats;
}): Promise<Problem> => {
    try {
        const prompt = generateCreationPrompt(options);
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: problemSchema,
            },
        });

        const jsonText = response.text.trim();
        const newProblem = JSON.parse(jsonText) as Problem;
        
        // Basic validation
        if (!newProblem.title || !newProblem.question || !newProblem.schema || !newProblem.category) {
            throw new Error("Generated problem is missing required fields.");
        }

        return newProblem;

    } catch (error) {
        console.error("Error generating new problem with Gemini:", error);
        let errorMessage = "An unknown error occurred while generating a new problem.";
        if (error instanceof Error) {
            errorMessage = `Failed to generate a new problem from the AI model: ${error.message}`;
        }
        throw new Error(errorMessage);
    }
};
