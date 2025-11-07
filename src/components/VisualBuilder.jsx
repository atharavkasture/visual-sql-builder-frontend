

// // import React from 'react';
// // import { Plus, Trash2, ArrowDown, ArrowUp } from 'lucide-react';

// // // Helper component for UI sections
// // const BuilderSection = ({ title, children }) => (
// //     <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
// //         <h3 className="text-md font-semibold text-slate-700 mb-4">{title}</h3>
// //         <div className="space-y-4">{children}</div>
// //     </div>
// // );

// // // Helper for form inputs
// // const FormInput = ({ label, children }) => (
// //     <div>
// //         <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
// //         {children}
// //     </div>
// // );

// // // Helper component for a single filter row in the WHERE clause
// // const FilterRow = ({ filter, onUpdate, onRemove, columns }) => (
// //     <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-md">
// //         <select value={filter.column} onChange={e => onUpdate({ ...filter, column: e.target.value })} className="input-field">
// //             <option value="">Column</option>
// //             {columns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
// //         </select>
// //         <select value={filter.operator} onChange={e => onUpdate({ ...filter, operator: e.target.value })} className="input-field">
// //             <option value="=">=</option>
// //             <option value="!=">!=</option>
// //             <option value=">">&gt;</option>
// //             <option value="<">&lt;</option>
// //             <option value="LIKE">LIKE</option>
// //             <option value="IN">IN</option>
// //         </select>
// //         <input type="text" value={filter.value} onChange={e => onUpdate({ ...filter, value: e.target.value })} placeholder="Value" className="input-field flex-1" />
// //         <button onClick={onRemove} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
// //             <Trash2 size={16} />
// //         </button>
// //     </div>
// // );

// // const VisualBuilder = ({ schema, config, onConfigChange }) => {
// //     const { selectedTable } = config;
// //     const tableSchema = schema.tables.find(t => t.name === selectedTable);
// //     const columns = tableSchema ? tableSchema.columns : [];

// //     const handleConfig = (key, value) => {
// //         onConfigChange({ ...config, [key]: value });
// //     };

// //     const addFilter = () => handleConfig('filters', [...config.filters, { id: Date.now(), column: '', operator: '=', value: '' }]);
// //     const updateFilter = (updatedFilter) => handleConfig('filters', config.filters.map(f => f.id === updatedFilter.id ? updatedFilter : f));
// //     const removeFilter = (id) => handleConfig('filters', config.filters.filter(f => f.id !== id));

// //     const renderSelectBuilder = () => (
// //         <BuilderSection title={`Querying Table: ${selectedTable || '...'}`}>
// //             {!selectedTable ? <p className="text-slate-500">Please select a table from the left panel first.</p> :
// //             <div className="space-y-6">
// //                 <div>
// //                     <h3 className="font-semibold text-sm text-slate-600 mb-2">Filters (WHERE)</h3>
// //                     <div className="space-y-2">
// //                         {config.filters.map(filter => (
// //                             <FilterRow key={filter.id} filter={filter} onUpdate={updateFilter} onRemove={() => removeFilter(filter.id)} columns={columns} />
// //                         ))}
// //                     </div>
// //                     <button onClick={addFilter} className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:underline">
// //                         <Plus size={16} /> Add filter
// //                     </button>
// //                 </div>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                     <div>
// //                         <FormInput label="Group By">
// //                             <select multiple value={config.groupBy} onChange={e => handleConfig('groupBy', Array.from(e.target.selectedOptions, option => option.value))} className="input-field w-full h-24">
// //                                 {columns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
// //                             </select>
// //                         </FormInput>
// //                     </div>
// //                     <div>
// //                         <FormInput label="Order By">
// //                             <div className="flex gap-2">
// //                                 <select value={config.orderBy.column} onChange={e => handleConfig('orderBy', {...config.orderBy, column: e.target.value})} className="input-field flex-1">
// //                                     <option value="">None</option>
// //                                     {columns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
// //                                 </select>
// //                                 <button onClick={() => handleConfig('orderBy', {...config.orderBy, direction: config.orderBy.direction === 'ASC' ? 'DESC' : 'ASC'})} className="p-2 border rounded-md border-slate-300">
// //                                     {config.orderBy.direction === 'ASC' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
// //                                 </button>
// //                             </div>
// //                         </FormInput>
// //                     </div>
// //                 </div>
// //                 <div>
// //                     <FormInput label="Limit">
// //                         <input type="number" placeholder="e.g., 100" value={config.limit} onChange={e => handleConfig('limit', e.target.value)} className="input-field w-32" />
// //                     </FormInput>
// //                 </div>
// //             </div>}
// //         </BuilderSection>
// //     );

// //     const renderDMLBuilder = (type) => (
// //          <BuilderSection title={`${type} from table: ${selectedTable || '...'}`}>
// //             {!selectedTable ? <p className="text-slate-500">Please select a table from the left panel first.</p> :
// //             <div className="space-y-4">
// //                  <h3 className="font-semibold text-sm text-slate-600 mb-2">{type === 'INSERT' ? 'Values to Insert' : 'Values to Update'}</h3>
// //                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                     {columns.map(col => (
// //                         <div key={col.name}>
// //                             <label className="block text-sm font-medium text-slate-600 mb-1">{col.name} <span className="text-slate-400 text-xs uppercase">({col.type})</span></label>
// //                             <input 
// //                                 type="text" 
// //                                 className="input-field w-full"
// //                                 value={config.values[col.name] || ''}
// //                                 onChange={e => handleConfig('values', {...config.values, [col.name]: e.target.value})}
// //                             />
// //                         </div>
// //                     ))}
// //                 </div>
// //                 {(type === 'UPDATE' || type === 'DELETE') && (
// //                  <div>
// //                     <h3 className="font-semibold my-2 text-sm text-slate-600">Filters (WHERE Clause)</h3>
// //                      <p className="text-xs text-amber-600 mb-2">Warning: Without a WHERE clause, this operation will affect all rows in the table.</p>
// //                     <div className="space-y-2">
// //                         {config.filters.map(filter => (
// //                             <FilterRow key={filter.id} filter={filter} onUpdate={updateFilter} onRemove={() => removeFilter(filter.id)} columns={columns} />
// //                         ))}
// //                     </div>
// //                     <button onClick={addFilter} className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:underline">
// //                         <Plus size={16} /> Add filter
// //                     </button>
// //                 </div>
// //             )}
// //             </div>}
// //          </BuilderSection>
// //     );

// //     const renderCreateTableBuilder = () => (
// //         <BuilderSection title="Create New Table">
// //             <FormInput label="Table Name">
// //                 <input type="text" placeholder="e.g., employees" value={config.newTableName} onChange={e => handleConfig('newTableName', e.target.value)} className="input-field w-full" />
// //             </FormInput>
// //             <div>
// //                 <h4 className="text-sm font-medium text-slate-600 mb-2">Columns</h4>
// //                 <div className="space-y-2">
// //                     {config.newColumns.map((col, index) => (
// //                         <div key={col.id} className="grid grid-cols-12 gap-2 items-center p-2 bg-slate-50 rounded-md">
// //                             <input type="text" placeholder="Column Name" value={col.name} onChange={e => {
// //                                 const newCols = [...config.newColumns]; newCols[index].name = e.target.value; handleConfig('newColumns', newCols);
// //                             }} className="input-field col-span-4" />
// //                              <select value={col.type} onChange={e => {
// //                                 const newCols = [...config.newColumns]; newCols[index].type = e.target.value; handleConfig('newColumns', newCols);
// //                             }} className="input-field col-span-3">
// //                                 <option>TEXT</option><option>VARCHAR(255)</option><option>INT</option><option>DECIMAL</option><option>DATE</option>
// //                             </select>
// //                              <select value={col.constraint} onChange={e => {
// //                                 const newCols = [...config.newColumns]; newCols[index].constraint = e.target.value; handleConfig('newColumns', newCols);
// //                             }} className="input-field col-span-4">
// //                                 <option value="NONE">No Constraint</option><option value="PRIMARY KEY">PRIMARY KEY</option><option value="NOT NULL">NOT NULL</option>
// //                             </select>
// //                             <button onClick={() => {
// //                                 const newCols = config.newColumns.filter(c => c.id !== col.id); handleConfig('newColumns', newCols);
// //                             }} className="text-red-500 hover:text-red-700 col-span-1 justify-self-center"><Trash2 size={16} /></button>
// //                         </div>
// //                     ))}
// //                 </div>
// //                 <button onClick={() => handleConfig('newColumns', [...config.newColumns, { id: Date.now(), name: '', type: 'TEXT', constraint: 'NONE' }])}
// //                     className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:underline">
// //                     <Plus size={16} /> Add Column
// //                 </button>
// //             </div>
// //         </BuilderSection>
// //     );

// //     const renderAlterTableBuilder = () => (
// //         <BuilderSection title={`Alter Table: ${config.selectedTable || '...'}`}>
// //             {!config.selectedTable ? <p className="text-slate-500">Please select a table from the left panel first.</p> :
// //             <>
// //                 <FormInput label="Alter Action">
// //                     <select value={config.alterType} onChange={e => handleConfig('alterType', e.target.value)} className="input-field w-full">
// //                         <option value="RENAME_TABLE">Rename Table</option>
// //                         <option value="ADD_COLUMN">Add Column</option>
// //                     </select>
// //                 </FormInput>
// //                 {config.alterType === 'RENAME_TABLE' && (
// //                     <FormInput label="New Table Name">
// //                         <input type="text" placeholder="e.g., old_orders" value={config.renameTo} onChange={e => handleConfig('renameTo', e.target.value)} className="input-field w-full" />
// //                     </FormInput>
// //                 )}
// //                 {config.alterType === 'ADD_COLUMN' && (
// //                     <div className="flex gap-2">
// //                         <FormInput label="New Column Name"><input type="text" placeholder="e.g., notes" value={config.addColumn.name} onChange={e => handleConfig('addColumn', {...config.addColumn, name: e.target.value})} className="input-field w-full" /></FormInput>
// //                         <FormInput label="Column Type"><select value={config.addColumn.type} onChange={e => handleConfig('addColumn', {...config.addColumn, type: e.target.value})} className="input-field w-full"><option>TEXT</option><option>VARCHAR(255)</option><option>INT</option><option>DECIMAL</option><option>DATE</option></select></FormInput>
// //                     </div>
// //                 )}
// //             </>}
// //         </BuilderSection>
// //     );

// //     const renderDropTableBuilder = () => (
// //         <BuilderSection title={`Drop Table: ${config.selectedTable || '...'}`}>
// //             {!config.selectedTable ? <p className="text-slate-500">Please select a table from the left panel first.</p> :
// //             <>
// //                 <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
// //                     <span className="font-bold">Warning:</span> This action is irreversible and will permanently delete the table and all its data.
// //                 </p>
// //                 <FormInput label={`To confirm, please type the name of the table: ${config.selectedTable}`}>
// //                     <input type="text" value={config.newTableName} onChange={e => handleConfig('newTableName', e.target.value)} className="input-field w-full" />
// //                 </FormInput>
// //             </>}
// //         </BuilderSection>
// //     );

// //     const renderUnsupportedBuilder = (action) => (
// //         <BuilderSection title={`${action}`}>
// //             <p className="text-slate-500">
// //                 Visual builder for <span className="font-semibold">{action}</span> is not supported in this environment.
// //                 <br /><br />
// //                 DCL commands like GRANT and REVOKE are used by server-based databases to manage user permissions, which is an administrative task.
// //             </p>
// //         </BuilderSection>
// //     );

// //     const renderAction = () => {
// //         switch (config.action) {
// //             case 'SELECT': return renderSelectBuilder();
// //             case 'INSERT': case 'UPDATE': case 'DELETE': return renderDMLBuilder(config.action);
// //             case 'CREATE TABLE': return renderCreateTableBuilder();
// //             case 'ALTER TABLE': return renderAlterTableBuilder();
// //             case 'DROP TABLE': return renderDropTableBuilder();
// //             case 'GRANT': case 'REVOKE': return renderUnsupportedBuilder(config.action);
// //             default: return <p className="text-center text-slate-500">Select an action to begin building your query.</p>;
// //         }
// //     };

// //     return (
// //         <div className="visual-builder">
// //             <style>{`.input-field { @apply block w-full sm:text-sm rounded-md bg-white border border-slate-300 p-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm; }`}</style>
// //             {renderAction()}
// //         </div>
// //     );
// // };

// // export default VisualBuilder;

// import React from 'react';
// import { Plus, Trash2, ArrowDown, ArrowUp } from 'lucide-react';

// // Helper component for UI sections
// const BuilderSection = ({ title, children }) => (
//     <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
//         <h3 className="text-md font-semibold text-slate-700 mb-4">{title}</h3>
//         <div className="space-y-4">{children}</div>
//     </div>
// );

// // Helper for form inputs
// const FormInput = ({ label, children }) => (
//     <div>
//         <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
//         {children}
//     </div>
// );

// // Helper component for a single filter row (WHERE)
// const FilterRow = ({ filter, onUpdate, onRemove, columns }) => (
//     <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-md">
//         <select value={filter.column} onChange={e => onUpdate({ ...filter, column: e.target.value })} className="input-field">
//             <option value="">Column</option>
//             {columns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
//         </select>
//         <select value={filter.operator} onChange={e => onUpdate({ ...filter, operator: e.target.value })} className="input-field">
//             <option value="=">=</option><option value="!=">!=</option><option value=">">&gt;</option><option value="<">&lt;</option>
//             <option value="LIKE">LIKE</option><option value="IN">IN</option>
//         </select>
//         <input type="text" value={filter.value} onChange={e => onUpdate({ ...filter, value: e.target.value })} placeholder="Value" className="input-field flex-1" />
//         <button onClick={onRemove} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
//     </div>
// );

// // NEW: A component for JOIN rows
// const JoinRow = ({ join, onUpdate, onRemove, allTables, currentTableColumns, schema }) => {
//     const targetTableSchema = schema.tables.find(t => t.name === join.targetTable);
//     const targetTableColumns = targetTableSchema ? targetTableSchema.columns : [];

//     return (
//         <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-md">
//             <select value={join.type} onChange={e => onUpdate({ ...join, type: e.target.value })} className="input-field">
//                 <option>INNER JOIN</option><option>LEFT JOIN</option><option>RIGHT JOIN</option>
//             </select>
//             <select value={join.targetTable} onChange={e => onUpdate({ ...join, targetTable: e.target.value })} className="input-field">
//                 <option value="">Target Table</option>
//                 {allTables.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
//             </select>
//             <span className="text-slate-500">ON</span>
//             <select value={join.onCol1} onChange={e => onUpdate({ ...join, onCol1: e.target.value })} className="input-field">
//                 <option value="">Col 1</option>
//                 {currentTableColumns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
//             </select>
//             <span className="text-slate-500">=</span>
//             <select value={join.onCol2} onChange={e => onUpdate({ ...join, onCol2: e.target.value })} className="input-field">
//                 <option value="">Col 2</option>
//                 {targetTableColumns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
//             </select>
//             <button onClick={onRemove} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
//         </div>
//     );
// };

// // NEW: A component for HAVING rows
// const HavingRow = ({ having, onUpdate, onRemove, selectedColumns }) => (
//     <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-md">
//         <select value={having.column} onChange={e => onUpdate({ ...having, column: e.target.value })} className="input-field">
//             <option value="">Aggregated Column</option>
//             {/* Only show columns that are aggregated */}
//             {selectedColumns.filter(c => c.aggregation !== 'NONE').map(c => 
//                 <option key={c.name} value={c.name}>{`${c.aggregation}(${c.name})`}</option>
//             )}
//         </select>
//         <select value={having.operator} onChange={e => onUpdate({ ...having, operator: e.target.value })} className="input-field">
//             <option value="=">=</option><option value="!=">!=</option><option value=">">&gt;</option><option value="<">&lt;</option>
//         </select>
//         <input type="text" value={having.value} onChange={e => onUpdate({ ...having, value: e.target.value })} placeholder="Value" className="input-field flex-1" />
//         <button onClick={onRemove} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
//     </div>
// );

// const VisualBuilder = ({ schema, config, onConfigChange, dbType }) => {
//     const { selectedTable } = config;
//     const tableSchema = schema.tables.find(t => t.name === selectedTable);
//     const columns = tableSchema ? tableSchema.columns : [];

//     const handleConfig = (key, value) => {
//         onConfigChange({ ...config, [key]: value });
//     };

//     const addFilter = () => handleConfig('filters', [...config.filters, { id: Date.now(), column: '', operator: '=', value: '' }]);
//     const updateFilter = (updatedFilter) => handleConfig('filters', config.filters.map(f => f.id === updatedFilter.id ? updatedFilter : f));
//     const removeFilter = (id) => handleConfig('filters', config.filters.filter(f => f.id !== id));

//     const renderSelectBuilder = () => (
//         <BuilderSection title={`Querying Table: ${config.selectedTable || '...'}`}>
//             {!config.selectedTable ? <p className="text-slate-500">Please select a table from the left panel first.</p> :
//             <div className="space-y-6">
                
//                 {/* NEW: JOIN BUILDER */}
//                 <div>
//                     <h3 className="font-semibold text-sm text-slate-600 mb-2">JOINs</h3>
//                     <div className="space-y-2">
//                         {config.joins.map(join => (
//                             <JoinRow key={join.id} join={join}
//                                 onUpdate={(updatedJoin) => handleConfig('joins', config.joins.map(j => j.id === updatedJoin.id ? updatedJoin : j))}
//                                 onRemove={() => handleConfig('joins', config.joins.filter(j => j.id !== join.id))}
//                                 allTables={schema.tables.filter(t => t.name !== config.selectedTable)}
//                                 currentTableColumns={columns}
//                                 schema={schema}
//                             />
//                         ))}
//                     </div>
//                     <button onClick={() => handleConfig('joins', [...config.joins, { id: Date.now(), type: 'INNER JOIN', targetTable: '', onCol1: '', onCol2: '' }])}
//                         className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:underline">
//                         <Plus size={16} /> Add JOIN
//                     </button>
//                 </div>

//                 {/* WHERE BUILDER */}
//                 <div>
//                     <h3 className="font-semibold text-sm text-slate-600 mb-2">Filters (WHERE)</h3>
//                     <div className="space-y-2">
//                         {config.filters.map(filter => (
//                             <FilterRow key={filter.id} filter={filter} onUpdate={updateFilter} onRemove={() => removeFilter(filter.id)} columns={columns} />
//                         ))}
//                     </div>
//                     <button onClick={addFilter} className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:underline">
//                         <Plus size={16} /> Add filter
//                     </button>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* GROUP BY */}
//                     <div>
//                         <FormInput label="Group By">
//                             <select multiple value={config.groupBy} onChange={e => handleConfig('groupBy', Array.from(e.target.selectedOptions, option => option.value))} className="input-field w-full h-24">
//                                 {columns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
//                             </select>
//                         </FormInput>
//                     </div>
                    
//                     {/* NEW: HAVING BUILDER */}
//                     <div>
//                         <FormInput label="Having (for aggregated groups)">
//                             <div className="space-y-2">
//                                 {config.having.map(hav => (
//                                     <HavingRow key={hav.id} having={hav}
//                                         onUpdate={(updatedHav) => handleConfig('having', config.having.map(h => h.id === updatedHav.id ? updatedHav : h))}
//                                         onRemove={() => handleConfig('having', config.having.filter(h => h.id !== hav.id))}
//                                         selectedColumns={config.selectedColumns}
//                                     />
//                                 ))}
//                             </div>
//                             <button onClick={() => handleConfig('having', [...config.having, { id: Date.now(), column: '', operator: '>', value: '' }])}
//                                 className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:underline"
//                                 disabled={config.selectedColumns.filter(c => c.aggregation !== 'NONE').length === 0}
//                                 title={config.selectedColumns.filter(c => c.aggregation !== 'NONE').length === 0 ? "You must select an aggregated column (e.g., COUNT) to use HAVING" : ""}
//                             >
//                                 <Plus size={16} /> Add HAVING clause
//                             </button>
//                         </FormInput>
//                     </div>
//                 </div>
//                 {/* ORDER BY and LIMIT */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <FormInput label="Order By">
//                             <div className="flex gap-2">
//                                 <select value={config.orderBy.column} onChange={e => handleConfig('orderBy', {...config.orderBy, column: e.target.value})} className="input-field flex-1">
//                                     <option value="">None</option>
//                                     {config.selectedColumns.map(c => <option key={c.name} value={c.name}>{c.aggregation !== 'NONE' ? `${c.aggregation}(${c.name})` : c.name}</option>)}
//                                 </select>
//                                 <button onClick={() => handleConfig('orderBy', {...config.orderBy, direction: config.orderBy.direction === 'ASC' ? 'DESC' : 'ASC'})} className="p-2 border rounded-md border-slate-300">
//                                     {config.orderBy.direction === 'ASC' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
//                                 </button>
//                             </div>
//                         </FormInput>
//                     </div>
//                     <div>
//                         <FormInput label="Limit">
//                             <input type="number" placeholder="e.g., 100" value={config.limit} onChange={e => handleConfig('limit', e.target.value)} className="input-field w-32" />
//                         </FormInput>
//                     </div>
//                 </div>
//             </div>}
//         </BuilderSection>
//     );

//     const renderDMLBuilder = (type) => (
//          <BuilderSection title={`${type} from table: ${selectedTable || '...'}`}>
//             {!selectedTable ? <p className="text-slate-500">Please select a table from the left panel first.</p> :
//             <div className="space-y-4">
//                  <h3 className="font-semibold text-sm text-slate-600 mb-2">{type === 'INSERT' ? 'Values to Insert' : 'Values to Update'}</h3>
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {columns.map(col => (
//                         <div key={col.name}>
//                             <label className="block text-sm font-medium text-slate-600 mb-1">{col.name} <span className="text-slate-400 text-xs uppercase">({col.type})</span></label>
//                             <input type="text" className="input-field w-full" value={config.values[col.name] || ''} onChange={e => handleConfig('values', {...config.values, [col.name]: e.target.value})} />
//                         </div>
//                     ))}
//                 </div>
//                 {(type === 'UPDATE' || type === 'DELETE') && (
//                  <div>
//                     <h3 className="font-semibold my-2 text-sm text-slate-600">Filters (WHERE Clause)</h3>
//                      <p className="text-xs text-amber-600 mb-2">Warning: Without a WHERE clause, this operation will affect all rows in the table.</p>
//                     <div className="space-y-2">
//                         {config.filters.map(filter => (<FilterRow key={filter.id} filter={filter} onUpdate={updateFilter} onRemove={() => removeFilter(filter.id)} columns={columns} />))}
//                     </div>
//                     <button onClick={addFilter} className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:underline"><Plus size={16} /> Add filter</button>
//                 </div>
//             )}
//             </div>}
//          </BuilderSection>
//     );

//     const renderCreateTableBuilder = () => (
//         <BuilderSection title="Create New Table">
//             <FormInput label="Table Name"><input type="text" placeholder="e.g., employees" value={config.newTableName} onChange={e => handleConfig('newTableName', e.target.value)} className="input-field w-full" /></FormInput>
//             <div>
//                 <h4 className="text-sm font-medium text-slate-600 mb-2">Columns</h4>
//                 <div className="space-y-2">
//                     {config.newColumns.map((col, index) => (
//                         <div key={col.id} className="grid grid-cols-12 gap-2 items-center p-2 bg-slate-50 rounded-md">
//                             <input type="text" placeholder="Column Name" value={col.name} onChange={e => { const newCols = [...config.newColumns]; newCols[index].name = e.target.value; handleConfig('newColumns', newCols); }} className="input-field col-span-4" />
//                              <select value={col.type} onChange={e => { const newCols = [...config.newColumns]; newCols[index].type = e.target.value; handleConfig('newColumns', newCols); }} className="input-field col-span-3">
//                                 <option>TEXT</option><option>VARCHAR(255)</option><option>INT</option><option>DECIMAL</option><option>DATE</option>
//                             </select>
//                              <select value={col.constraint} onChange={e => { const newCols = [...config.newColumns]; newCols[index].constraint = e.target.value; handleConfig('newColumns', newCols); }} className="input-field col-span-4">
//                                 <option value="NONE">No Constraint</option><option value="PRIMARY KEY">PRIMARY KEY</option><option value="NOT NULL">NOT NULL</option>
//                             </select>
//                             <button onClick={() => { const newCols = config.newColumns.filter(c => c.id !== col.id); handleConfig('newColumns', newCols); }} className="text-red-500 hover:text-red-700 col-span-1 justify-self-center"><Trash2 size={16} /></button>
//                         </div>
//                     ))}
//                 </div>
//                 <button onClick={() => handleConfig('newColumns', [...config.newColumns, { id: Date.now(), name: '', type: 'TEXT', constraint: 'NONE' }])}
//                     className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:underline">
//                     <Plus size={16} /> Add Column
//                 </button>
//             </div>
//         </BuilderSection>
//     );

//     const renderAlterTableBuilder = () => (
//         <BuilderSection title={`Alter Table: ${config.selectedTable || '...'}`}>
//             {!config.selectedTable ? <p className="text-slate-500">Please select a table from the left panel first.</p> :
//             <>
//                 <FormInput label="Alter Action">
//                     <select value={config.alterType} onChange={e => handleConfig('alterType', e.target.value)} className="input-field w-full">
//                         <option value="RENAME_TABLE">Rename Table</option>
//                         <option value="ADD_COLUMN">Add Column</option>
//                         <option value="DROP_COLUMN">Drop Column</option>
//                     </select>
//                 </FormInput>
//                 {config.alterType === 'RENAME_TABLE' && (
//                     <FormInput label="New Table Name">
//                         <input type="text" placeholder="e.g., old_orders" value={config.renameTo} onChange={e => handleConfig('renameTo', e.target.value)} className="input-field w-full" />
//                     </FormInput>
//                 )}
//                 {config.alterType === 'ADD_COLUMN' && (
//                     <div className="flex gap-2">
//                         <FormInput label="New Column Name"><input type="text" placeholder="e.g., notes" value={config.addColumn.name} onChange={e => handleConfig('addColumn', {...config.addColumn, name: e.target.value})} className="input-field w-full" /></FormInput>
//                         <FormInput label="Column Type"><select value={config.addColumn.type} onChange={e => handleConfig('addColumn', {...config.addColumn, type: e.target.value})} className="input-field w-full"><option>TEXT</option><option>VARCHAR(255)</option><option>INT</option><option>DECIMAL</option><option>DATE</option></select></FormInput>
//                     </div>
//                 )}
//                 {config.alterType === 'DROP_COLUMN' && (
//                     <FormInput label="Column to Drop">
//                         <select value={config.dropColumn} onChange={e => handleConfig('dropColumn', e.target.value)} className="input-field w-full">
//                             <option value="">Select column...</option>
//                             {columns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
//                         </select>
//                     </FormInput>
//                 )}
//             </>}
//         </BuilderSection>
//     );

//     const renderDropTableBuilder = () => (
//         <BuilderSection title={`Drop Table: ${config.selectedTable || '...'}`}>
//             {!config.selectedTable ? <p className="text-slate-500">Please select a table from the left panel first.</p> :
//             <>
//                 <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
//                     <span className="font-bold">Warning:</span> This action is irreversible and will permanently delete the table and all its data.
//                 </p>
//                 <FormInput label={`To confirm, please type the name of the table: ${config.selectedTable}`}>
//                     <input type="text" value={config.newTableName} onChange={e => handleConfig('newTableName', e.target.value)} className="input-field w-full" />
//                 </FormInput>
//             </>}
//         </BuilderSection>
//     );
    
//     const renderTruncateTableBuilder = () => (
//         <BuilderSection title={`Truncate Table: ${config.selectedTable || '...'}`}>
//             {!config.selectedTable ? <p className="text-slate-500">Please select a table from the left panel first.</p> :
//             <>
//                 <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
//                     <span className="font-bold">Warning:</span> This action is irreversible. It will delete ALL data from the table (but not the table itself).
//                 </p>
//                 <FormInput label={`To confirm, please type the name of the table: ${config.selectedTable}`}>
//                     <input type="text" value={config.newTableName} onChange={e => handleConfig('newTableName', e.target.value)} className="input-field w-full" />
//                 </FormInput>
//             </>}
//          </BuilderSection>
//     );

//     const renderSimpleBuilder = (action) => (
//         <BuilderSection title={action}>
//             <p className="text-slate-500">
//                 This will generate a simple `{action}` statement. No further configuration is needed. Click "Run Query" to execute.
//             </p>
//         </BuilderSection>
//     );

//     const renderUnsupportedBuilder = (action) => (
//         <BuilderSection title={`${action}`}>
//             <p className="text-slate-500">
//                 Visual builder for <span className="font-semibold">{action}</span> is not supported in this environment.
//                 <br /><br />
//                 DCL commands like GRANT and REVOKE are used by server-based databases to manage user permissions, which is an administrative task.
//             </p>
//         </BuilderSection>
//     );

//     const renderAction = () => {
//         switch (config.action) {
//             case 'SELECT': return renderSelectBuilder();
//             case 'INSERT': case 'UPDATE': case 'DELETE': return renderDMLBuilder(config.action);
//             case 'CREATE TABLE': return renderCreateTableBuilder();
//             case 'ALTER TABLE': return renderAlterTableBuilder();
//             case 'DROP TABLE': return renderDropTableBuilder();
//             case 'TRUNCATE TABLE': return renderTruncateTableBuilder();
//             case 'COMMIT': case 'ROLLBACK': return renderSimpleBuilder(config.action);
//             case 'GRANT': case 'REVOKE': return renderUnsupportedBuilder(config.action);
//             default: return <p className="text-center text-slate-500">Select an action to begin building your query.</p>;
//         }
//     };

//     return (
//         <div className="visual-builder">
//             <style>{`.input-field { @apply block w-full sm:text-sm rounded-md bg-white border border-slate-300 p-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm; }`}</style>
//             {renderAction()}
//         </div>
//     );
// };

// export default VisualBuilder;
import React from 'react';
import { Plus, Trash2, ArrowDown, ArrowUp } from 'lucide-react';

// Helper component for UI sections
const BuilderSection = ({ title, children }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-md font-semibold text-slate-700 mb-4">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

// Helper for form inputs
const FormInput = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        {children}
    </div>
);

// Helper component for a single filter row (WHERE)
const FilterRow = ({ filter, onUpdate, onRemove, columns }) => (
    <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-md">
        <select value={filter.column} onChange={e => onUpdate({ ...filter, column: e.target.value })} className="input-field">
            <option value="">Column</option>
            {columns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        <select value={filter.operator} onChange={e => onUpdate({ ...filter, operator: e.target.value })} className="input-field">
            <option value="=">=</option><option value="!=">!=</option><option value=">">&gt;</option><option value="<">&lt;</option>
            <option value="LIKE">LIKE</option><option value="IN">IN</option>
        </select>
        <input type="text" value={filter.value} onChange={e => onUpdate({ ...filter, value: e.target.value })} placeholder="Value" className="input-field flex-1" />
        <button onClick={onRemove} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
    </div>
);

// NEW: A component for JOIN rows
const JoinRow = ({ join, onUpdate, onRemove, allTables, currentTableColumns, schema }) => {
    const targetTableSchema = schema.tables.find(t => t.name === join.targetTable);
    const targetTableColumns = targetTableSchema ? targetTableSchema.columns : [];

    return (
        <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-md">
            <select value={join.type} onChange={e => onUpdate({ ...join, type: e.target.value })} className="input-field">
                <option>INNER JOIN</option><option>LEFT JOIN</option><option>RIGHT JOIN</option>
            </select>
            <select value={join.targetTable} onChange={e => onUpdate({ ...join, targetTable: e.target.value })} className="input-field">
                <option value="">Target Table</option>
                {allTables.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
            <span className="text-slate-500">ON</span>
            <select value={join.onCol1} onChange={e => onUpdate({ ...join, onCol1: e.target.value })} className="input-field">
                <option value="">Col 1</option>
                {currentTableColumns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <span className="text-slate-500">=</span>
            <select value={join.onCol2} onChange={e => onUpdate({ ...join, onCol2: e.target.value })} className="input-field">
                <option value="">Col 2</option>
                {targetTableColumns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <button onClick={onRemove} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
        </div>
    );
};

// NEW: A component for HAVING rows
const HavingRow = ({ having, onUpdate, onRemove, selectedColumns }) => (
    <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-md">
        <select value={having.column} onChange={e => onUpdate({ ...having, column: e.target.value })} className="input-field">
            <option value="">Aggregated Column</option>
            {/* Only show columns that are aggregated */}
            {selectedColumns.filter(c => c.aggregation !== 'NONE').map(c => 
                <option key={c.name} value={c.name}>{`${c.aggregation}(${c.name})`}</option>
            )}
        </select>
        <select value={having.operator} onChange={e => onUpdate({ ...having, operator: e.target.value })} className="input-field">
            <option value="=">=</option><option value="!=">!=</option><option value=">">&gt;</option><option value="<">&lt;</option>
        </select>
        <input type="text" value={having.value} onChange={e => onUpdate({ ...having, value: e.target.value })} placeholder="Value" className="input-field flex-1" />
        <button onClick={onRemove} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
    </div>
);


const VisualBuilder = ({ schema, config, onConfigChange, dbType }) => {
    const { selectedTable } = config;
    const tableSchema = schema.tables.find(t => t.name === selectedTable);
    const columns = tableSchema ? tableSchema.columns : [];

    const handleConfig = (key, value) => {
        onConfigChange({ ...config, [key]: value });
    };

    const addFilter = () => handleConfig('filters', [...config.filters, { id: Date.now(), column: '', operator: '=', value: '' }]);
    const updateFilter = (updatedFilter) => handleConfig('filters', config.filters.map(f => f.id === updatedFilter.id ? updatedFilter : f));
    const removeFilter = (id) => handleConfig('filters', config.filters.filter(f => f.id !== id));

    const renderSelectBuilder = () => (
        <BuilderSection title={`Querying Table: ${config.selectedTable || '...'}`}>
            {!config.selectedTable ? <p className="text-slate-500">Please select a table from the left panel first.</p> :
            <div className="space-y-6">
                
                {/* NEW: JOIN BUILDER */}
                <div>
                    <h3 className="font-semibold text-sm text-slate-600 mb-2">JOINs</h3>
                    <div className="space-y-2">
                        {config.joins.map(join => (
                            <JoinRow key={join.id} join={join}
                                onUpdate={(updatedJoin) => handleConfig('joins', config.joins.map(j => j.id === updatedJoin.id ? updatedJoin : j))}
                                onRemove={() => handleConfig('joins', config.joins.filter(j => j.id !== join.id))}
                                allTables={schema.tables.filter(t => t.name !== config.selectedTable)}
                                currentTableColumns={columns}
                                schema={schema}
                            />
                        ))}
                    </div>
                    <button onClick={() => handleConfig('joins', [...config.joins, { id: Date.now(), type: 'INNER JOIN', targetTable: '', onCol1: '', onCol2: '' }])}
                        className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:underline">
                        <Plus size={16} /> Add JOIN
                    </button>
                </div>

                {/* WHERE BUILDER */}
                <div>
                    <h3 className="font-semibold text-sm text-slate-600 mb-2">Filters (WHERE)</h3>
                    <div className="space-y-2">
                        {config.filters.map(filter => (
                            <FilterRow key={filter.id} filter={filter} onUpdate={updateFilter} onRemove={() => removeFilter(filter.id)} columns={columns} />
                        ))}
                    </div>
                    <button onClick={addFilter} className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:underline">
                        <Plus size={16} /> Add filter
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* GROUP BY */}
                    <div>
                        <FormInput label="Group By">
                            <select multiple value={config.groupBy} onChange={e => handleConfig('groupBy', Array.from(e.target.selectedOptions, option => option.value))} className="input-field w-full h-24">
                                {columns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                        </FormInput>
                    </div>
                    
                    {/* NEW: HAVING BUILDER */}
                    <div>
                        <FormInput label="Having (for aggregated groups)">
                            <div className="space-y-2">
                                {config.having.map(hav => (
                                    <HavingRow key={hav.id} having={hav}
                                        onUpdate={(updatedHav) => handleConfig('having', config.having.map(h => h.id === updatedHav.id ? updatedHav : h))}
                                        onRemove={() => handleConfig('having', config.having.filter(h => h.id !== hav.id))}
                                        selectedColumns={config.selectedColumns}
                                    />
                                ))}
                            </div>
                            <button onClick={() => handleConfig('having', [...config.having, { id: Date.now(), column: '', operator: '>', value: '' }])}
                                className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                disabled={config.selectedColumns.filter(c => c.aggregation !== 'NONE').length === 0}
                                title={config.selectedColumns.filter(c => c.aggregation !== 'NONE').length === 0 ? "You must select an aggregated column (e.g., COUNT) to use HAVING" : ""}
                            >
                                <Plus size={16} /> Add HAVING clause
                            </button>
                        </FormInput>
                    </div>
                </div>
                {/* ORDER BY and LIMIT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <FormInput label="Order By">
                            <div className="flex gap-2">
                                <select value={config.orderBy.column} onChange={e => handleConfig('orderBy', {...config.orderBy, column: e.target.value})} className="input-field flex-1">
                                    <option value="">None</option>
                                    {config.selectedColumns.map(c => <option key={c.name} value={c.name}>{c.aggregation !== 'NONE' ? `${c.aggregation}(${c.name})` : c.name}</option>)}
                                </select>
                                <button onClick={() => handleConfig('orderBy', {...config.orderBy, direction: config.orderBy.direction === 'ASC' ? 'DESC' : 'ASC'})} className="p-2 border rounded-md border-slate-300">
                                    {config.orderBy.direction === 'ASC' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                                </button>
                            </div>
                        </FormInput>
                    </div>
                    <div>
                        <FormInput label="Limit">
                            <input type="number" placeholder="e.g., 100" value={config.limit} onChange={e => handleConfig('limit', e.target.value)} className="input-field w-32" />
                        </FormInput>
                    </div>
                </div>
            </div>}
        </BuilderSection>
    );

    const renderDMLBuilder = (type) => (
         <BuilderSection title={`${type} from table: ${selectedTable || '...'}`}>
            {!selectedTable ? <p className="text-slate-500">Please select a table from the left panel first.</p> :
            <div className="space-y-4">
                 <h3 className="font-semibold text-sm text-slate-600 mb-2">{type === 'INSERT' ? 'Values to Insert' : 'Values to Update'}</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {columns.map(col => (
                        <div key={col.name}>
                            <label className="block text-sm font-medium text-slate-600 mb-1">{col.name} <span className="text-slate-400 text-xs uppercase">({col.type})</span></label>
                            <input type="text" className="input-field w-full" value={config.values[col.name] || ''} onChange={e => handleConfig('values', {...config.values, [col.name]: e.target.value})} />
                        </div>
                    ))}
                </div>
                {(type === 'UPDATE' || type === 'DELETE') && (
                 <div>
                    <h3 className="font-semibold my-2 text-sm text-slate-600">Filters (WHERE Clause)</h3>
                     <p className="text-xs text-amber-600 mb-2">Warning: Without a WHERE clause, this operation will affect all rows in the table.</p>
                    <div className="space-y-2">
                        {config.filters.map(filter => (<FilterRow key={filter.id} filter={filter} onUpdate={updateFilter} onRemove={() => removeFilter(filter.id)} columns={columns} />))}
                    </div>
                    <button onClick={addFilter} className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:underline"><Plus size={16} /> Add filter</button>
                </div>
            )}
            </div>}
         </BuilderSection>
    );

    const renderCreateTableBuilder = () => (
        <BuilderSection title="Create New Table">
            <FormInput label="Table Name"><input type="text" placeholder="e.g., employees" value={config.newTableName} onChange={e => handleConfig('newTableName', e.target.value)} className="input-field w-full" /></FormInput>
            <div>
                <h4 className="text-sm font-medium text-slate-600 mb-2">Columns</h4>
                <div className="space-y-2">
                    {config.newColumns.map((col, index) => (
                        <div key={col.id} className="grid grid-cols-12 gap-2 items-center p-2 bg-slate-50 rounded-md">
                            <input type="text" placeholder="Column Name" value={col.name} onChange={e => { const newCols = [...config.newColumns]; newCols[index].name = e.target.value; handleConfig('newColumns', newCols); }} className="input-field col-span-4" />
                             <select value={col.type} onChange={e => { const newCols = [...config.newColumns]; newCols[index].type = e.target.value; handleConfig('newColumns', newCols); }} className="input-field col-span-3">
                                <option>TEXT</option><option>VARCHAR(255)</option><option>INT</option><option>DECIMAL</option><option>DATE</option>
                            </select>
                             <select value={col.constraint} onChange={e => { const newCols = [...config.newColumns]; newCols[index].constraint = e.target.value; handleConfig('newColumns', newCols); }} className="input-field col-span-4">
                                <option value="NONE">No Constraint</option><option value="PRIMARY KEY">PRIMARY KEY</option><option value="NOT NULL">NOT NULL</option>
                            </select>
                            <button onClick={() => { const newCols = config.newColumns.filter(c => c.id !== col.id); handleConfig('newColumns', newCols); }} className="text-red-500 hover:text-red-700 col-span-1 justify-self-center"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
                <button onClick={() => handleConfig('newColumns', [...config.newColumns, { id: Date.now(), name: '', type: 'TEXT', constraint: 'NONE' }])}
                    className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:underline">
                    <Plus size={16} /> Add Column
                </button>
            </div>
        </BuilderSection>
    );

    const renderAlterTableBuilder = () => (
        <BuilderSection title={`Alter Table: ${config.selectedTable || '...'}`}>
            {!config.selectedTable ? <p className="text-slate-500">Please select a table from the left panel first.</p> :
            <>
                <FormInput label="Alter Action">
                    <select value={config.alterType} onChange={e => handleConfig('alterType', e.target.value)} className="input-field w-full">
                        <option value="RENAME_TABLE">Rename Table</option>
                        <option value="ADD_COLUMN">Add Column</option>
                        <option value="DROP_COLUMN">Drop Column</option>
                    </select>
                </FormInput>
                {config.alterType === 'RENAME_TABLE' && (
                    <FormInput label="New Table Name">
                        <input type="text" placeholder="e.g., old_orders" value={config.renameTo} onChange={e => handleConfig('renameTo', e.target.value)} className="input-field w-full" />
                    </FormInput>
                )}
                {config.alterType === 'ADD_COLUMN' && (
                    <div className="flex gap-2">
                        <FormInput label="New Column Name"><input type="text" placeholder="e.g., notes" value={config.addColumn.name} onChange={e => handleConfig('addColumn', {...config.addColumn, name: e.target.value})} className="input-field w-full" /></FormInput>
                        <FormInput label="Column Type"><select value={config.addColumn.type} onChange={e => handleConfig('addColumn', {...config.addColumn, type: e.target.value})} className="input-field w-full"><option>TEXT</option><option>VARCHAR(255)</option><option>INT</option><option>DECIMAL</option><option>DATE</option></select></FormInput>
                    </div>
                )}
                {config.alterType === 'DROP_COLUMN' && (
                    <FormInput label="Column to Drop">
                        <select value={config.dropColumn} onChange={e => handleConfig('dropColumn', e.target.value)} className="input-field w-full">
                            <option value="">Select column...</option>
                            {columns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                    </FormInput>
                )}
            </>}
        </BuilderSection>
    );

    const renderDropTableBuilder = () => (
        <BuilderSection title={`Drop Table: ${config.selectedTable || '...'}`}>
            {!config.selectedTable ? <p className="text-slate-500">Please select a table from the left panel first.</p> :
            <>
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    <span className="font-bold">Warning:</span> This action is irreversible and will permanently delete the table and all its data.
                </p>
                <FormInput label={`To confirm, please type the name of the table: ${config.selectedTable}`}>
                    <input type="text" value={config.newTableName} onChange={e => handleConfig('newTableName', e.target.value)} className="input-field w-full" />
                </FormInput>
            </>}
        </BuilderSection>
    );
    
    const renderTruncateTableBuilder = () => (
        <BuilderSection title={`Truncate Table: ${config.selectedTable || '...'}`}>
            {!config.selectedTable ? <p className="text-slate-500">Please select a table from the left panel first.</p> :
            <>
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    <span className="font-bold">Warning:</span> This action is irreversible. It will delete ALL data from the table (but not the table itself).
                </p>
                <FormInput label={`To confirm, please type the name of the table: ${config.selectedTable}`}>
                    <input type="text" value={config.newTableName} onChange={e => handleConfig('newTableName', e.target.value)} className="input-field w-full" />
                </FormInput>
            </>}
         </BuilderSection>
    );

    const renderSimpleBuilder = (action) => (
        <BuilderSection title={action}>
            <p className="text-slate-500">
                This will generate a simple `{action}` statement. No further configuration is needed. Click "Run Query" to execute.
            </p>
        </BuilderSection>
    );

    const renderUnsupportedBuilder = (action) => (
        <BuilderSection title={`${action}`}>
            <p className="text-slate-500">
                Visual builder for <span className="font-semibold">{action}</span> is not supported in this environment.
                <br /><br />
                DCL commands like GRANT and REVOKE are used by server-based databases to manage user permissions, which is an administrative task.
            </p>
        </BuilderSection>
    );

    const renderAction = () => {
        switch (config.action) {
            case 'SELECT': return renderSelectBuilder();
            case 'INSERT': case 'UPDATE': case 'DELETE': return renderDMLBuilder(config.action);
            case 'CREATE TABLE': return renderCreateTableBuilder();
            case 'ALTER TABLE': return renderAlterTableBuilder();
            case 'DROP TABLE': return renderDropTableBuilder();
            case 'TRUNCATE TABLE': return renderTruncateTableBuilder();
            case 'COMMIT': case 'ROLLBACK': return renderSimpleBuilder(config.action);
            case 'GRANT': case 'REVOKE': return renderUnsupportedBuilder(config.action);
            default: return <p className="text-center text-slate-500">Select an action to begin building your query.</p>;
        }
    };

    return (
        <div className="visual-builder">
            <style>{`.input-field { @apply block w-full sm:text-sm rounded-md bg-white border border-slate-300 p-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm; }`}</style>
            {renderAction()}
        </div>
    );
};

export default VisualBuilder;


