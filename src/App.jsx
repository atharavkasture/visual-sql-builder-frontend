
import React, { useState, useEffect } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import LeftSchemaPanel from './components/LeftSchemaPanel';
import QueryModeBar from './components/QueryModeBar';
import VisualBuilder from './components/VisualBuilder';
import SqlEditor from './components/SqlEditor';
import ResultsPanel from './components/ResultsPanel';
import AISidebar from './components/AISidebar';
import { buildSqlFromConfig, parseSqlToConfig } from './utils/sqlBuilder';
import { Menu, X, Bot } from 'lucide-react';

const initialConfig = {
    queryType: 'DQL',
    action: 'SELECT',
    selectedTable: '',
    selectedColumns: [], // Now objects: { name: 'col', aggregation: 'NONE' }
    joins: [], // NEW: For visual JOINs
    filters: [], // This is for WHERE
    groupBy: [],
    having: [], // NEW: For HAVING clause
    orderBy: { column: '', direction: 'ASC' },
    limit: '',
    values: {},
    newTableName: '',
    newColumns: [{ id: 1, name: '', type: 'TEXT', constraint: 'NONE' }],
    alterType: 'RENAME_TABLE',
    renameTo: '',
    addColumn: { name: '', type: 'TEXT' },
    dropColumn: '', // NEW: For ALTER TABLE...DROP COLUMN
};

function App() {
  const [schema, setSchema] = useState({ tables: [] });
  const [queryConfig, setQueryConfig] = useState(initialConfig);
  const [generatedSql, setGeneratedSql] = useState('');
  const [editedSql, setEditedSql] = useState('');
  const [isSqlModified, setIsSqlModified] = useState(false);
  const [queryResult, setQueryResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showAISidebar, setShowAISidebar] = useState(false);
  const [dbType, setDbType] = useState('mysql');

  // This is your Elastic Beanstalk URL.
  // Example: 'http://visual-sql-builder-env.eba-xyz.us-east-1.elasticbeanstalk.com'
  const BACKEND_URL = 'https://Visual-sql-builder-env.eba-t2mhycuh.ap-south-1.elasticbeanstalk.com';

  useEffect(() => {
    const fetchSchema = async () => {
      console.log(`Fetching schema for ${dbType}...`);
      try {
        // <-- 1. CHANGE THIS URL
        const response = await fetch(`${BACKEND_URL}/api/schema?dbType=${dbType}`);
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSchema(data);
      } catch (error) {
        console.error("Failed to fetch schema:", error);
        alert(`Could not fetch schema for ${dbType}. Is the ${dbType} server running?\n\nDetails: ${error.message}`);
      }
    };
    fetchSchema();
  }, [queryResult, dbType, BACKEND_URL]); // Add BACKEND_URL to dependency array

  useEffect(() => {
    const newSql = buildSqlFromConfig(queryConfig, dbType);
    setGeneratedSql(newSql);
    if (!isSqlModified) setEditedSql(newSql);
  }, [queryConfig, isSqlModified, dbType]);

  const handleTableSelect = (tableName) => {
    const newConf = { 
        ...initialConfig, 
        selectedTable: tableName, 
        queryType: queryConfig.queryType, 
        action: queryConfig.action,
        dbType: dbType
    };
    // Pre-fill confirm box for TRUNCATE and DROP
    if (queryConfig.action === 'DROP TABLE' || queryConfig.action === 'TRUNCATE TABLE') {
        newConf.newTableName = tableName;
    }
    setQueryConfig(newConf);
    setIsSqlModified(false);
  };
  
  // NEW: Handles both checking a column and changing its aggregation
  const handleColumnChange = (columnName, aggregation = null) => {
    setQueryConfig(prevConfig => {
        const newCols = [...prevConfig.selectedColumns];
        const colIndex = newCols.findIndex(c => c.name === columnName);

        if (colIndex > -1) {
            // Column is already selected
            if (aggregation === null) {
                // This was a "toggle off" click (checkbox unchecked)
                newCols.splice(colIndex, 1);
            } else {
                // This was an aggregation change from the dropdown
                newCols[colIndex].aggregation = aggregation;
            }
        } else {
            // Column is new, add it (this happens on first check)
            newCols.push({ name: columnName, aggregation: 'NONE' });
        }
        return { ...prevConfig, selectedColumns: newCols };
    });
    setIsSqlModified(false);
  };
  
  const handleQueryConfigChange = (newConfig) => {
    setQueryConfig(newConfig);
    setIsSqlModified(false);
  };

  const handleSqlChange = (newSql) => {
    setEditedSql(newSql);
    setIsSqlModified(newSql !== generatedSql);
  };
  
  const handleUseAIQuery = (sql) => {
      handleSqlChange(sql);
      setShowAISidebar(false);
  };

  const handleRunQuery = async () => {
    if (!editedSql.trim() || editedSql.startsWith('--')) {
      alert("Cannot run an empty or placeholder query.");
      return;
    }
    setIsLoading(true);
    setQueryResult(null);
    try {
        const startTime = performance.now();
        // <-- 2. CHANGE THIS URL
        const response = await fetch(`${BACKEND_URL}/api/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sql: editedSql, dbType: dbType }), // Pass the dbType
        });
        const result = await response.json();
        const endTime = performance.now();
        if (response.ok) {
            result.meta.runtimeMs = Math.round(endTime - startTime);
            setQueryResult(result);
        } else {
            alert(`SQL Error: ${result.error}`);
            setQueryResult({ data: [], meta: { rowsReturned: 0, runtimeMs: 0 } });
        }
    } catch (error) {
        console.error("Failed to run query:", error);
        alert("An error occurred while connecting to the backend.");
    }
    setIsLoading(false);
  };
  
  const handleParseSql = () => {
      // MODIFIED: Pass the full schema so the parser can handle SELECT *
      const newConfig = parseSqlToConfig(editedSql, schema, dbType);
      if (newConfig) {
          const fullConfig = { ...initialConfig, ...newConfig };
          setQueryConfig(fullConfig);
          setIsSqlModified(false);
          alert("Successfully synced SQL from editor to the visual builder!");
      } else {
          alert("Unable to map SQL to visual builder. The parser only supports simple, single-table SELECT statements.");
      }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 font-sans">
        <header className="flex-shrink-0 bg-white border-b border-slate-200 p-2 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-3">
                <button onClick={() => setShowLeftPanel(!showLeftPanel)} className="p-2 rounded-md hover:bg-slate-100 lg:hidden">
                    {showLeftPanel ? <X size={20} /> : <Menu size={20} />}
                </button>
                <h1 className="text-xl font-bold text-slate-800">Visual SQL Builder</h1>
            </div>
             <div className="flex items-center space-x-4">
                <button onClick={() => setShowAISidebar(true)} className="btn-secondary" title="Open AI Assistant">
                    <Bot size={16} /><span>AI Assistant</span>
                </button>
                <QueryModeBar 
                    config={queryConfig} 
                    onConfigChange={handleQueryConfigChange} 
                    initialConfig={initialConfig}
                    dbType={dbType}
                    onDbTypeChange={(newDbType) => {
                        setDbType(newDbType);
                        // Reset everything when DB type changes
                        handleTableSelect(''); 
                    }} 
                />
            </div>
        </header>

        <main className="flex-grow flex overflow-hidden relative">
            <PanelGroup direction="horizontal" className="flex-1">
                {showLeftPanel && (
                    <>
                        <Panel defaultSize={20} minSize={15} maxSize={30} className="!overflow-y-auto bg-white border-r border-slate-200">
                           <LeftSchemaPanel
                                schema={schema}
                                selectedTable={queryConfig.selectedTable}
                                selectedColumns={queryConfig.selectedColumns}
                                onTableSelect={handleTableSelect}
                                // MODIFIED: Pass the new handler
                                onColumnChange={handleColumnChange}
                            />
                        </Panel>
                        <PanelResizeHandle className="w-1.5 bg-slate-200 hover:bg-blue-500 transition-colors" />
                    </>
                )}
                <Panel>
                    <PanelGroup direction="vertical">
                        <Panel defaultSize={55} minSize={20} className="p-4 bg-slate-50 overflow-auto">
                            <VisualBuilder schema={schema} config={queryConfig} onConfigChange={handleQueryConfigChange} dbType={dbType} />
                        </Panel>
                        <PanelResizeHandle className="h-1.5 bg-slate-200 hover:bg-blue-500 transition-colors" />
                        <Panel defaultSize={45} minSize={20} className="flex flex-col">
                            <SqlEditor sql={editedSql} onSqlChange={handleSqlChange} isModified={isSqlModified} onSync={handleParseSql} />
                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle className="w-1.5 bg-slate-200 hover:bg-blue-500 transition-colors" />
                <Panel defaultSize={35} minSize={25}>
                    <ResultsPanel result={queryResult} isLoading={isLoading} onRunQuery={handleRunQuery} queryConfig={queryConfig} onConfigChange={setQueryConfig} />
                </Panel>
            </PanelGroup>

            {showAISidebar && (
                <AISidebar 
                    schema={schema} 
                    onUseQuery={handleUseAIQuery} 
                    onClose={() => setShowAISidebar(false)}
                    dbType={dbType} 
                    // Pass the backend URL as a prop
                    backendUrl={BACKEND_URL}
                />
            )}
        </main>
    </div>
  );
}
export default App;
