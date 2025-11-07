
// import React, { useState } from 'react';
// import { Search, Key } from 'lucide-react';

// const LeftSchemaPanel = ({ schema, selectedTable, selectedColumns, onTableSelect, onColumnToggle }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const tables = schema.tables || [];
//     const currentTable = tables.find(t => t.name === selectedTable);
//     const selectedColumnNames = selectedColumns.map(c => c.name);

//     const filteredColumns = currentTable ? currentTable.columns.filter(col =>
//         col.name.toLowerCase().includes(searchTerm.toLowerCase())
//     ) : [];

//     return (
//         <div className="p-4 h-full flex flex-col">
//             <h2 className="text-lg font-semibold mb-3 text-slate-800">Schema Explorer</h2>
//             <div className="mb-4">
//                 <label htmlFor="table-select" className="text-sm font-medium text-slate-600">Table</label>
//                 <select id="table-select" value={selectedTable} onChange={(e) => onTableSelect(e.target.value)}
//                     className="mt-1 w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white border shadow-sm">
//                     <option value="">Select a table...</option>
//                     {tables.map(table => (
//                         <option key={table.name} value={table.name}>{table.name}</option>
//                     ))}
//                 </select>
//             </div>
//             {currentTable && (
//                 <div className="flex-grow flex flex-col overflow-hidden">
//                     <div className="relative mb-2">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                         <input type="text" placeholder="Search columns..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full pl-10 pr-4 py-2 text-sm border-slate-300 rounded-md bg-white border shadow-sm focus:ring-blue-500 focus:border-blue-500" />
//                     </div>
//                     <div className="flex-grow overflow-y-auto -mr-2 pr-2">
//                         <ul className="space-y-1 pt-1">
//                             {filteredColumns.map(column => (
//                                 <li key={column.name}>
//                                     <label className="flex items-center p-2 rounded-md hover:bg-slate-100 cursor-pointer">
//                                         <input type="checkbox" checked={selectedColumnNames.includes(column.name)} onChange={() => onColumnToggle(column)}
//                                             className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//                                         <span className="ml-3 text-sm font-medium text-slate-700">{column.name}</span>
//                                         {column.pk > 0 && <Key size={12} className="ml-1 text-amber-500" title="Primary Key" />}
//                                         <span className="ml-auto text-xs text-slate-500 uppercase">{column.type}</span>
//                                     </label>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default LeftSchemaPanel;

import React, { useState } from 'react';
import { Search, Key } from 'lucide-react';

const AGG_OPTIONS = ['NONE', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX'];

const LeftSchemaPanel = ({ schema, selectedTable, selectedColumns, onTableSelect, onColumnChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const tables = schema.tables || [];
    const currentTable = tables.find(t => t.name === selectedTable);

    const filteredColumns = currentTable ? currentTable.columns.filter(col =>
        col.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    // This is now a map for faster lookups: { 'column_name': 'AGG_TYPE' }
    const selectedColumnMap = new Map(selectedColumns.map(c => [c.name, c.aggregation]));

    return (
        <div className="p-4 h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-3 text-slate-800">Schema Explorer</h2>
            <div className="mb-4">
                <label htmlFor="table-select" className="text-sm font-medium text-slate-600">Table</label>
                <select id="table-select" value={selectedTable} onChange={(e) => onTableSelect(e.target.value)}
                    className="mt-1 w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white border shadow-sm">
                    <option value="">Select a table...</option>
                    {tables.map(table => (
                        <option key={table.name} value={table.name}>{table.name}</option>
                    ))}
                </select>
            </div>
            {currentTable && (
                <div className="flex-grow flex flex-col overflow-hidden">
                    <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search columns..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border-slate-300 rounded-md bg-white border shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="flex-grow overflow-y-auto -mr-2 pr-2">
                        <ul className="space-y-1 pt-1">
                            {filteredColumns.map(column => {
                                const isChecked = selectedColumnMap.has(column.name);
                                const currentAgg = selectedColumnMap.get(column.name) || 'NONE';
                                
                                return (
                                    <li key={column.name} className="p-2 rounded-md hover:bg-slate-100">
                                        <div className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                checked={isChecked} 
                                                // Pass null to toggle off, or 'NONE' to toggle on
                                                onChange={() => onColumnChange(column.name, isChecked ? null : 'NONE')} 
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-3 text-sm font-medium text-slate-700">{column.name}</span>
                                            {column.pk > 0 && <Key size={12} className="ml-1 text-amber-500" title="Primary Key" />}
                                            <span className="ml-auto text-xs text-slate-500 uppercase">{column.type}</span>
                                        </div>
                                        {/* NEW: Aggregation dropdown, only visible if the column is checked */}
                                        {isChecked && (
                                            <div className="mt-2 pl-7">
                                                <select 
                                                    value={currentAgg}
                                                    onChange={(e) => onColumnChange(column.name, e.target.value)}
                                                    className="input-field text-xs w-full"
                                                >
                                                    {AGG_OPTIONS.map(agg => (
                                                        <option key={agg} value={agg}>{agg}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}
            <style>{`.input-field { @apply block w-full sm:text-sm rounded-md bg-white border border-slate-300 p-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm; }`}</style>
        </div>
    );
};

export default LeftSchemaPanel;