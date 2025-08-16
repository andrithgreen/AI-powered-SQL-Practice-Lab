
import React, { useState } from 'react';
import { SQL_COMMANDS, CommandCategory } from './sqlDictionaryData';

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
);


const AccordionItem: React.FC<{ category: CommandCategory, isOpen: boolean, onToggle: () => void }> = ({ category, isOpen, onToggle }) => {
    return (
        <div className="border-b border-gray-700 last:border-b-0">
            <h2>
                <button
                    type="button"
                    onClick={onToggle}
                    className="flex items-center justify-between w-full p-4 font-medium text-left text-gray-300 hover:bg-gray-800/50 transition-colors"
                    aria-expanded={isOpen}
                >
                    <div className="flex flex-col">
                        <span className="text-gray-200">{category.category}</span>
                        <span className="text-xs text-gray-500 font-normal mt-1">{category.description}</span>
                    </div>
                    <ChevronDownIcon className={`w-5 h-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </h2>
            <div className={`${isOpen ? 'block' : 'hidden'} bg-black/20`}>
                <div className="p-4 space-y-4">
                    {category.commands.map(command => (
                        <div key={command.name}>
                            <h4 className="font-semibold text-amber-400">{command.name}</h4>
                            <p className="text-sm text-gray-400 mt-1 mb-2">{command.description}</p>
                            <pre className="bg-[#1e1e1e] p-2 rounded-md text-sm text-cyan-300 overflow-x-auto">
                                <code className="font-mono">{command.syntax}</code>
                            </pre>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SqlDictionary: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <aside className="bg-[#252526] rounded-md shadow-lg h-full max-h-[calc(100vh-80px)] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-200 p-4 border-b border-gray-700 sticky top-0 bg-[#252526] z-10">
                SQL Command Reference
            </h2>
            <div id="accordion-flush">
                {SQL_COMMANDS.map((category, index) => (
                    <AccordionItem
                        key={index}
                        category={category}
                        isOpen={openIndex === index}
                        onToggle={() => handleToggle(index)}
                    />
                ))}
            </div>
        </aside>
    );
};

export default SqlDictionary;
