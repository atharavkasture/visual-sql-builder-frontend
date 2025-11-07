

// // export const buildSqlFromConfig = (config) => {
// //     const {
// //         queryType, action, selectedTable, selectedColumns, filters,
// //         groupBy, orderBy, limit, values, newTableName, newColumns,
// //         alterType, renameTo, addColumn
// //     } = config;

// //     // The switch statement now has a case for every action.
// //     switch (`${queryType}:${action}`) {
// //         case 'DQL:SELECT': {
// //             if (!selectedTable) return '-- Select a table to begin';
// //             if (selectedColumns.length === 0) return `SELECT *\nFROM \`${selectedTable}\`;`;
// //             const columns = selectedColumns.map(c => c.aggregation ? `${c.aggregation}(\`${c.name}\`)` : `\`${c.name}\``).join(', ');
// //             let sql = `SELECT ${columns}\nFROM \`${selectedTable}\``;
// //             if (filters.length > 0) {
// //                 const whereClauses = filters.filter(f => f.column && f.operator && f.value).map(f => `\`${f.column}\` ${f.operator} '${f.value}'`).join(' AND ');
// //                 if (whereClauses) sql += `\nWHERE ${whereClauses}`;
// //             }
// //             if (groupBy.length > 0) sql += `\nGROUP BY ${groupBy.map(g => `\`${g}\``).join(', ')}`;
// //             if (orderBy.column) sql += `\nORDER BY \`${orderBy.column}\` ${orderBy.direction}`;
// //             if (limit) sql += `\nLIMIT ${limit}`;
// //             return sql + ';';
// //         }
// //         case 'DML:INSERT': {
// //             if (!selectedTable) return '-- Select a table to insert into';
// //             const columns = Object.keys(values).filter(k => values[k]);
// //             if (columns.length === 0) return `-- Fill in values to insert into '${selectedTable}'`;
// //             const valueStrings = columns.map(c => `'${values[c]}'`).join(', ');
// //             return `INSERT INTO \`${selectedTable}\` (${columns.map(c => `\`${c}\``).join(', ')})\nVALUES (${valueStrings});`;
// //         }
// //         case 'DML:UPDATE': {
// //             if (!selectedTable) return '-- Select a table to update';
// //             const setClauses = Object.keys(values).filter(k => values[k]).map(k => `\`${k}\` = '${values[k]}'`).join(', ');
// //             if (!setClauses) return `-- Specify values to update in '${selectedTable}'`;
// //             let sql = `UPDATE \`${selectedTable}\`\nSET ${setClauses}`;
// //              if (filters.length > 0) {
// //                 const whereClauses = filters.filter(f => f.column && f.operator && f.value).map(f => `\`${f.column}\` ${f.operator} '${f.value}'`).join(' AND ');
// //                 if (whereClauses) sql += `\nWHERE ${whereClauses}`;
// //             } else {
// //                 sql += `\n-- WARNING: Add a WHERE clause to avoid updating all rows!`;
// //             }
// //             return sql + ';';
// //         }
// //         case 'DML:DELETE': {
// //             if (!selectedTable) return '-- Select a table to delete from';
// //             let sql = `DELETE FROM \`${selectedTable}\``;
// //              if (filters.length > 0) {
// //                 const whereClauses = filters.filter(f => f.column && f.operator && f.value).map(f => `\`${f.column}\` ${f.operator} '${f.value}'`).join(' AND ');
// //                 if (whereClauses) sql += `\nWHERE ${whereClauses}`;
// //             } else {
// //                 sql += `\n-- WARNING: Add a WHERE clause to avoid deleting all rows!`;
// //             }
// //             return sql + ';';
// //         }
// //         case 'DDL:CREATE TABLE': {
// //             if (!newTableName.trim()) return '-- Enter a table name';
// //             const validColumns = newColumns.filter(c => c.name.trim() && c.type.trim());
// //             if (validColumns.length === 0) return `-- Add at least one column for table '${newTableName}'`;
// //             const columnDefs = validColumns.map(c => {
// //                 let def = `\`${c.name}\` ${c.type}`;
// //                 if (c.constraint === 'PRIMARY KEY') def += ' PRIMARY KEY';
// //                 if (c.constraint === 'NOT NULL') def += ' NOT NULL';
// //                 return def;
// //             }).join(',\n  ');
// //             return `CREATE TABLE \`${newTableName}\` (\n  ${columnDefs}\n);`;
// //         }
// //         case 'DDL:ALTER TABLE': {
// //             if (!selectedTable) return '-- Select a table to alter';
// //             if (alterType === 'RENAME_TABLE') {
// //                 if (!renameTo.trim()) return `-- Enter the new name for table '${selectedTable}'`;
// //                 return `ALTER TABLE \`${selectedTable}\`\nRENAME TO \`${renameTo}\`;`;
// //             }
// //             if (alterType === 'ADD_COLUMN') {
// //                 if (!addColumn.name.trim()) return `-- Enter a name for the new column`;
// //                 return `ALTER TABLE \`${selectedTable}\`\nADD COLUMN \`${addColumn.name}\` ${addColumn.type};`;
// //             }
// //             return '-- Select an alter action';
// //         }
// //         case 'DDL:DROP TABLE': {
// //             if (!newTableName.trim()) return '-- Select a table and confirm its name to drop it';
// //             if (selectedTable !== newTableName) return `-- Confirmation failed: Typed name '${newTableName}' does not match selected table '${selectedTable}'`;
// //             return `DROP TABLE \`${selectedTable}\`;`;
// //         }
// //         case 'TCL:COMMIT':
// //             return 'COMMIT;';
// //         case 'TCL:ROLLBACK':
// //             return 'ROLLBACK;';
// //         case 'DCL:GRANT':
// //         case 'DCL:REVOKE':
// //             return `-- DCL commands are not typically run from an application. This is an administrative task.`;
        
// //         // The default case that was causing your error.
// //         default:
// //             return '-- Visual builder not implemented for this action yet.';
// //     }
// // };

// // export const parseSqlToConfig = (sql, schema) => {
// //     // This function remains the same as our last robust version.
// //     try {
// //         const fromMatch = sql.match(/FROM\s+`?(\w+)`?/i);
// //         if (!fromMatch) throw new Error("Parser Error: No FROM clause found.");
// //         const selectedTable = fromMatch[1];
// //         const tableSchema = schema.tables.find(t => t.name.toLowerCase() === selectedTable.toLowerCase());
// //         if (!tableSchema) throw new Error(`Parser Error: Table '${selectedTable}' not found in schema.`);
// //         const config = {
// //             queryType: 'DQL', action: 'SELECT', selectedTable: tableSchema.name,
// //             selectedColumns: [], filters: [], groupBy: [],
// //             orderBy: { column: '', direction: 'ASC' }, limit: ''
// //         };
// //         const selectMatch = sql.match(/SELECT\s+(.*?)\s+FROM/i);
// //         if (selectMatch) {
// //             const colsString = selectMatch[1].trim();
// //             if (colsString === '*') {
// //                 config.selectedColumns = [];
// //             } else {
// //                 const cols = colsString.split(',').map(c => c.trim().replace(/`/g, ''));
// //                 config.selectedColumns = cols.map(c => ({ name: c, aggregation: null }));
// //             }
// //         }
// //         const whereMatch = sql.match(/WHERE\s+(.*?)(GROUP BY|ORDER BY|LIMIT|$)/i);
// //         if (whereMatch) {
// //             const conditions = whereMatch[1].split(/AND/i);
// //             config.filters = conditions.map((cond, index) => {
// //                 const parts = cond.trim().match(/`?(\w+)`?\s*([<>=!LIKEIN\s]+)\s*'(.*?)'/);
// //                 if (!parts) return null;
// //                 return { id: Date.now() + index, column: parts[1], operator: parts[2].trim(), value: parts[3] };
// //             }).filter(Boolean);
// //         }
// //         return config;
// //     } catch (error) {
// //         console.error("SQL Parsing failed:", error.message);
// //         return null;
// //     }
// // };

// // =================================================================
// // VISUAL SQL BUILDER - UTILITIES (Final Advanced Version)
// // =================================================================

// export const buildSqlFromConfig = (config, dbType = 'mysql') => {
//     const {
//         queryType, action, selectedTable, selectedColumns, joins, filters,
//         groupBy, having, orderBy, limit, values, newTableName, newColumns,
//         alterType, renameTo, addColumn, dropColumn
//     } = config;

//     // Helper to add backticks (MySQL/MariaDB specific)
//     const quote = (name) => `\`${name}\``;

//     switch (`${queryType}:${action}`) {
//         case 'DQL:SELECT': {
//             if (!selectedTable) return '-- Select a table to begin';
            
//             // Build column list with aggregations
//             let columns = '*';
//             if (selectedColumns.length > 0) {
//                 columns = selectedColumns.map(c => 
//                     c.aggregation !== 'NONE' 
//                     ? `${c.aggregation}(${quote(c.name)})` 
//                     : quote(c.name)
//                 ).join(', ');
//             }
            
//             let sql = `SELECT ${columns}\nFROM ${quote(selectedTable)}`;

//             // NEW: Add JOINs
//             if (joins.length > 0) {
//                 const joinClauses = joins.map(j => 
//                     `\n${j.type} ${quote(j.targetTable)} ON ${quote(selectedTable)}.${quote(j.onCol1)} = ${quote(j.targetTable)}.${quote(j.onCol2)}`
//                 ).join('');
//                 sql += joinClauses;
//             }

//             if (filters.length > 0) {
//                 const whereClauses = filters.filter(f => f.column && f.operator && f.value).map(f => `${quote(f.column)} ${f.operator} '${f.value}'`).join(' AND ');
//                 if (whereClauses) sql += `\nWHERE ${whereClauses}`;
//             }

//             if (groupBy.length > 0) {
//                 sql += `\nGROUP BY ${groupBy.map(g => quote(g)).join(', ')}`;
//             }

//             // NEW: Add HAVING
//             if (having.length > 0) {
//                 const havingClauses = having.filter(h => h.column && h.operator && h.value).map(h => {
//                     // Find the original selected column to get its aggregation
//                     const selectedCol = selectedColumns.find(c => c.name === h.column);
//                     const colName = (selectedCol && selectedCol.aggregation !== 'NONE') 
//                                   ? `${selectedCol.aggregation}(${quote(h.column)})` 
//                                   : quote(h.column);
//                     return `${colName} ${h.operator} '${h.value}'`;
//                 }).join(' AND ');
//                 if (havingClauses) sql += `\nHAVING ${havingClauses}`;
//             }

//             if (orderBy.column) {
//                 const selectedCol = selectedColumns.find(c => c.name === orderBy.column);
//                 const colName = (selectedCol && selectedCol.aggregation !== 'NONE') 
//                               ? `${selectedCol.aggregation}(${quote(orderBy.column)})` 
//                               : quote(orderBy.column);
//                 sql += `\nORDER BY ${colName} ${orderBy.direction}`;
//             }

//             if (limit) {
//                 sql += `\nLIMIT ${limit}`;
//             }
//             return sql + ';';
//         }
        
//         case 'DML:INSERT': {
//             if (!selectedTable) return '-- Select a table to insert into';
//             const columns = Object.keys(values).filter(k => values[k]);
//             if (columns.length === 0) return `-- Fill in values to insert into '${selectedTable}'`;
//             const valueStrings = columns.map(c => `'${values[c]}'`).join(', ');
//             return `INSERT INTO ${quote(selectedTable)} (${columns.map(c => quote(c)).join(', ')})\nVALUES (${valueStrings});`;
//         }

//         case 'DML:UPDATE': {
//             if (!selectedTable) return '-- Select a table to update';
//             const setClauses = Object.keys(values).filter(k => values[k]).map(k => `${quote(k)} = '${values[k]}'`).join(', ');
//             if (!setClauses) return `-- Specify values to update in '${selectedTable}'`;
//             let sql = `UPDATE ${quote(selectedTable)}\nSET ${setClauses}`;
//              if (filters.length > 0) {
//                 const whereClauses = filters.filter(f => f.column && f.operator && f.value).map(f => `${quote(f.column)} ${f.operator} '${f.value}'`).join(' AND ');
//                 if (whereClauses) sql += `\nWHERE ${whereClauses}`;
//             } else {
//                 sql += `\n-- WARNING: Add a WHERE clause to avoid updating all rows!`;
//             }
//             return sql + ';';
//         }

//         case 'DML:DELETE': {
//             if (!selectedTable) return '-- Select a table to delete from';
//             let sql = `DELETE FROM ${quote(selectedTable)}`;
//              if (filters.length > 0) {
//                 const whereClauses = filters.filter(f => f.column && f.operator && f.value).map(f => `${quote(f.column)} ${f.operator} '${f.value}'`).join(' AND ');
//                 if (whereClauses) sql += `\nWHERE ${whereClauses}`;
//             } else {
//                 sql += `\n-- WARNING: Add a WHERE clause to avoid deleting all rows!`;
//             }
//             return sql + ';';
//         }
        
//         case 'DDL:CREATE TABLE': {
//             if (!newTableName.trim()) return '-- Enter a table name';
//             const validColumns = newColumns.filter(c => c.name.trim() && c.type.trim());
//             if (validColumns.length === 0) return `-- Add at least one column for table '${newTableName}'`;
//             const columnDefs = validColumns.map(c => {
//                 let def = `${quote(c.name)} ${c.type}`;
//                 if (c.constraint === 'PRIMARY KEY') def += ' PRIMARY KEY';
//                 if (c.constraint === 'NOT NULL') def += ' NOT NULL';
//                 return def;
//             }).join(',\n  ');
//             return `CREATE TABLE ${quote(newTableName)} (\n  ${columnDefs}\n);`;
//         }

//         case 'DDL:ALTER TABLE': {
//             if (!selectedTable) return '-- Select a table to alter';
//             if (alterType === 'RENAME_TABLE') {
//                 if (!renameTo.trim()) return `-- Enter the new name for table '${selectedTable}'`;
//                 return `ALTER TABLE ${quote(selectedTable)}\nRENAME TO ${quote(renameTo)};`;
//             }
//             if (alterType === 'ADD_COLUMN') {
//                 if (!addColumn.name.trim()) return `-- Enter a name for the new column`;
//                 return `ALTER TABLE ${quote(selectedTable)}\nADD COLUMN ${quote(addColumn.name)} ${addColumn.type};`;
//             }
//             // NEW: Handle DROP COLUMN
//             if (alterType === 'DROP_COLUMN') {
//                 if (!dropColumn) return `-- Select a column to drop`;
//                 return `ALTER TABLE ${quote(selectedTable)}\nDROP COLUMN ${quote(dropColumn)};`;
//             }
//             return '-- Select an alter action';
//         }

//         case 'DDL:DROP TABLE': {
//             if (!newTableName.trim()) return '-- Select a table and confirm its name to drop it';
//             if (selectedTable !== newTableName) return `-- Confirmation failed: Typed name '${newTableName}' does not match selected table '${selectedTable}'`;
//             return `DROP TABLE ${quote(selectedTable)};`;
//         }

//         // NEW: Handle TRUNCATE TABLE
//         case 'DDL:TRUNCATE TABLE': {
//             if (!newTableName.trim()) return '-- Select a table and confirm its name';
//             if (selectedTable !== newTableName) return `-- Confirmation failed: Typed name '${newTableName}' does not match selected table '${selectedTable}'`;
//             return `TRUNCATE TABLE ${quote(selectedTable)};`;
//         }

//         case 'TCL:COMMIT':
//             return 'COMMIT;';
//         case 'TCL:ROLLBACK':
//             return 'ROLLBACK;';
//         case 'DCL:GRANT':
//         case 'DCL:REVOKE':
//             return `-- DCL commands are not typically run from an application. This is an administrative task.`;
        
//         default:
//             return '-- Visual builder not implemented for this action yet.';
//     }
// };

// /**
//  * NEW: Smarter Parser
//  */
// export const parseSqlToConfig = (sql, schema, dbType = 'mysql') => {
//     try {
//         // Use case-insensitive matching (/i) and handle optional backticks (`?`)
//         const fromMatch = sql.match(/FROM\s+`?(\w+)`?/i);
//         if (!fromMatch) throw new Error("Parser Error: No FROM clause found.");
        
//         const selectedTable = fromMatch[1];
//         const tableSchema = schema.tables.find(t => t.name.toLowerCase() === selectedTable.toLowerCase());
        
//         // This is the NEW feature: if a table is found, auto-select it in the UI
//         if (!tableSchema) {
//             // If table not found, just return null, don't throw error
//             console.log(`Parser: Table '${selectedTable}' not found in schema.`);
//             return null; 
//         }

//         const config = {
//             queryType: 'DQL', action: 'SELECT', selectedTable: tableSchema.name,
//             selectedColumns: [], filters: [], joins: [], groupBy: [], having: [],
//             orderBy: { column: '', direction: 'ASC' }, limit: ''
//         };

//         const selectMatch = sql.match(/SELECT\s+(.*?)\s+FROM/i);
//         if (selectMatch) {
//             const colsString = selectMatch[1].trim();
            
//             // NEW: Handle SELECT *
//             if (colsString === '*') {
//                 // Find all columns for the base table and add them
//                 config.selectedColumns = tableSchema.columns.map(c => ({ name: c.name, aggregation: 'NONE' }));
//             } else {
//                 const cols = colsString.split(',').map(c => c.trim().replace(/`/g, ''));
//                 config.selectedColumns = cols.map(c => ({ name: c, aggregation: 'NONE' })); // Simple parse, doesn't detect aggregations
//             }
//         }

//         const whereMatch = sql.match(/WHERE\s+(.*?)(GROUP BY|ORDER BY|LIMIT|$)/i);
//         if (whereMatch) {
//             const conditions = whereMatch[1].split(/AND/i);
//             config.filters = conditions.map((cond, index) => {
//                 const parts = cond.trim().match(/`?(\w+)`?\s*([<>=!LIKEIN\s]+)\s*'(.*?)'/);
//                 if (!parts) return null;
//                 return { id: Date.now() + index, column: parts[1], operator: parts[2].trim(), value: parts[3] };
//             }).filter(Boolean); // Filter out any nulls from failed matches
//         }

//         console.log("Successfully parsed config:", config);
//         return config;

//     } catch (error) {
//         console.error("SQL Parsing failed:", error.message);
//         return null;
//     }
// };

// =================================================================
// VISUAL SQL BUILDER - UTILITIES (Final Advanced Version)
// =================================================================

export const buildSqlFromConfig = (config, dbType = 'mysql') => {
    const {
        queryType, action, selectedTable, selectedColumns, joins, filters,
        groupBy, having, orderBy, limit, values, newTableName, newColumns,
        alterType, renameTo, addColumn, dropColumn
    } = config;

    // Helper to add backticks (MySQL/MariaDB specific)
    const quote = (name) => `\`${name}\``;

    switch (`${queryType}:${action}`) {
        case 'DQL:SELECT': {
            if (!selectedTable) return '-- Select a table to begin';
            
            // Build column list with aggregations
            let columns = '*';
            if (selectedColumns.length > 0) {
                columns = selectedColumns.map(c => 
                    c.aggregation !== 'NONE' 
                    ? `${c.aggregation}(${quote(c.name)})` 
                    : quote(c.name)
                ).join(', ');
            }
            
            let sql = `SELECT ${columns}\nFROM ${quote(selectedTable)}`;

            // NEW: Add JOINs
            if (joins.length > 0) {
                const joinClauses = joins.map(j => 
                    `\n${j.type} ${quote(j.targetTable)} ON ${quote(selectedTable)}.${quote(j.onCol1)} = ${quote(j.targetTable)}.${quote(j.onCol2)}`
                ).join('');
                sql += joinClauses;
            }

            if (filters.length > 0) {
                const whereClauses = filters.filter(f => f.column && f.operator && f.value).map(f => `${quote(f.column)} ${f.operator} '${f.value}'`).join(' AND ');
                if (whereClauses) sql += `\nWHERE ${whereClauses}`;
            }

            if (groupBy.length > 0) {
                sql += `\nGROUP BY ${groupBy.map(g => quote(g)).join(', ')}`;
            }

            // NEW: Add HAVING
            if (having.length > 0) {
                const havingClauses = having.filter(h => h.column && h.operator && h.value).map(h => {
                    // Find the original selected column to get its aggregation
                    const selectedCol = selectedColumns.find(c => c.name === h.column);
                    const colName = (selectedCol && selectedCol.aggregation !== 'NONE') 
                                  ? `${selectedCol.aggregation}(${quote(h.column)})` 
                                  : quote(h.column);
                    return `${colName} ${h.operator} '${h.value}'`;
                }).join(' AND ');
                if (havingClauses) sql += `\nHAVING ${havingClauses}`;
            }

            if (orderBy.column) {
                const selectedCol = selectedColumns.find(c => c.name === orderBy.column);
                const colName = (selectedCol && selectedCol.aggregation !== 'NONE') 
                              ? `${selectedCol.aggregation}(${quote(orderBy.column)})` 
                              : quote(orderBy.column);
                sql += `\nORDER BY ${colName} ${orderBy.direction}`;
            }

            if (limit) {
                sql += `\nLIMIT ${limit}`;
            }
            return sql + ';';
        }
        
        case 'DML:INSERT': {
            if (!selectedTable) return '-- Select a table to insert into';
            const columns = Object.keys(values).filter(k => values[k]);
            if (columns.length === 0) return `-- Fill in values to insert into '${selectedTable}'`;
            const valueStrings = columns.map(c => `'${values[c]}'`).join(', ');
            return `INSERT INTO ${quote(selectedTable)} (${columns.map(c => quote(c)).join(', ')})\nVALUES (${valueStrings});`;
        }

        case 'DML:UPDATE': {
            if (!selectedTable) return '-- Select a table to update';
            const setClauses = Object.keys(values).filter(k => values[k]).map(k => `${quote(k)} = '${values[k]}'`).join(', ');
            if (!setClauses) return `-- Specify values to update in '${selectedTable}'`;
            let sql = `UPDATE ${quote(selectedTable)}\nSET ${setClauses}`;
             if (filters.length > 0) {
                const whereClauses = filters.filter(f => f.column && f.operator && f.value).map(f => `${quote(f.column)} ${f.operator} '${f.value}'`).join(' AND ');
                if (whereClauses) sql += `\nWHERE ${whereClauses}`;
            } else {
                sql += `\n-- WARNING: Add a WHERE clause to avoid updating all rows!`;
            }
            return sql + ';';
        }

        case 'DML:DELETE': {
            if (!selectedTable) return '-- Select a table to delete from';
            let sql = `DELETE FROM ${quote(selectedTable)}`;
             if (filters.length > 0) {
                const whereClauses = filters.filter(f => f.column && f.operator && f.value).map(f => `${quote(f.column)} ${f.operator} '${f.value}'`).join(' AND ');
                if (whereClauses) sql += `\nWHERE ${whereClauses}`;
            } else {
                sql += `\n-- WARNING: Add a WHERE clause to avoid deleting all rows!`;
            }
            return sql + ';';
        }
        
        case 'DDL:CREATE TABLE': {
            if (!newTableName.trim()) return '-- Enter a table name';
            const validColumns = newColumns.filter(c => c.name.trim() && c.type.trim());
            if (validColumns.length === 0) return `-- Add at least one column for table '${newTableName}'`;
            const columnDefs = validColumns.map(c => {
                let def = `${quote(c.name)} ${c.type}`;
                if (c.constraint === 'PRIMARY KEY') def += ' PRIMARY KEY';
                if (c.constraint === 'NOT NULL') def += ' NOT NULL';
                return def;
            }).join(',\n  ');
            return `CREATE TABLE ${quote(newTableName)} (\n  ${columnDefs}\n);`;
        }

        case 'DDL:ALTER TABLE': {
            if (!selectedTable) return '-- Select a table to alter';
            if (alterType === 'RENAME_TABLE') {
                if (!renameTo.trim()) return `-- Enter the new name for table '${selectedTable}'`;
                return `ALTER TABLE ${quote(selectedTable)}\nRENAME TO ${quote(renameTo)};`;
            }
            if (alterType === 'ADD_COLUMN') {
                if (!addColumn.name.trim()) return `-- Enter a name for the new column`;
                return `ALTER TABLE ${quote(selectedTable)}\nADD COLUMN ${quote(addColumn.name)} ${addColumn.type};`;
            }
            // NEW: Handle DROP COLUMN
            if (alterType === 'DROP_COLUMN') {
                if (!dropColumn) return `-- Select a column to drop`;
                return `ALTER TABLE ${quote(selectedTable)}\nDROP COLUMN ${quote(dropColumn)};`;
            }
            return '-- Select an alter action';
        }

        case 'DDL:DROP TABLE': {
            if (!newTableName.trim()) return '-- Select a table and confirm its name to drop it';
            if (selectedTable !== newTableName) return `-- Confirmation failed: Typed name '${newTableName}' does not match selected table '${selectedTable}'`;
            return `DROP TABLE ${quote(selectedTable)};`;
        }

        // NEW: Handle TRUNCATE TABLE
        case 'DDL:TRUNCATE TABLE': {
            if (!newTableName.trim()) return '-- Select a table and confirm its name';
            if (selectedTable !== newTableName) return `-- Confirmation failed: Typed name '${newTableName}' does not match selected table '${selectedTable}'`;
            return `TRUNCATE TABLE ${quote(selectedTable)};`;
        }

        case 'TCL:COMMIT':
            return 'COMMIT;';
        case 'TCL:ROLLBACK':
            return 'ROLLBACK;';
        case 'DCL:GRANT':
        case 'DCL:REVOKE':
            return `-- DCL commands are not typically run from an application. This is an administrative task.`;
        
        default:
            return '-- Visual builder not implemented for this action yet.';
    }
};

/**
 * NEW: Smarter Parser
 */
export const parseSqlToConfig = (sql, schema, dbType = 'mysql') => {
    try {
        // Use case-insensitive matching (/i) and handle optional backticks (`?`)
        const fromMatch = sql.match(/FROM\s+`?(\w+)`?/i);
        if (!fromMatch) throw new Error("Parser Error: No FROM clause found.");
        
        const selectedTable = fromMatch[1];
        const tableSchema = schema.tables.find(t => t.name.toLowerCase() === selectedTable.toLowerCase());
        
        // This is the NEW feature: if a table is found, auto-select it in the UI
        if (!tableSchema) {
            // If table not found, just return null, don't throw error
            console.log(`Parser: Table '${selectedTable}' not found in schema.`);
            return null; 
        }

        const config = {
            queryType: 'DQL', action: 'SELECT', selectedTable: tableSchema.name,
            selectedColumns: [], filters: [], joins: [], groupBy: [], having: [],
            orderBy: { column: '', direction: 'ASC' }, limit: ''
        };

        const selectMatch = sql.match(/SELECT\s+(.*?)\s+FROM/i);
        if (selectMatch) {
            const colsString = selectMatch[1].trim();
            
            // NEW: Handle SELECT *
            if (colsString === '*') {
                // Find all columns for the base table and add them
                config.selectedColumns = tableSchema.columns.map(c => ({ name: c.name, aggregation: 'NONE' }));
            } else {
                const cols = colsString.split(',').map(c => c.trim().replace(/`/g, ''));
                config.selectedColumns = cols.map(c => ({ name: c, aggregation: 'NONE' })); // Simple parse, doesn't detect aggregations
            }
        }

        const whereMatch = sql.match(/WHERE\s+(.*?)(GROUP BY|ORDER BY|LIMIT|$)/i);
        if (whereMatch) {
            const conditions = whereMatch[1].split(/AND/i);
            config.filters = conditions.map((cond, index) => {
                const parts = cond.trim().match(/`?(\w+)`?\s*([<>=!LIKEIN\s]+)\s*'(.*?)'/);
                if (!parts) return null;
                return { id: Date.now() + index, column: parts[1], operator: parts[2].trim(), value: parts[3] };
            }).filter(Boolean); // Filter out any nulls from failed matches
        }

        console.log("Successfully parsed config:", config);
        return config;

    } catch (error) {
        console.error("SQL Parsing failed:", error.message);
        return null;
    }
};