
import React from 'react';

interface ResultTableProps {
    data: Record<string, any>[];
}

const ResultTable: React.FC<ResultTableProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-gray-500 italic text-center py-4">Query executed successfully, no results returned.</div>;
    }

    const headers = Object.keys(data[0]);

    return (
        <div className="overflow-x-auto border border-gray-700 rounded-lg">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                    <tr>
                        {headers.map(header => (
                            <th key={header} scope="col" className="px-6 py-3">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="bg-gray-800/50 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/70">
                            {headers.map(header => (
                                <td key={`${rowIndex}-${header}`} className="px-6 py-4 font-mono">
                                    {String(row[header])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultTable;
