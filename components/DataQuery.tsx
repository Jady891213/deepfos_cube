
import React, { useState } from 'react';
import { SavedQuery, Dimension } from '../types';
import { Play, Save, Plus, Clock, Search, Table, Filter, Terminal, Download, MoreHorizontal, Radar, Sparkles, X, ListFilter } from 'lucide-react';

const DataQuery: React.FC = () => {
  // Mock dimensions - in a real app these would come from the model context
  const dimensions: Dimension[] = [
    { id: '1', code: 'scenario', name: 'Scenario', type: 'Scenario' },
    { id: '2', code: 'version', name: 'Version', type: 'Version' },
    { id: '3', code: 'entity', name: 'Entity', type: 'Entity' },
    { id: '4', code: 'year', name: 'Year', type: 'Year' },
    { id: '5', code: 'period', name: 'Period', type: 'Period' },
    { id: '6', code: 'account', name: 'Account', type: 'Account' },
  ];

  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([
    { id: '1', name: 'Q1 Revenue Analysis', lastRun: '2 mins ago', filters: { year: '2024', period: 'Q1', account: 'Revenue', scenario: 'Actual' } },
    { id: '2', name: 'Budget vs Actual Check', lastRun: '2 days ago', filters: { year: '2024', scenario: 'Budget, Actual', account: 'Operating Expenses' } },
    { id: '3', name: 'Entity Consolidation', lastRun: '1 week ago', filters: { entity: 'Total Group', year: '2023' } },
  ]);

  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    year: '2024',
    period: 'Jan',
    scenario: 'Actual',
    entity: '', // Empty by default to demonstrate discovery
    version: '',
    account: ''
  });

  const [hasRun, setHasRun] = useState(false);
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);

  // Data Discovery State
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredBlocks, setDiscoveredBlocks] = useState<Array<Record<string, string>> | null>(null);
  const [scanContext, setScanContext] = useState<string>('');

  const handleFilterChange = (dimCode: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [dimCode]: value }));
  };

  const loadQuery = (query: SavedQuery) => {
      setSelectedQueryId(query.id);
      setActiveFilters({...activeFilters, ...query.filters}); // Merge to keep defaults if missing
      setHasRun(false);
      setDiscoveredBlocks(null); // Clear discovery when loading saved query
  };

  const runQuery = () => {
      setHasRun(true);
  };

  const scanForData = () => {
      setIsScanning(true);
      setDiscoveredBlocks(null);
      
      // 1. Analyze what the user has already defined
      const fixedEntries = Object.entries(activeFilters).filter(([_, v]) => v && (v as string).trim() !== '');
      const fixedDims = fixedEntries.map(([k]) => k);
      const missingDims = dimensions.filter(d => !fixedDims.includes(d.code)).map(d => d.code);

      // Context message
      if (fixedDims.length > 0) {
        setScanContext(`Searching for data matching [${fixedEntries.map(([k,v]) => `${k}:${v}`).join(', ')}]...`);
      } else {
        setScanContext("Scanning entire cube for dense data blocks...");
      }

      // 2. Simulate targeted API call to ClickHouse
      setTimeout(() => {
          let results: Array<Record<string, string>> = [];
          
          // Helper to get value or default mock
          const val = (key: string, mock: string) => activeFilters[key] || mock;

          if (fixedDims.length > 0) {
              // SCENARIO A: Targeted Discovery
              // "I know Year=2025, show me which Entities have data"
              
              // We generate variations only for the MISSING dimensions
              results = [
                  { 
                      ...activeFilters,
                      // Mock filling in the blanks
                      entity: val('entity', 'Sales_US_East'),
                      version: val('version', 'Working'),
                      period: val('period', 'Jan'),
                      account: val('account', 'Net Income'),
                      desc: 'Regional Sales Data'
                  },
                  { 
                      ...activeFilters,
                      entity: val('entity', 'Sales_EU_Germany'),
                      version: val('version', 'Working'),
                      period: val('period', 'Jan'),
                      account: val('account', 'Net Income'),
                      desc: 'Regional Sales Data'
                  },
                  { 
                       ...activeFilters,
                       entity: val('entity', 'Corp_HQ'),
                       version: val('version', 'Final'),
                       period: val('period', 'Adj_12'),
                       account: val('account', 'Opex'),
                       desc: 'Corporate Adjustments'
                  }
              ];
          } else {
              // SCENARIO B: Global Discovery (Nothing selected)
              results = [
                { year: '2024', scenario: 'Actual', period: 'Jan', version: 'Final', entity: 'Total Group', account: 'All', desc: 'Closed Month Data' },
                { year: '2024', scenario: 'Budget', period: 'Q1', version: 'Working_v2', entity: 'Total Group', account: 'All', desc: 'Current Budget Cycle' },
                { year: '2023', scenario: 'Actual', period: 'Dec', version: 'Final', entity: 'Total Group', account: 'All', desc: 'Last Year End' },
              ];
          }
          
          setDiscoveredBlocks(results);
          setIsScanning(false);
      }, 800 + Math.random() * 800);
  };

  const applyDiscoveredBlock = (block: Record<string, string>) => {
      // Remove 'desc' and apply others to filters
      const { desc, ...filters } = block;
      setActiveFilters(prev => ({ ...prev, ...filters }));
  };

  const getMdxPreview = () => {
      const whereClause = Object.entries(activeFilters)
        .filter(([_, val]) => val)
        .map(([key, val]) => `${key}.['${val}']`)
        .join(' * ');
      return `SELECT\n  NON EMPTY { [Account].Members } ON ROWS,\n  NON EMPTY { [Period].Members } ON COLUMNS\nFROM [main_cube]\nWHERE (\n  ${whereClause || '...'}\n)`;
  };

  return (
    <div className="flex h-full bg-white overflow-hidden">
      
      {/* Left Sidebar: Saved Queries */}
      <div className="w-[280px] bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200">
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-colors">
                <Plus className="w-4 h-4" /> New Query
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            <div className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">My Queries</div>
            {savedQueries.map(q => (
                <div 
                    key={q.id}
                    onClick={() => loadQuery(q)}
                    className={`group p-3 rounded-lg cursor-pointer border transition-all
                    ${selectedQueryId === q.id ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-100' : 'bg-transparent border-transparent hover:bg-gray-100 hover:border-gray-200'}`}
                >
                    <div className="flex justify-between items-start">
                        <div className={`font-medium text-sm ${selectedQueryId === q.id ? 'text-blue-700' : 'text-gray-700'}`}>{q.name}</div>
                        <MoreHorizontal className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-600" />
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{q.lastRun}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Filter Configuration Area */}
        <div className="p-6 bg-white border-b border-gray-200 shrink-0">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-blue-600" />
                        Dimension Scope
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Define known dimensions, leave others blank to find matching data.</p>
                </div>
                <div className="flex gap-2">
                     <button 
                        onClick={scanForData}
                        disabled={isScanning}
                        className="px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 flex items-center gap-2 transition-all"
                        title="Find available data combinations based on current selection"
                    >
                        {isScanning ? (
                            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Radar className="w-4 h-4" />
                        )}
                        {isScanning ? 'Scouting...' : 'Scan for Data'}
                    </button>
                     <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Config
                    </button>
                    <button 
                        onClick={runQuery}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm flex items-center gap-2"
                    >
                        <Play className="w-4 h-4" /> Execute Query
                    </button>
                </div>
            </div>

            {/* Discovery Panel (Conditionally Rendered) */}
            {(isScanning || discoveredBlocks) && (
                <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-lg p-4 animate-in slide-in-from-top-2">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            {isScanning ? 'Scouting for data...' : 'Available Data Blocks Found'}
                        </h3>
                        {!isScanning && (
                            <button onClick={() => setDiscoveredBlocks(null)} className="text-purple-400 hover:text-purple-700">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    
                    {isScanning ? (
                        <div className="text-xs text-purple-700 font-mono animate-pulse">
                            {scanContext}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {discoveredBlocks?.map((block, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => applyDiscoveredBlock(block)}
                                    className="group flex flex-col items-start bg-white border border-purple-200 hover:border-purple-400 hover:shadow-md rounded-lg px-3 py-2 transition-all text-left max-w-xs"
                                >
                                    <div className="flex items-center gap-2 w-full mb-1">
                                        <span className="text-xs font-bold text-gray-800 flex-1 truncate">{block.desc}</span>
                                        <ListFilter className="w-3 h-3 text-purple-300 group-hover:text-purple-600" />
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {/* Highlight interesting dims (Entity, Version, etc) */}
                                        {['entity', 'version', 'period', 'year'].map(k => (
                                            <span key={k} className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${activeFilters[k] ? 'bg-gray-100 text-gray-400' : 'bg-purple-100 text-purple-700 font-semibold'}`}>
                                                {block[k]}
                                            </span>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dimensions.map(dim => (
                    <div key={dim.id} className="relative group">
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide flex justify-between">
                            {dim.name}
                            <span className="text-gray-300 font-normal normal-case">{dim.code}</span>
                        </label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={activeFilters[dim.code] || ''}
                                onChange={(e) => handleFilterChange(dim.code, e.target.value)}
                                placeholder={`(Any ${dim.name})`}
                                className={`block w-full text-sm rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 pl-3 border transition-colors
                                ${activeFilters[dim.code] ? 'bg-white border-blue-300 text-blue-900 font-medium' : 'bg-gray-50 border-gray-300 hover:bg-white text-gray-600'}`}
                            />
                            {/* Visual indicator for "configured" state */}
                            {activeFilters[dim.code] && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Live Preview */}
            <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-2 cursor-pointer hover:text-blue-600 w-fit">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Generated Query Preview</span>
                </div>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-xs text-green-400 overflow-x-auto">
                    <pre>{getMdxPreview()}</pre>
                </div>
            </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 bg-gray-50 p-6 overflow-hidden flex flex-col">
            {hasRun ? (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-2">
                             <Table className="w-4 h-4 text-gray-500" />
                             <span className="text-sm font-semibold text-gray-700">Result Set</span>
                             <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full">5 Records</span>
                        </div>
                        <button className="text-gray-500 hover:text-blue-600 p-1.5 rounded hover:bg-white transition-all">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 border-b border-gray-200">Account</th>
                                    <th className="px-6 py-3 border-b border-gray-200">Period</th>
                                    <th className="px-6 py-3 border-b border-gray-200 text-right">Value</th>
                                    <th className="px-6 py-3 border-b border-gray-200 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { acc: 'Gross Sales', per: activeFilters['period'] || 'Jan', val: '1,250,000', stat: 'OK' },
                                    { acc: 'Cost of Sales', per: activeFilters['period'] || 'Jan', val: '(850,000)', stat: 'OK' },
                                    { acc: 'Gross Margin', per: activeFilters['period'] || 'Jan', val: '400,000', stat: 'Calc' },
                                    { acc: 'Operating Exp', per: activeFilters['period'] || 'Jan', val: '(120,000)', stat: 'OK' },
                                    { acc: 'Net Income', per: activeFilters['period'] || 'Jan', val: '280,000', stat: 'Calc' },
                                ].map((row, i) => (
                                    <tr key={i} className="bg-white border-b hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{row.acc}</td>
                                        <td className="px-6 py-4">{row.per}</td>
                                        <td className="px-6 py-4 text-right font-mono text-gray-900">{row.val}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-[10px] px-2 py-1 rounded-full ${row.stat === 'Calc' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                                {row.stat}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-400 flex justify-between">
                        <span>Query executed in 0.45s</span>
                        <span>Source: ClickHouse (fact_sales_monthly_v1)</span>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="p-6 bg-gray-100 rounded-full mb-4">
                        <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-600">Ready to Query</p>
                    <p className="text-sm max-w-sm text-center mt-2">Configure dimension scopes. Use <strong>Scan for Data</strong> to find which dimension combinations (like Entities) have data for your selected Year.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DataQuery;
