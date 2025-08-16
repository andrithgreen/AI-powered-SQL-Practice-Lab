
export interface SchemaColumn {
    name: string;
    type: string;
    description?: string;
}

export interface TableSchema {
    name: string;
    columns: SchemaColumn[];
    description?: string;
}

export interface Problem {
    id?: number;
    title: string;
    category: string;
    schema: TableSchema[];
    question: string;
    correctQuery: string;
    defaultQuery?: string;
}

export interface EvaluationResult {
    isCorrect: boolean;
    feedback: string;
    resultData: Record<string, any>[];
    error?: string;
}

export interface CategoryStats {
    category: string;
    correct: number;
    totalAttempts: number;
    totalConfidence: number;
    completed: number;
}

export interface UserStats {
    totalProblemsCompleted: number;
    totalUniqueAttempts: number; // Attempts on the first try for any problem
    totalConfidence: number;
    byCategory: Record<string, CategoryStats>;
}
