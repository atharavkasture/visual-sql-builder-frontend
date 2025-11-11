import React, { useState, useEffect } from 'react';
import { Play, Save, Download, DatabaseZap, BarChart2, PieChart, Table } from 'lucide-react';

// Simple FormInput component
const FormInput = ({ label, children }) => (
    <div className="flex items-center gap-1">
        <label className="text-xs font-medium text-slate-700 whitespace-nowrap">{label}:</label>
        {children}
    </div>
);

const SavedQueries = ({ onClose, onLoad }) => {
    const savedQueries = JSON.parse(localStorage.getItem('savedQueries') || '[]');
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">Saved Queries</h3>
                <div className="space-y-2 max-h-96 overflow-auto">
                    {savedQueries.map(q => (
                        <div key={q.id} className="flex justify-between items-center p-2 border rounded hover:bg-slate-50">
                            <span>{q.name}</span>
                            <button onClick={() => { onLoad(q.config); onClose(); }} className="btn-primary text-xs">Load</button>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="mt-4 btn-secondary w-full">Close</button>
            </div>
        </div>
    );
};

const QueryChart = ({ type, data, xKey, yKey }) => {
    if (!xKey || !yKey) {
        return (
            <div className="p-4 text-center text-slate-500">
                Please select a Label (Text) and Value (Number) column from the Chart Settings above to render the chart.
            </div>
        );
    }

    // Simple bar chart implementation
    if (type === 'bar') {
        const maxValue = Math.max(...data.map(row => row[yKey]));
        return (
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4 text-center">{yKey} by {xKey}</h3>
                <div className="space-y-2">
                    {data.map((row, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-24 text-sm truncate">{row[xKey]}</div>
                            <div className="flex-1 bg-slate-200 rounded h-8 relative">
                                <div 
                                    className="bg-blue-500 h-full rounded flex items-center justify-end pr-2 text-white text-sm"
                                    style={{ width: `${(row[yKey] / maxValue) * 100}%` }}
                                >
                                    {row[yKey]}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Simple pie chart implementation
    if (type === 'pie') {
        const total = data.reduce((sum, row) => sum + row[yKey], 0);
        let currentAngle = 0;
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
        
        return (
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4 text-center">{yKey} by {xKey}</h3>
                <div className="flex items-center justify-center gap-8">
                    <svg viewBox="0 0 200 200" className="w-64 h-64">
                        {data.map((row, i) => {
                            const percentage = (row[yKey] / total) * 100;
                            const angle = (percentage / 100) * 360;
                            const startAngle = currentAngle;
                            currentAngle += angle;
                            
                            const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                            const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                            const x2 = 100 + 80 * Math.cos((currentAngle - 90) * Math.PI / 180);
                            const y2 = 100 + 80 * Math.sin((currentAngle - 90) * Math.PI / 180);
                            const largeArc = angle > 180 ? 1 : 0;
                            
                            return (
                                <path
                                    key={i}
                                    d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                    fill={colors[i % colors.length]}
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            );
                        })}
                    </svg>
                    <div className="space-y-2">
                        {data.map((row, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div 
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: colors[i % colors.length] }}
                                />
                                <span className="text-sm">{row[xKey]}: {row[yKey]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

const ResultsPanel = ({ result, isLoading, onRunQuery, queryConfig, onConfigChange, chartConfig, onChartConfigChange }) => {
    const [showSaved, setShowSaved] = useState(false);
    const [viewMode, setViewMode] = useState('table');

    const isDDL = queryConfig.queryType === 'DDL';

    const [stringCols, setStringCols] = useState([]);
    const [numberCols, setNumberCols] = useState([]);
    
    const canShowChart = result && result.data && result.data.length > 0 &&
        Object.values(result.data[0]).some(val => typeof val === 'number') &&
        Object.values(result.data[0]).some(val => typeof val === 'string');
    
    useEffect(() => { 
        setViewMode('table'); 
        if (canShowChart) {
            const headers = Object.keys(result.data[0]);
            setStringCols(headers.filter(h => typeof result.data[0][h] === 'string'));
            setNumberCols(headers.filter(h => typeof result.data[0][h] === 'number'));
        } else {
            setStringCols([]);
            setNumberCols([]);
        }
    }, [result, canShowChart]);

    const downloadCSV = () => {
        if (!result || !result.data || result.data.length === 0) return;
        const headers = Object.keys(result.data[0]);
        const csvRows = [ headers.join(','), ...result.data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(',')) ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `${queryConfig.selectedTable || 'query'}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    
    const saveQuery = () => {
        const queryName = prompt("Enter a name for this query:");
        if (queryName) {
            const savedQueries = JSON.parse(localStorage.getItem('savedQueries') || '[]');
            savedQueries.push({ name: queryName, config: queryConfig, id: Date.now() });
            localStorage.setItem('savedQueries', JSON.stringify(savedQueries));
            alert(`Query "${queryName}" saved!`);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="flex-shrink-0 p-2 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-slate-700">Actions & Results</h3>
                    {canShowChart && (
                        <div className="flex items-center bg-slate-200 rounded-md p-0.5">
                            <button onClick={() => setViewMode('table')} className={`p-1 rounded ${viewMode === 'table' ? 'bg-white shadow-sm' : ''}`} title="Table View">
                                <Table size={16} />
                            </button>
                            <button onClick={() => setViewMode('bar')} className={`p-1 rounded ${viewMode === 'bar' ? 'bg-white shadow-sm' : ''}`} title="Bar Chart View">
                                <BarChart2 size={16} />
                            </button>
                            <button onClick={() => setViewMode('pie')} className={`p-1 rounded ${viewMode === 'pie' ? 'bg-white shadow-sm' : ''}`} title="Pie Chart View">
                                <PieChart size={16} />
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onRunQuery} disabled={isLoading} className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1 text-sm">
                        <Play size={16} />
                        <span>{isLoading ? 'Running...' : 'Run Query'}</span>
                    </button>
                    <button onClick={saveQuery} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 text-sm" title="Save Query">
                        <Save size={16} />
                    </button>
                    <button onClick={() => setShowSaved(true)} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 text-sm">
                        Load Saved
                    </button>
                    <button onClick={downloadCSV} disabled={!result || !result.data || isDDL} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 disabled:opacity-50 text-sm" title="Download CSV">
                        <Download size={16} />
                    </button>
                </div>
            </div>

            {(viewMode === 'bar' || viewMode === 'pie') && canShowChart && (
                <div className="p-2 bg-slate-100 border-b border-slate-200 flex items-center gap-4">
                    <span className="text-sm font-semibold">Chart Settings:</span>
                    <FormInput label="Labels (X-Axis)">
                        <select 
                            value={chartConfig.xKey} 
                            onChange={e => onChartConfigChange({...chartConfig, xKey: e.target.value})}
                            className="text-sm rounded-md bg-white border border-slate-300 px-2 py-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        >
                            <option value="">Select Text Column...</option>
                            {stringCols.map(key => <option key={key} value={key}>{key}</option>)}
                        </select>
                    </FormInput>
                    <FormInput label="Values (Y-Axis)">
                        <select 
                            value={chartConfig.yKey}
                            onChange={e => onChartConfigChange({...chartConfig, yKey: e.target.value})}
                            className="text-sm rounded-md bg-white border border-slate-300 px-2 py-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        >
                            <option value="">Select Number Column...</option>
                            {numberCols.map(key => <option key={key} value={key}>{key}</option>)}
                        </select>
                    </FormInput>
                </div>
            )}
            
            {isLoading && <div className="p-8 text-center text-slate-500">Executing query...</div>}

            {result && !isLoading && (
                <div className="flex-grow flex flex-col overflow-hidden">
                    <div className="p-2 text-xs text-slate-500 flex justify-between border-b border-slate-200">
                        <span>{result.message || `Query returned ${result.meta.rowsReturned} rows.`}</span>
                        <span>Runtime: {result.meta.runtimeMs} ms</span>
                    </div>

                    {(viewMode === 'bar' || viewMode === 'pie') && canShowChart ? (
                        <div className="flex-grow overflow-auto">
                            <QueryChart 
                                type={viewMode} 
                                data={result.data} 
                                xKey={chartConfig.xKey}
                                yKey={chartConfig.yKey}
                            />
                        </div>
                    ) : (
                        result.data && result.data.length > 0 ? (
                            <div className="flex-grow overflow-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-600 uppercase bg-slate-100 sticky top-0">
                                        <tr>
                                            {Object.keys(result.data[0]).map(key => (
                                                <th key={key} scope="col" className="px-4 py-2 font-medium">{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {result.data.map((row, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                {Object.values(row).map((val, j) => (
                                                    <td key={j} className="px-4 py-2 whitespace-nowrap">{String(val)}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col items-center justify-center text-slate-500 p-4">
                                <DatabaseZap size={48} className="text-green-500 mb-4" />
                                <h4 className="font-semibold text-slate-700">Query Executed Successfully</h4>
                                <p className="text-center">The operation completed with no rows returned. This is normal for commands like INSERT, UPDATE, or CREATE TABLE.</p>
                            </div>
                        )
                    )}
                </div>
            )}
            
            {!result && !isLoading && (
                <div className="flex-grow flex items-center justify-center text-slate-400 p-4 text-center">
                    Run a query to see the results here.
                </div>
            )}
            
            {showSaved && <SavedQueries onClose={() => setShowSaved(false)} onLoad={onConfigChange} />}
        </div>
    );
};

export default ResultsPanel;
