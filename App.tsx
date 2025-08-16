
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Problem, EvaluationResult, UserStats } from './types';
import { generateNewProblem } from './services/problemGeneratorService';
import { validateAndRunQuery, runQueryAndSimulate } from './services/geminiService';
import { useLocalStorage } from './hooks/useLocalStorage';
import SqlEditor from './components/SqlEditor';
import ResultTable from './components/ResultTable';
import ProblemDescription from './components/ProblemDescription';
import SqlDictionary from './components/SqlDictionary';
import ToggleSwitch from './components/ToggleSwitch';
import Dashboard from './components/Dashboard';


const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06L10.5 13.19l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.5-4.5z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
    </svg>
);

const TerminalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v17A1.5 1.5 0 004.5 22h15a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0019.5 2h-15zm.621 4.777a.75.75 0 011.06 0l2.25 2.25a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06-1.06L6.87 9l-1.75-1.75a.75.75 0 010-1.06l.5-.313zM12 8.25a.75.75 0 01.75.75h3.75a.75.75 0 010 1.5H12.75a.75.75 0 010-1.5H12z" clipRule="evenodd" />
  </svg>
);

const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75A1.125 1.125 0 0119.875 21h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const ArrowDownTrayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 1.5a.75.75 0 01.75.75V11.25l1.22-1.22a.75.75 0 011.06 1.06l-2.5 2.5a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 111.06-1.06l1.22 1.22V2.25A.75.75 0 0112 1.5zM3 14.25a.75.75 0 01.75.75v5.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v5.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V15a.75.75 0 01.75-.75z" />
    </svg>
);

const ArrowUpTrayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.25a.75.75 0 01.75.75v11.25l1.22-1.22a.75.75 0 011.06 1.06l-2.5 2.5a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 111.06-1.06l1.22 1.22V3a.75.75 0 01.75-.75z" />
        <path d="M3.53 15.47a.75.75 0 011.06 0L8.25 19.19V9.75a.75.75 0 011.5 0v9.44l3.66-3.72a.75.75 0 111.06 1.06l-5 5a.75.75 0 01-1.06 0l-5-5a.75.75 0 010-1.06z" />
        <path d="M21 14.25a.75.75 0 01.75.75v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V15a.75.75 0 011.5 0v5.25a3 3 0 003 3h10.5a3 3 0 003-3V15a.75.75 0 01.75-.75z" />
    </svg>
);


const StarIcon: React.FC<{
    className?: string;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}> = ({ className, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);

const ConfidenceRater: React.FC<{
    rating: number | null;
    onRate: (rating: number) => void;
    disabled: boolean;
}> = ({ rating, onRate, disabled }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((index) => {
                const isFilled = (rating !== null && rating >= index) || (rating === null && hoverRating >= index);
                return (
                    <StarIcon
                        key={index}
                        className={`w-7 h-7 cursor-pointer transition-colors ${isFilled ? 'text-amber-400' : 'text-gray-600 hover:text-gray-500'}`}
                        onClick={() => !disabled && onRate(index)}
                        onMouseEnter={() => !disabled && setHoverRating(index)}
                        onMouseLeave={() => !disabled && setHoverRating(0)}
                    />
                );
            })}
        </div>
    );
};

const PageLoader: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex flex-col justify-center items-center h-screen bg-[#1e1e1e]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mb-4"></div>
        <p className="text-gray-400 text-lg">{text}</p>
    </div>
);

const QuerySpinner: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex justify-center items-center space-x-2">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-300"></div>
        <span className="text-gray-400">{text}</span>
    </div>
);

const initialStats: UserStats = {
    totalProblemsCompleted: 0,
    totalUniqueAttempts: 0,
    totalConfidence: 0,
    byCategory: {},
};

const App: React.FC = () => {
    const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
    const [sqlQuery, setSqlQuery] = useState<string>('');
    const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
    const [runResultData, setRunResultData] = useState<Record<string, any>[] | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [problemCounter, setProblemCounter] = useState(1);
    const [lastAction, setLastAction] = useState<'run' | 'submit' | null>(null);
    const [editorTheme, setEditorTheme] = useState<'default' | 'console'>('default');
    const [isHardMode, setIsHardMode] = useState<boolean>(false);
    const [submissionAttempts, setSubmissionAttempts] = useState(0);
    const [confidenceRating, setConfidenceRating] = useState<number | null>(null);
    const [stats, setStats] = useLocalStorage<UserStats>('sql-practice-stats', initialStats);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadNewProblem = useCallback(async (options: {
        isHard: boolean;
        history?: { lastProblem: Problem; attempts: number; confidence: number };
        category?: string;
        stats?: UserStats;
    }) => {
        const { isHard, history, category, stats } = options;
        setIsGenerating(true);
        setError(null);
        setEvaluationResult(null);
        setRunResultData(null);
        setLastAction(null);
        setSubmissionAttempts(0);
        setConfidenceRating(null);
        try {
            const newProblem = await generateNewProblem({ history, category, stats });
            setCurrentProblem(newProblem);
            setSqlQuery(isHard ? '' : newProblem.defaultQuery || '');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to generate a new problem.";
            setError(errorMessage);
            setCurrentProblem(null);
        } finally {
            setIsGenerating(false);
        }
    }, []);

    useEffect(() => {
        loadNewProblem({ isHard: isHardMode });
    }, [isHardMode, loadNewProblem]);

    const handleHardModeToggle = (checked: boolean) => {
        setIsHardMode(checked);
        if (checked && currentProblem && sqlQuery === currentProblem.defaultQuery) {
            setSqlQuery('');
        }
    };
    
    const updateStats = useCallback((history: { lastProblem: Problem; attempts: number; confidence: number }) => {
        setStats(prevStats => {
            const { lastProblem, attempts, confidence } = history;
            const category = lastProblem.category || 'General';

            const newStats = JSON.parse(JSON.stringify(prevStats));

            newStats.totalProblemsCompleted += 1;
            // Only add to unique attempts if it was the first attempt on this problem
            if (attempts === 1) {
                newStats.totalUniqueAttempts += 1;
            }
            newStats.totalConfidence += confidence;

            if (!newStats.byCategory[category]) {
                newStats.byCategory[category] = {
                    category: category,
                    correct: 0,
                    totalAttempts: 0,
                    totalConfidence: 0,
                    completed: 0
                };
            }

            const catStats = newStats.byCategory[category];
            catStats.correct += 1;
            catStats.completed += 1;
            catStats.totalAttempts += attempts;
            catStats.totalConfidence += confidence;

            return newStats;
        });
    }, [setStats]);

    const handleNextProblem = () => {
        setProblemCounter(prev => prev + 1);
        let history;
        if (currentProblem && confidenceRating && evaluationResult?.isCorrect) {
            history = {
                lastProblem: currentProblem,
                attempts: submissionAttempts,
                confidence: confidenceRating,
            };
            updateStats(history);
        }
        loadNewProblem({ isHard: isHardMode, history, stats });
    };

    const handleRequestProblem = (category: string) => {
        setIsDashboardOpen(false);
        loadNewProblem({ isHard: isHardMode, category });
    };

    const handleRunQuery = async () => {
        if (!currentProblem) return;
        setIsProcessing(true);
        setError(null);
        setEvaluationResult(null);
        setRunResultData(null);
        setLastAction('run');
        const result = await runQueryAndSimulate(sqlQuery, currentProblem.schema);
        if (result.error) {
            setError(result.error);
        } else {
            setRunResultData(result.data);
        }
        setIsProcessing(false);
    };

    const handleSubmitQuery = async () => {
        if (!currentProblem) return;
        setIsProcessing(true);
        // Only count this attempt if the problem is not already solved correctly
        if (!evaluationResult?.isCorrect) {
            setSubmissionAttempts(prev => prev + 1);
            if (submissionAttempts === 0) { // First attempt for this problem
                setStats(prev => ({...prev, totalUniqueAttempts: prev.totalUniqueAttempts + 1}));
            }
        }
        setError(null);
        setEvaluationResult(null);
        setRunResultData(null);
        setLastAction('submit');
        const result = await validateAndRunQuery(sqlQuery, currentProblem);
        if (result.error) {
            setError(result.feedback);
        } else {
            setEvaluationResult(result);
        }
        setIsProcessing(false);
    };

    const handleExportStats = () => {
        try {
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(stats, null, 2))}`;
            const link = document.createElement("a");
            link.href = jsonString;
            link.download = "sql-practice-stats.json";
            link.click();
        } catch (err) {
            console.error("Failed to export stats:", err);
            alert("Could not export your stats. Please check the console for more information.");
        }
    };
    
    const handleImportStats = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File content is not readable.");
                }
                const importedStats = JSON.parse(text);
                // Basic validation
                if (importedStats.hasOwnProperty('totalProblemsCompleted') && importedStats.hasOwnProperty('byCategory')) {
                    setStats(importedStats);
                    alert("Stats imported successfully!");
                } else {
                    throw new Error("Invalid stats file format.");
                }
            } catch (err) {
                 console.error("Failed to import stats:", err);
                 alert("Could not import stats. The file may be corrupted or in the wrong format.");
            } finally {
                // Reset file input to allow importing the same file again
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        };
        reader.readAsText(file);
    };

    if (isGenerating && !currentProblem && !error) {
        return <PageLoader text="Generating a new SQL problem..." />;
    }

    if (!currentProblem) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-[#1e1e1e] text-center px-4">
                <XCircleIcon className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl text-gray-200 mb-2">Error Loading Problem</h1>
                <p className="text-gray-400 max-w-md mb-6">{error || "An unknown error occurred."}</p>
                 <button
                    onClick={() => loadNewProblem({ isHard: isHardMode })}
                    disabled={isGenerating}
                    className="bg-[#007acc] hover:bg-[#008ae6] text-white font-bold py-2 px-6 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isGenerating ? 'Retrying...' : 'Try Again'}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1e1e1e] text-gray-300 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {isDashboardOpen && <Dashboard stats={stats} onClose={() => setIsDashboardOpen(false)} onRequestProblem={handleRequestProblem} />}
                 <input type="file" ref={fileInputRef} onChange={handleImportStats} accept=".json" className="hidden" />

                <div className="hidden lg:block lg:col-span-1">
                    <SqlDictionary />
                </div>
            
                <main className="w-full lg:col-span-3 space-y-6">
                    <ProblemDescription problem={currentProblem} />

                    <div className="bg-[#252526] rounded-md shadow-lg">
                        <div className="flex justify-between items-center bg-[#3c3c3c] p-2 rounded-t-md border-b border-gray-900/50 flex-wrap gap-2">
                             <div className="flex items-center space-x-4">
                                <span className="text-sm font-semibold text-gray-200 ml-2">Main.sql</span>
                                <div className="h-5 w-px bg-gray-600"></div>
                                <button
                                    onClick={() => setIsDashboardOpen(true)}
                                    title="View Dashboard"
                                    className="p-1 rounded-md hover:bg-gray-600/50 transition-colors flex items-center space-x-1.5"
                                    aria-label="Open performance dashboard"
                                >
                                    <ChartBarIcon className="w-5 h-5 text-gray-300" />
                                    <span className="text-xs text-gray-300">Dashboard</span>
                                </button>
                                 <button
                                    onClick={handleExportStats}
                                    title="Export Stats"
                                    className="p-1 rounded-md hover:bg-gray-600/50 transition-colors flex items-center space-x-1.5"
                                    aria-label="Export performance data"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-300" />
                                     <span className="text-xs text-gray-300">Export</span>
                                </button>
                                 <button
                                    onClick={() => fileInputRef.current?.click()}
                                    title="Import Stats"
                                    className="p-1 rounded-md hover:bg-gray-600/50 transition-colors flex items-center space-x-1.5"
                                    aria-label="Import performance data"
                                >
                                    <ArrowUpTrayIcon className="w-5 h-5 text-gray-300" />
                                    <span className="text-xs text-gray-300">Import</span>
                                </button>
                            </div>
                            <div className="flex items-center space-x-4">
                                <ToggleSwitch
                                    id="hard-mode"
                                    checked={isHardMode}
                                    onChange={handleHardModeToggle}
                                    label="Hard Mode"
                                />
                                <span className="text-xs text-gray-400">Problem #{problemCounter}</span>
                                {evaluationResult?.isCorrect && <div className="p-1 rounded-md bg-green-500/20"><CheckCircleIcon className="w-5 h-5 text-green-400"/></div>}
                                <button
                                    onClick={() => setEditorTheme(prev => prev === 'default' ? 'console' : 'default')}
                                    title="Toggle Console Theme"
                                    className="p-1 rounded-full hover:bg-gray-600/50 transition-colors"
                                    aria-label="Toggle editor theme"
                                >
                                    <TerminalIcon className="w-5 h-5 text-gray-300" />
                                </button>
                            </div>
                        </div>
                        <SqlEditor value={sqlQuery} onChange={setSqlQuery} theme={editorTheme} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleRunQuery}
                                disabled={isProcessing || isGenerating}
                                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                {isProcessing && lastAction === 'run' ? 'Running...' : 'Run Query'}
                            </button>
                            <button
                                onClick={handleSubmitQuery}
                                disabled={isProcessing || isGenerating || (evaluationResult?.isCorrect ?? false)}
                                className="bg-[#007acc] hover:bg-[#008ae6] text-white font-bold py-2 px-6 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                {isProcessing && lastAction === 'submit' ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                        <button
                            onClick={handleNextProblem}
                            disabled={isGenerating || isProcessing || !evaluationResult?.isCorrect || confidenceRating === null}
                            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? 'Generating...' : 'Next Problem →'}
                        </button>
                    </div>
                    
                    <div className="bg-[#252526] rounded-md shadow-lg p-6 min-h-[200px]">
                        <h2 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-700 pb-2">Output</h2>
                        {isProcessing && <QuerySpinner text={lastAction === 'run' ? 'Running query...' : 'Evaluating your submission...'} />}
                        {error && !evaluationResult && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
                        
                        {evaluationResult && (
                            <div className="space-y-4">
                                <div className={`flex items-start space-x-3 p-3 rounded-md ${evaluationResult.isCorrect ? 'bg-green-900/50 border border-green-700/50' : 'bg-red-900/50 border border-red-700/50'}`}>
                                    {evaluationResult.isCorrect 
                                        ? <CheckCircleIcon className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" /> 
                                        : <XCircleIcon className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                                    }
                                    <p className={`text-base ${evaluationResult.isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                                        {evaluationResult.feedback}
                                    </p>
                                </div>
                                
                                {evaluationResult.isCorrect && (
                                     <div className="bg-gray-800/50 border border-gray-700/50 rounded-md p-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-200">Rate Your Confidence</h3>
                                            <p className="text-sm text-gray-400">This helps us pick your next problem.</p>
                                        </div>
                                        <ConfidenceRater
                                            rating={confidenceRating}
                                            onRate={setConfidenceRating}
                                            disabled={confidenceRating !== null}
                                        />
                                    </div>
                                )}

                                <ResultTable data={evaluationResult.resultData} />
                            </div>
                        )}

                        {runResultData && !evaluationResult && (
                            <ResultTable data={runResultData} />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
