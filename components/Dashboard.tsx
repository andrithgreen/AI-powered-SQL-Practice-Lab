
import React from 'react';
import { UserStats } from '../types';
import { SQL_COMMANDS } from './sqlDictionaryData';

interface DashboardProps {
    stats: UserStats;
    onClose: () => void;
    onRequestProblem: (category: string) => void;
}

const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
);

const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <div className="bg-gray-800/60 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-100">{value}</p>
    </div>
);

const getAccuracyColor = (accuracy: number) => {
    if (accuracy < 60) return 'text-red-400';
    if (accuracy < 80) return 'text-amber-400';
    return 'text-green-400';
};

const Dashboard: React.FC<DashboardProps> = ({ stats, onClose, onRequestProblem }) => {
    const overallAccuracy = stats.totalUniqueAttempts > 0
        ? ((stats.totalProblemsCompleted / stats.totalUniqueAttempts) * 100).toFixed(1)
        : '0.0';

    const avgConfidence = stats.totalProblemsCompleted > 0
        ? (stats.totalConfidence / stats.totalProblemsCompleted).toFixed(1)
        : '0.0';
    
    const categoryData = Object.values(stats.byCategory).sort((a,b) => a.category.localeCompare(b.category));

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-title"
        >
            <div 
                className="bg-[#252526] w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 id="dashboard-title" className="text-xl font-semibold text-gray-100">Performance Dashboard</h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                        aria-label="Close dashboard"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-400" />
                    </button>
                </header>

                <main className="p-6 space-y-8 overflow-y-auto">
                    <section>
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">Overall Performance</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard title="Problems Completed" value={stats.totalProblemsCompleted} />
                            <StatCard title="Overall Accuracy" value={`${overallAccuracy}%`} />
                            <StatCard title="Avg. Confidence" value={`${avgConfidence} / 5.0`} />
                        </div>
                         <p className="text-xs text-gray-500 mt-2 text-center">"Overall Accuracy" is based on your first attempt for each problem.</p>
                    </section>
                    
                    <section>
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">Performance by Category</h3>
                        {categoryData.length === 0 ? (
                            <div className="text-center py-8 bg-gray-800/50 rounded-lg">
                                <p className="text-gray-400">No data yet. Complete some problems to see your stats!</p>
                            </div>
                        ) : (
                             <div className="overflow-x-auto border border-gray-700 rounded-lg">
                                <table className="w-full text-sm text-left text-gray-400">
                                    <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                                        <tr>
                                            <th scope="col" className="px-4 py-3">Category</th>
                                            <th scope="col" className="px-4 py-3 text-center">Accuracy</th>
                                            <th scope="col" className="px-4 py-3 text-center">Avg. Attempts</th>
                                            <th scope="col" className="px-4 py-3 text-center">Avg. Confidence</th>
                                            <th scope="col" className="px-4 py-3 text-center">Completed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categoryData.map(cat => {
                                            const accuracy = (cat.correct / cat.totalAttempts) * 100;
                                            const avgAttempts = cat.totalAttempts / cat.completed;
                                            const avgConfidence = cat.totalConfidence / cat.completed;

                                            return (
                                                <tr key={cat.category} className="bg-gray-800/50 border-b border-gray-700 last:border-b-0">
                                                    <td className="px-4 py-3 font-medium text-gray-200">{cat.category}</td>
                                                    <td className={`px-4 py-3 text-center font-semibold ${getAccuracyColor(accuracy)}`}>{accuracy.toFixed(1)}%</td>
                                                    <td className="px-4 py-3 text-center">{avgAttempts.toFixed(1)}</td>
                                                    <td className="px-4 py-3 text-center">{avgConfidence.toFixed(1)} / 5</td>
                                                    <td className="px-4 py-3 text-center">{cat.completed}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">Request a New Problem</h3>
                        <p className="text-sm text-gray-400 mb-4">Focus your practice by generating a problem from a specific category.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {SQL_COMMANDS.map(cat => (
                                <button
                                    key={cat.category}
                                    onClick={() => onRequestProblem(cat.category)}
                                    className="text-left p-3 bg-gray-800/60 rounded-lg hover:bg-gray-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#252526] focus:ring-[#007acc]"
                                >
                                    <p className="font-semibold text-gray-200">{cat.category}</p>
                                    <p className="text-xs text-gray-500">{cat.description}</p>
                                </button>
                            ))}
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
};

export default Dashboard;
