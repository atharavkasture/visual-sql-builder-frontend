import React, { useState } from 'react';
import { Sparkles, Bot, X, Send, Clipboard } from 'lucide-react';

// MODIFIED: Now accepts backendUrl as a prop from App.jsx
const AISidebar = ({ schema, onUseQuery, onClose, dbType, backendUrl }) => {
    const [userInput, setUserInput] = useState('');
    const [generatedQuery, setGeneratedQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!userInput.trim()) return;
        setIsLoading(true);
        setGeneratedQuery('');
        try {
            // <-- 1. THIS IS THE FIX.
            // It now uses the 'backendUrl' prop instead of 'localhost'.
            const response = await fetch(`${backendUrl}/api/generate-query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // MODIFIED: Send the dbType to the backend
                body: JSON.stringify({ userInput, schema, dbType: dbType }),
            });
            const data = await response.json();
            if (response.ok) {
                setGeneratedQuery(data.sqlQuery);
            } else {
                setGeneratedQuery(`-- Error: ${data.error}`);
            }
        } catch (error) {
            setGeneratedQuery(`-- Network Error: Could not connect to the backend.`);
        }
        setIsLoading(false);
    };
    
    const handleCopy = () => {
        // This is a more robust copy-to-clipboard function
        // It works in more browsers and also inside iFrames
        if (!generatedQuery) return;
        
        try {
            const ta = document.createElement('textarea');
            ta.value = generatedQuery;
            ta.style.position = 'fixed'; // prevent scrolling to bottom
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy'); // Use execCommand as a fallback
            document.body.removeChild(ta);
            alert('Query copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Fallback for any other errors
            navigator.clipboard.writeText(generatedQuery)
                .then(() => alert('Query copied to clipboard!'))
                .catch(() => alert('Failed to copy query.'));
        }
    };

    return (
        <div className="absolute top-0 right-0 h-full w-80 bg-white border-l border-slate-200 shadow-xl flex flex-col z-20">
            <div className="flex items-center justify-between p-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <Bot size={20} className="text-blue-600" />
                    <h3 className="font-semibold text-slate-800">AI Assistant ({dbType === 'mysql' ? 'MySQL' : 'MariaDB'})</h3>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><X size={18} /></button>
            </div>
            
            <div className="p-3 flex-grow flex flex-col">
                <p className="text-xs text-slate-500 mb-2">Ask a question in plain English. The AI will generate a SQL query based on your database schema.</p>
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="e.g., Show me all shipped orders with a total amount over 100"
                    className="w-full h-24 p-2 text-sm border-slate-300 rounded-md bg-white border shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button onClick={handleGenerate} disabled={isLoading} className="btn-primary mt-2 w-full">
                    <Sparkles size={16} />
                    <span>{isLoading ? 'Generating...' : 'Generate Query'}</span>
                </button>

                {generatedQuery && (
                    <div className="mt-4 border-t border-slate-200 pt-4">
                        <h4 className="text-sm font-semibold mb-2">Generated SQL:</h4>
                        <pre className="bg-slate-100 p-2 rounded-md text-xs whitespace-pre-wrap font-mono relative">
                            <code>{generatedQuery}</code>
                            <button onClick={handleCopy} className="absolute top-1 right-1 p-1 hover:bg-slate-200 rounded" title="Copy to clipboard">
                                <Clipboard size={14} />
                            </button>
                        </pre>
                        <button onClick={() => onUseQuery(generatedQuery)} className="btn-secondary mt-2 w-full">
                            Use this Query
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AISidebar;