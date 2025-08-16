import React, { useState, useEffect, ChangeEvent, useRef } from 'react';

interface SqlEditorProps {
    value: string;
    onChange: (value: string) => void;
    theme: 'default' | 'console';
}

const SqlEditor: React.FC<SqlEditorProps> = ({ value, onChange, theme }) => {
    const [lineCount, setLineCount] = useState(1);
    const lineNumbersRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const lines = value.split('\n').length;
        setLineCount(lines);
    }, [value]);
    
    const handleScroll = () => {
        if (lineNumbersRef.current && textareaRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const handleValueChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

    const isConsole = theme === 'console';

    return (
        <div className={`flex font-mono text-[15px] leading-6 h-48 rounded-b-md border-t ${
            isConsole
                ? 'bg-black border-gray-900'
                : 'bg-[#1e1e1e] border-gray-700/50'
        }`}>
             <div ref={lineNumbersRef} className={`text-right p-3 pr-4 select-none overflow-y-hidden rounded-bl-md ${
                isConsole
                    ? 'text-green-700 bg-black'
                    : 'text-gray-500 bg-[#252526]'
             }`}>
                {lineNumbers.map(num => <div key={num}>{num}</div>)}
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleValueChange}
                onScroll={handleScroll}
                className={`flex-grow p-3 resize-none focus:outline-none w-full rounded-br-md ${
                    isConsole
                        ? 'bg-black text-green-400 caret-green-400'
                        : 'bg-[#1e1e1e] text-gray-300'
                }`}
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
            />
        </div>
    );
};

export default SqlEditor;