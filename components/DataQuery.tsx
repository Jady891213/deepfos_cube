
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Search, Table, Radar, Code2, Clock, 
  ChevronDown, Database, Download, Filter, 
  Terminal, Sparkles, Activity, Layers, ArrowRight,
  Info, Globe, History, X, Save, Bookmark, Trash2, ChevronLeft, ChevronRight,
  MoreHorizontal, ListFilter, ExternalLink, Paperclip, MessageSquare, FileText,
  User, Calendar, Plus
} from 'lucide-react';

type SearchMode = 'query' | 'discovery';
type QueryResultTab = 'table' | 'sql';

interface HistoryItem {
  id: string;
  name: string;
  timestamp: string;
  mode: SearchMode;
  pov: { year: string; scenario: string; version: string };
  filters: Record<string, string>;
}

interface MenuState {
  entity: string;
  period: string;
  x: number;
  y: number;
}

interface Remark {
  user: string;
  time: string;
  text: string;
}

interface Attachment {
  name: string;
  size: string;
  type: string;
}

interface CellDetail {
  account: string;
  period: string;
  value: string;
  remarks: Remark[];
  attachments: Attachment[];
}

const DataQuery: React.FC = () => {
  const [searchMode, setSearchMode] = useState<SearchMode>('query');
  const [queryTab, setQueryTab] = useState<QueryResultTab>('table');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [activeMenu, setActiveMenu] = useState<MenuState | null>(null);
  const [selectedCell, setSelectedCell] = useState<CellDetail | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // POV State
  const [pov, setPov] = useState({
    year: '2024',
    scenario: 'Actual',
    version: 'Working'
  });

  // Local Filters
  const [filters, setFilters] = useState<Record<string, string>>({
    entity: 'China_HQ',
    period: '',
    account: ''
  });

  // Query History
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'h1',
      name: 'Q1 Revenue Audit',
      timestamp: '10 mins ago',
      mode: 'query',
      pov: { year: '2024', scenario: 'Actual', version: 'Final' },
      filters: { entity: 'China_HQ', period: 'Jan', account: '6001' }
    }
  ]);

  const [heatmapData, setHeatmapData] = useState<any[] | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRun = (overrideFilters?: Record<string, string>) => {
    setIsProcessing(true);
    const currentFilters = overrideFilters || filters;
    
    setTimeout(() => {
      if (searchMode === 'discovery' && !overrideFilters) {
        const entities = ['China_HQ', 'US_Branch', 'EU_Sales', 'Japan_Ops', 'India_RD'];
        const periods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        setHeatmapData(entities.map(e => ({
          entity: e,
          data: periods.map(p => ({ period: p, val: Math.random() > 0.4 ? Math.floor(Math.random() * 200) : 0 }))
        })));
      }

      const newHistory: HistoryItem = {
        id: Date.now().toString(),
        name: searchMode === 'query' ? `Query_${currentFilters.entity || 'All'}` : `Scan_${pov.year}`,
        timestamp: 'Just now',
        mode: searchMode,
        pov: { ...pov },
        filters: { ...currentFilters }
      };
      setHistory(prev => [newHistory, ...prev].slice(0, 10));
      
      setHasData(true);
      setIsProcessing(false);
      setActiveMenu(null);
    }, 800);
  };

  const loadHistory = (item: HistoryItem) => {
    setSearchMode(item.mode);
    setPov(item.pov);
    setFilters(item.filters);
  };

  const navigateToDetail = (entity: string, period: string) => {
    const newFilters = { ...filters, entity, period };
    setFilters(newFilters);
    setSearchMode('query');
    setQueryTab('table');
    handleRun(newFilters); 
  };

  const openCellInspector = (i: number) => {
    const mockDetail: CellDetail = {
      account: `6001.00${i} - Revenue Group`,
      period: `2024-M${i < 10 ? '0'+i : i}`,
      value: (Math.random() * 50000).toLocaleString('en-US', { minimumFractionDigits: 2 }),
      remarks: [
        { user: 'Admin', time: '2024-03-25 10:20', text: 'Confirmed by regional manager.' },
        { user: 'Sarah Chen', time: '2024-03-24 16:45', text: 'Waiting for final Q1 audit report to finalize this number.' },
        { user: 'System', time: '2024-03-24 09:00', text: 'Data imported from SAP ERP via automated ETL task.' }
      ],
      attachments: [
        { name: 'Revenue_Breakdown_Q1.xlsx', size: '2.4MB', type: 'Excel' },
        { name: 'Regional_Confirmation_Email.pdf', size: '450KB', type: 'PDF' }
      ]
    };
    setSelectedCell(mockDetail);
  };

  const handleCellClick = (e: React.MouseEvent, entity: string, period: string) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveMenu({
      entity,
      period,
      x: rect.left,
      y: rect.bottom + window.scrollY
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] relative overflow-hidden">
      
      {/* 1. Global POV Bar */}
      <div className="h-14 bg-white border-b border-gray-200 px-6 flex items-center gap-6 shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-2 border-r border-gray-200 pr-6">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-1.5 rounded transition-colors ${showHistory ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
          >
            <History className="w-4 h-4" />
          </button>
          <Globe className="w-4 h-4 text-blue-600 ml-2" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest text-nowrap">Global POV</span>
        </div>
        
        <div className="flex gap-4">
          {Object.entries(pov).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 group cursor-pointer">
              <span className="text-[10px] font-bold text-gray-400 uppercase">{key}:</span>
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-xs font-bold text-blue-700 border border-blue-100 group-hover:bg-blue-100 transition-colors">
                {val} <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button 
              onClick={() => { setSearchMode('query'); setHasData(false); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${searchMode === 'query' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Search className="w-3.5 h-3.5" /> Query
            </button>
            <button 
              onClick={() => { setSearchMode('discovery'); setHasData(false); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${searchMode === 'discovery' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Radar className="w-3.5 h-3.5" /> Discovery
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* History Sidebar */}
        {showHistory && (
          <div className="w-[240px] bg-gray-50 border-r border-gray-200 flex flex-col shrink-0 animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <Bookmark className="w-3.5 h-3.5" /> History
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {history.map(item => (
                <div key={item.id} onClick={() => loadHistory(item)} className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${item.mode === 'query' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                      {item.mode.toUpperCase()}
                    </span>
                    <span className="text-[9px] text-gray-400">{item.timestamp}</span>
                  </div>
                  <div className="text-xs font-bold text-gray-800 truncate">{item.name}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-[9px] bg-gray-50 text-gray-500 px-1 rounded border border-gray-100">{item.pov.scenario}</span>
                    <span className="text-[9px] bg-gray-50 text-gray-500 px-1 rounded border border-gray-100">{item.pov.year}</span>
                    {item.filters.entity && <span className="text-[9px] bg-blue-50 text-blue-500 px-1 rounded border border-blue-100">{item.filters.entity}</span>}
                    {item.filters.period && <span className="text-[9px] bg-green-50 text-green-500 px-1 rounded border border-green-100">{item.filters.period}</span>}
                    {item.filters.account && <span className="text-[9px] bg-orange-50 text-orange-500 px-1 rounded border border-orange-100">{item.filters.account}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" /> Parameters
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Entity Selection</label>
              <select 
                value={filters.entity}
                onChange={(e) => setFilters({...filters, entity: e.target.value})}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              >
                <option value="China_HQ">China_HQ</option>
                <option value="US_Branch">US_Branch</option>
                <option value="EU_Sales">EU_Sales</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 tracking-tighter">Account Member</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Filter account code..."
                  value={filters.account}
                  onChange={(e) => setFilters({...filters, account: e.target.value})}
                  className="w-full text-xs p-2.5 pl-9 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 tracking-tighter">Period</label>
              <input 
                type="text"
                placeholder="Jan..Dec"
                value={filters.period}
                onChange={(e) => setFilters({...filters, period: e.target.value})}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button 
                onClick={() => handleRun()}
                disabled={isProcessing}
                className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all
                ${searchMode === 'query' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
              >
                {isProcessing ? <Activity className="w-4 h-4 animate-pulse" /> : <Play className="w-3.5 h-3.5" />}
                Execute
              </button>
            </div>
          </div>
        </div>

        {/* Main Workspace with Squashing Detail Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Result Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden relative border-r border-gray-100">
            {!hasData ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <div className={`p-8 rounded-full mb-6 ${searchMode === 'query' ? 'bg-blue-50 text-blue-200' : 'bg-purple-50 text-purple-200'}`}>
                  {searchMode === 'query' ? <Search className="w-16 h-16" /> : <Radar className="w-16 h-16" />}
                </div>
                <h2 className="text-lg font-bold text-gray-800">No Execution Results</h2>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                {searchMode === 'query' ? (
                  <div className="flex-1 flex flex-col p-6 overflow-hidden">
                    <div className="flex border-b border-gray-200 mb-4 shrink-0">
                      <button onClick={() => setQueryTab('table')} className={`px-6 py-2.5 text-xs font-bold border-b-2 ${queryTab === 'table' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-400'}`}>
                        <Table className="w-4 h-4 inline mr-2" /> Data Grid
                      </button>
                      <button onClick={() => setQueryTab('sql')} className={`px-6 py-2.5 text-xs font-bold border-b-2 ${queryTab === 'sql' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-400'}`}>
                        <Code2 className="w-4 h-4 inline mr-2" /> SQL
                      </button>
                    </div>

                    <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative">
                      {queryTab === 'table' ? (
                        <div className="flex-1 overflow-auto custom-scrollbar">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                              <tr>
                                <th className="px-6 py-3 font-bold text-gray-400 uppercase">Account Member</th>
                                <th className="px-6 py-3 font-bold text-gray-400 uppercase">Period</th>
                                <th className="px-6 py-3 font-bold text-gray-400 uppercase text-right">Value ({pov.year})</th>
                                <th className="px-6 py-3 font-bold text-gray-400 uppercase text-center w-32">Data Audit</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => {
                                const hasMetadata = i % 2 === 0;
                                const isCurrentSelected = selectedCell?.account.includes(`6001.00${i}`);
                                return (
                                  <tr 
                                    key={i} 
                                    onClick={() => openCellInspector(i)}
                                    className={`hover:bg-blue-50/50 transition-colors group cursor-pointer ${isCurrentSelected ? 'bg-blue-50/70 border-l-4 border-l-blue-600' : ''}`}
                                  >
                                    <td className="px-6 py-4 font-medium text-gray-700 group-hover:text-blue-600 transition-colors">6001.00{i} - Revenue Group</td>
                                    <td className="px-6 py-4 text-gray-500 font-mono">2024-M{i < 10 ? '0'+i : i}</td>
                                    <td className="px-6 py-4 font-mono font-bold text-right text-gray-900">
                                      {(Math.random() * 50000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <div className="flex items-center justify-center gap-3">
                                        {hasMetadata ? (
                                          <>
                                            <div className="flex items-center gap-1 text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                              <Paperclip className="w-3 h-3" />
                                              <span className="text-[9px] font-bold">2</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                                              <MessageSquare className="w-3 h-3" />
                                              <span className="text-[9px] font-bold">3</span>
                                            </div>
                                          </>
                                        ) : (
                                          <span className="text-gray-300">-</span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="flex-1 bg-[#1e1e1e] p-6 text-blue-400 font-mono text-sm overflow-auto">
                          <pre>{`SELECT account_code, period, SUM(amount) \nFROM fact_table \nWHERE entity = '${filters.entity}'...`}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col p-6 overflow-hidden">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" /> Data Density Explorer
                    </h3>
                    <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 overflow-auto custom-scrollbar">
                      {heatmapData?.map(row => (
                        <div key={row.entity} className="flex mb-2">
                          <div className="w-24 text-[10px] font-bold text-gray-400 flex items-center shrink-0">{row.entity}</div>
                          {row.data.map((c: any) => (
                            <div 
                              key={c.period} 
                              onClick={(e) => handleCellClick(e, row.entity, c.period)}
                              className={`w-12 h-8 rounded border border-white cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all shrink-0 ${c.val === 0 ? 'bg-gray-50' : 'bg-purple-600'}`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 5. Cell Inspector Sidebar (Pushes Main content) */}
          <div className={`shrink-0 flex flex-col bg-white border-l border-gray-200 transition-all duration-300 ease-in-out ${selectedCell ? 'w-96 border-l-4 border-l-blue-100' : 'w-0 border-none pointer-events-none'}`}>
            <div className={`h-full flex flex-col min-w-[384px] ${selectedCell ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 delay-100`}>
              {selectedCell && (
                <>
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                      <ListFilter className="w-4 h-4 text-blue-600" /> Cell Inspector
                    </h3>
                    <button onClick={() => setSelectedCell(null)} className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-400">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* Context Summary */}
                    <div className="bg-blue-600 rounded-xl p-5 text-white shadow-md">
                      <div className="text-[10px] font-bold opacity-70 uppercase mb-1">{selectedCell.account}</div>
                      <div className="flex justify-between items-end">
                        <div className="text-2xl font-black">{selectedCell.value}</div>
                        <div className="text-xs font-bold px-2 py-0.5 bg-white/20 rounded">{selectedCell.period}</div>
                      </div>
                    </div>

                    {/* Attachments Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                          <Paperclip className="w-3.5 h-3.5" /> Attachments ({selectedCell.attachments.length})
                        </h4>
                        <button className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Upload
                        </button>
                      </div>
                      <div className="space-y-2">
                        {selectedCell.attachments.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg hover:border-blue-200 transition-all group">
                            <div className={`w-9 h-9 rounded flex items-center justify-center ${file.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                               <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-gray-700 truncate">{file.name}</div>
                              <div className="text-[10px] text-gray-400">{file.size} · {file.type}</div>
                            </div>
                            <button className="text-gray-300 hover:text-blue-600 group-hover:scale-110 transition-transform">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Remarks History List */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5" /> Remark History ({selectedCell.remarks.length})
                      </h4>
                      <div className="relative pl-4 space-y-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                        {selectedCell.remarks.map((remark, idx) => (
                          <div key={idx} className="relative group">
                            <div className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white shadow-sm" />
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1">
                              <User className="w-3 h-3" />
                              <span className="font-bold text-gray-600">{remark.user}</span>
                              <span className="mx-1">•</span>
                              <Calendar className="w-3 h-3" />
                              <span>{remark.time}</span>
                            </div>
                            <div className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                              {remark.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Add a new remark..."
                        className="w-full text-xs p-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                      />
                      <button className="absolute right-2 top-1.5 p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu for Heatmap (Global Float) */}
      {activeMenu && (
        <div ref={menuRef} className="fixed z-[200] bg-white border border-gray-200 rounded-lg shadow-2xl py-1 min-w-[180px]" style={{ left: activeMenu.x, top: activeMenu.y + 4 }}>
          <button onClick={() => navigateToDetail(activeMenu.entity, activeMenu.period)} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-blue-600 font-bold hover:bg-blue-50">
            <ExternalLink className="w-4 h-4" /> 查看数据明细
          </button>
          <button className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 border-t border-gray-50">
            <Bookmark className="w-4 h-4" /> 加入收藏
          </button>
        </div>
      )}
    </div>
  );
};

export default DataQuery;
