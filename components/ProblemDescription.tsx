
import React from 'react';
import { Problem } from '../types';

const ProblemDescription: React.FC<{ problem: Problem }> = ({ problem }) => {
    
    const renderQuestion = (text: string) => {
        const nodes: React.ReactNode[] = [];
        const lines = text.split('\n');
        let listBuffer: string[] = [];

        const flushList = () => {
            if (listBuffer.length > 0) {
                nodes.push(
                    <ul key={`list-${nodes.length}`} className="list-disc list-inside space-y-2 pl-4">
                        {listBuffer.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                );
                listBuffer = [];
            }
        };

        lines.forEach((line) => {
            const trimmedLine = line.trim();
            // Check for markdown-style list items
            if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                listBuffer.push(trimmedLine.substring(2));
            } else {
                flushList(); // End of a list, render it
                // Render non-empty lines as paragraphs
                if (trimmedLine !== '') {
                    nodes.push(<p key={`p-${nodes.length}`}>{line}</p>);
                }
            }
        });

        flushList(); // Render any list that might be at the very end of the text

        return nodes;
    };

    return (
        <div className="p-8 bg-[#252526] rounded-md shadow-lg">
            <h1 className="text-3xl font-bold mb-4 text-gray-100">{problem.title}</h1>
            <div className="space-y-4 text-gray-300">
                {problem.schema.map(table => (
                     <div key={table.name} className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">
                            Table: <code className="bg-gray-900/60 px-2 py-1 rounded-md font-mono text-amber-400">{table.name}</code>
                        </h3>
                        {table.description && (
                            <p className="mb-2 text-gray-400">{table.description}</p>
                        )}
                        {table.columns.length > 0 && (
                            <ul className="list-disc list-inside space-y-2 pl-4 text-gray-400">
                                {table.columns.map(col => (
                                    <li key={col.name}>
                                        <code className="font-semibold text-gray-200 text-base">{col.name}</code> &mdash; <span className="text-gray-400">{col.type}</span>{col.description && <span className="text-gray-500 italic"> ({col.description})</span>}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
               
                {/* This container will render the parsed question content */}
                <div className="mt-6 text-lg text-gray-200 space-y-4">
                    {renderQuestion(problem.question)}
                </div>
            </div>
        </div>
    );
};

export default ProblemDescription;
