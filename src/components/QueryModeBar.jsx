import React from 'react';

const queryOptions = {
    DQL: ['SELECT'],
    DML: ['INSERT', 'UPDATE', 'DELETE'],
    // NEW: Added TRUNCATE TABLE
    DDL: ['CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'TRUNCATE TABLE'],
    TCL: ['COMMIT', 'ROLLBACK'],
    DCL: ['GRANT', 'REVOKE'],
};

const QueryModeBar = ({ config, onConfigChange, initialConfig, dbType, onDbTypeChange }) => {
    const handleTypeChange = (e) => {
        const newType = e.target.value;
        const newAction = queryOptions[newType][0];
        onConfigChange({ ...initialConfig, queryType: newType, action: newAction, selectedTable: config.selectedTable });
    };

    const handleActionChange = (e) => {
        const newAction = e.target.value;
        onConfigChange({ ...initialConfig, queryType: config.queryType, action: newAction, selectedTable: config.selectedTable });
    };

    return (
        <div className="flex items-center space-x-4">
            <select 
                value={dbType} 
                onChange={(e) => onDbTypeChange(e.target.value)} 
                className="text-sm rounded-md bg-white border border-slate-300 p-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                title="Select the database to connect to"
            >
                <option value="mysql">Cloud MySQL</option>
                <option value="mariadb">Cloud MariaDB</option>
            </select>
            
            <select value={config.queryType} onChange={handleTypeChange} className="text-sm rounded-md bg-white border border-slate-300 p-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
                {Object.keys(queryOptions).map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
            <select value={config.action} onChange={handleActionChange} className="text-sm rounded-md bg-white border border-slate-300 p-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
                {queryOptions[config.queryType].map(action => (
                    <option key={action} value={action}>{action}</option>
                ))}
            </select>
        </div>
    );
};

export default QueryModeBar;
