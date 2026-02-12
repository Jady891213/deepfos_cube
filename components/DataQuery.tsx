
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, Search, Table, Radar, Code2, Clock, 
  ChevronDown, Database, Download, Filter, 
  Activity, ArrowRight, Globe, History, X, Save, 
  Bookmark, Trash2, ChevronLeft, ChevronRight,
  MoreHorizontal, ListFilter, ExternalLink, Paperclip, 
  MessageSquare, FileText, User, Calendar, Plus, 
  Settings2, SlidersHorizontal, Check, Info, Settings,
  Maximize2, FileDown, ShieldCheck, TrendingUp, Layers,
  LayoutDashboard
} from 'lucide-react';

type SearchMode = 'query' | 'discovery';
type QueryResultTab = 'table' | 'sql';

interface DimensionPlacement {
  id: string;
  name: string;
  location: 'pov' | 'param';
}

interface HistoryItem {
  id: string;
  name: string;
  timestamp: string;
  mode: SearchMode;
  pov: Record<string, string>;
  filters: Record<string, string>;
}

const DataQuery: React.FC = () => {
  const [searchMode, setSearchMode] = useState<SearchMode>('query');
  const [queryTab, setQueryTab] = useState<QueryResultTab>('table');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [hoverHistoryId, setHoverHistoryId] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const [placements, setPlacements] = useState<DimensionPlacement[]>([
    { id: 'year', name: 'Year', location: 'pov' },
    { id: 'scenario', name: 'Scenario', location: 'pov' },
    { id: 'version', name: 'Version', location: 'pov' },
    { id: 'entity', name: 'Entity', location: 'param' },
    { id: 'period', name: 'Period', location: 'param' },
    { id: 'account', name: 'Account', location: 'param' },
  ]);

  const [dimValues, setDimValues] = useState<Record<string, string>>({
    year: '2024',
    scenario: 'Actual',
    version: 'Working',
    entity: 'China_HQ',
    period: 'Jan',
    account: '6001'
  });

  const povDims = placements.filter(p => p.location === 'pov');
  const paramDims = placements.filter(p => p.location === 'param');

  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'h1',
      name: 'Monthly Audit Q1',
      timestamp: '15 mins ago',
      mode: 'query',
      pov: { year: '2024', scenario: 'Actual', version: 'Final' },
      filters: { entity: 'China_HQ', period: 'Jan', account: '6001' }
    }
  ]);

  const handleRun = () => {
    setIsProcessing(true);
    setHasData(false);
    setSelectedRow(null);
    setTimeout(() => {
      setHasData(true);
      setIsProcessing(false);
      
      const newHistory: HistoryItem = {
        id: `h-${Date.now()}`,
        name: `${searchMode === 'query' ? 'Query' : 'Scan'} - ${dimValues.period || 'Period'}`,
        timestamp: 'Just now',
        mode: searchMode,
        pov: povDims.reduce((acc, d) => ({ ...acc, [d.name]: dimValues[d.id] }), {}),
        filters: paramDims.reduce((acc, d) => ({ ...acc, [d.name]: dimValues[d.id] }), {}),
      };
      setHistory([newHistory, ...history]);
    }, 800);
  };

  const drillDown = (period: string, account: string) => {
    setDimValues(prev => ({
      ...prev,
      period,
      account
    }));
    setSearchMode('query');
    setQueryTab('table');
    handleRun();
  };

  const applyHistory = (item: HistoryItem) => {
    const newDimValues = { ...dimValues };
    Object.entries(item.pov).forEach(([name, val]) => {
      const dim = placements.find(p => p.name === name);
      if (dim) newDimValues[dim.id] = val;
    });
    Object.entries(item.filters).forEach(([name, val]) => {
      const dim = placements.find(p => p.name === name);
      if (dim) newDimValues[dim.id] = val;
    });
    setDimValues(newDimValues);
    setSearchMode(item.mode);
  };

  const togglePlacement = (id: string) => {
    setPlacements(prev => prev.map(p => 
      p.id === id ? { ...p, location: p.location === 'pov' ? 'param' : 'pov' } : p
    ));
  };

  const generatedSql = useMemo(() => {
    const table = "fact_cube_v3";
    const povConditions = Object.entries(dimValues)
      .filter(([k]) => placements.find(p => p.id === k && p.location === 'pov'))
      .map(([k, v]) => `${k} = '${v}'`);
    const paramConditions = Object.entries(dimValues)
      .filter(([k]) => placements.find(p => p.id === k && p.location === 'param'))
      .map(([k, v]) => `${k} LIKE '%${v}%'`);
    
    const where = [...povConditions, ...paramConditions].join('\n  AND ');

    return `SELECT 
  account_id, 
  period_id, 
  SUM(fact_value) AS value,
  count(attach_id) as attachments,
  max(last_memo) as note
FROM ${table}
WHERE ${where}
GROUP BY account_id, period_id
ORDER BY period_id ASC
LIMIT 5000
FORMAT JSON;`;
  }, [dimValues, placements]);

  const mockTableData = useMemo(() => {
    return [1,2,3,4,5,6,7,8,9,10,11,12].map(i => ({
      id: `fact-00${i}`,
      account: `${dimValues.account || '6001.001'} - DeepCube Analytics`,
      period: `2024-M0${i}`,
      value: (Math.random() * 200000) + 50000,
      attachments: Math.floor(Math.random() * 2),
      comments: Math.floor(Math.random() * 4),
      entity: dimValues.entity,
      status: i % 3 === 0 ? 'Pending' : 'Approved'
    }));
  }, [hasData, dimValues]);

  const scanPeriods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const scanAccounts = ['6001.01', '6001.02', '6001.03', '6002.01', '6002.02', '6003.01', '6004.05', '6005.00'];
  
  const scanGrid = useMemo(() => {
    const grid = [];
    for (let pIdx = 0; pIdx < scanPeriods.length; pIdx++) {
      for (let aIdx = 0; aIdx < scanAccounts.length; aIdx++) {
        grid.push({
          period: scanPeriods[pIdx],
          account: scanAccounts[aIdx],
          val: Math.random() * 100
        });
      }
    }
    return grid;
  }, [hasData]);

  return (
    <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden">
      
      {/* 1. Global POV Bar */}
      <div className="min-h-[56px] py-3 bg-white border-b border-gray-200 px-8 flex flex-wrap items-center gap-y-3 gap-x-8 shrink-0 z-[100] shadow-sm">
        <div className="flex items-center gap-2 border-r border-gray-200 pr-6 shrink-0 h-6">
          <Globe className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Global Perspective</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 flex-1">
          {povDims.map((dim) => (
            <div key={dim.id} className="flex items-center gap-3 group cursor-pointer">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter whitespace-nowrap">{dim.name}:</span>
              <div className="flex items-center gap-1.5 bg-blue-50/50 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 border border-blue-100 group-hover:bg-blue-100/50 transition-all">
                {dimValues[dim.id] || 'N/A'} 
                <ChevronDown className="w-3.5 h-3.5 opacity-40" />
              </div>
            </div>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setShowPlacementModal(true)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>

          <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-200">
            <button 
              onClick={() => { setSearchMode('query'); setHasData(false); }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${searchMode === 'query' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Search className="w-3.5 h-3.5" /> Query
            </button>
            <button 
              onClick={() => { setSearchMode('discovery'); setHasData(false); }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${searchMode === 'discovery' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Radar className="w-3.5 h-3.5" /> Scan
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <div className="flex bg-white border-r border-gray-200 shrink-0 relative z-[90] shadow-[4px_0_15px_-3px_rgba(0,0,0,0.03)]">
          <div className={`flex flex-col border-r border-gray-100 bg-gray-50/50 transition-all duration-300 ${showHistory ? 'w-[280px]' : 'w-0 overflow-hidden'}`}>
             <div className="h-14 px-5 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-500" /> Snapshots
                </h3>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {history.map(item => (
                  <div 
                    key={item.id}
                    onMouseEnter={() => setHoverHistoryId(item.id)}
                    onMouseLeave={() => setHoverHistoryId(null)}
                    className="relative group bg-white border border-gray-200 rounded-2xl p-4 cursor-default hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${item.mode === 'query' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                        {item.mode}
                      </span>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => applyHistory(item)} className="p-1.5 hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-100 rounded-lg transition-all">
                            <Play className="w-3 h-3 fill-current" />
                         </button>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-800 truncate mb-1">{item.name}</div>
                    <div className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {item.timestamp}
                    </div>

                    {hoverHistoryId === item.id && (
                      <div className="absolute left-[102%] top-0 w-72 bg-white/98 backdrop-blur shadow-[0_30px_60px_rgba(0,0,0,0.25)] rounded-[32px] border border-gray-100 z-[2000] p-6 pointer-events-none animate-in fade-in slide-in-from-left-4 duration-300 ring-1 ring-black/5">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-4 mb-4 flex items-center gap-2">
                          <Info className="w-3.5 h-3.5 text-blue-500" /> Snapshot Params
                        </h4>
                        <div className="space-y-6">
                           <div className="space-y-3">
                             <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">POV Context</div>
                             <div className="grid grid-cols-2 gap-2.5">
                               {Object.entries(item.pov).map(([k, v]) => (
                                 <div key={k} className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50">
                                    <span className="block text-[9px] text-blue-400 font-black uppercase mb-1 truncate">{k}</span>
                                    <span className="block text-xs text-blue-800 font-black truncate">{v}</span>
                                 </div>
                               ))}
                             </div>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
             </div>
          </div>

          <div className="w-72 flex flex-col bg-white">
            <div className="h-14 px-6 border-b border-gray-200 flex items-center justify-between shrink-0">
               <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Workspace
              </h3>
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`p-1.5 rounded-xl transition-all ${showHistory ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                 <History className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {paramDims.map(dim => (
                <div key={dim.id} className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-tight ml-1">{dim.name}</label>
                  <div className="relative group">
                    <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="text"
                      value={dimValues[dim.id]}
                      onChange={(e) => setDimValues({...dimValues, [dim.id]: e.target.value})}
                      className="w-full text-xs p-3.5 pl-10 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <button 
                  onClick={handleRun}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-3xl text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-[0.98]
                  ${searchMode === 'query' ? 'bg-blue-600 text-white shadow-blue-500/30 hover:bg-blue-700' : 'bg-purple-600 text-white shadow-purple-500/30 hover:bg-purple-700'}`}
                >
                  {isProcessing ? <Activity className="w-5 h-5 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  {searchMode === 'query' ? 'Execute Query' : 'Deep Scan'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="flex-1 flex overflow-hidden z-0">
          <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden relative">
            {!hasData && !isProcessing ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-300 animate-in fade-in duration-700 bg-gray-50/30">
                <Database className="w-12 h-12 opacity-10 mb-8" />
                <h3 className="font-black text-xs uppercase tracking-[0.4em] text-gray-400 mb-2">Fact Engine Ready</h3>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Run query to explore data</p>
              </div>
            ) : isProcessing ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-white z-50">
                <Radar className={`w-8 h-8 mb-6 ${searchMode === 'discovery' ? 'text-purple-600 animate-pulse' : 'text-blue-600 animate-spin'}`} />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Scanning Table Fragments...</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col p-8 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between mb-8 shrink-0">
                  <div className="flex bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200">
                    <button onClick={() => setQueryTab('table')} className={`px-8 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${queryTab === 'table' ? 'bg-white text-blue-700 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}>
                      {searchMode === 'query' ? <Table className="w-4 h-4 inline mr-2" /> : <LayoutDashboard className="w-4 h-4 inline mr-2" />} 
                      {searchMode === 'query' ? 'Detail Grid' : 'Matrix'}
                    </button>
                    <button onClick={() => setQueryTab('sql')} className={`px-8 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${queryTab === 'sql' ? 'bg-white text-blue-700 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}>
                      <Code2 className="w-4 h-4 inline mr-2" /> SQL Script
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden bg-white border border-gray-200 rounded-[32px] shadow-sm relative">
                  {queryTab === 'sql' ? (
                    <div className="flex-1 flex flex-col bg-[#111111] p-10 overflow-auto">
                        <pre className="font-mono text-sm leading-relaxed text-blue-300/90 whitespace-pre-wrap">{generatedSql}</pre>
                    </div>
                  ) : searchMode === 'discovery' ? (
                    <div className="flex-1 p-6 flex flex-col overflow-hidden bg-gray-50/20">
                       <div className="flex justify-between items-center mb-6 px-4">
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Cross-sectional Analysis (Period x Account)</h4>
                       </div>
                       
                       <div className="flex-1 overflow-auto custom-scrollbar bg-white rounded-3xl border border-gray-200 p-8 shadow-inner">
                          <div 
                            className="inline-grid gap-2"
                            style={{ 
                              gridTemplateColumns: `80px repeat(${scanAccounts.length}, 56px)`,
                              gridAutoRows: '56px'
                            }}
                          >
                             <div className="h-8" />
                             {scanAccounts.map(acc => (
                               <div key={acc} className="h-8 text-[8px] font-black text-gray-400 text-center uppercase truncate self-end px-1" title={acc}>
                                  {acc}
                               </div>
                             ))}

                             {scanPeriods.map((period, pIdx) => (
                               <React.Fragment key={period}>
                                  <div className="flex items-center justify-end pr-4 text-[10px] font-black text-gray-500 uppercase">
                                     {period}
                                  </div>
                                  
                                  {scanAccounts.map((acc, aIdx) => {
                                    const cellData = scanGrid[pIdx * scanAccounts.length + aIdx];
                                    const colorClass = cellData.val > 80 ? 'bg-purple-700 text-white shadow-purple-200' : 
                                                      cellData.val > 50 ? 'bg-purple-500 text-white' : 
                                                      cellData.val > 25 ? 'bg-purple-200 text-purple-900 border-purple-300' : 'bg-purple-50 text-purple-300 border-purple-100';
                                    
                                    // 根据行位置决定 Tooltip 向上还是向下弹出，防止被容器遮挡
                                    const isBottomHalf = pIdx > scanPeriods.length / 2;

                                    return (
                                      <div key={`${period}-${acc}`} className="relative group">
                                         <div 
                                           className={`w-14 h-14 rounded-xl flex items-center justify-center text-[11px] font-black border transition-all cursor-pointer hover:scale-110 hover:shadow-2xl active:scale-95 ${colorClass}`}
                                           onClick={() => drillDown(period, acc)}
                                         >
                                            {Math.round(cellData.val)}
                                            
                                            {/* Tooltip - 设置极高 Z-Index 并根据行位置调整弹出方向 */}
                                            <div className={`absolute left-1/2 -translate-x-1/2 w-48 bg-slate-900/95 backdrop-blur-xl text-white p-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[3000] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 ring-1 ring-black/40 
                                              ${isBottomHalf ? 'bottom-[120%] mb-2 animate-in slide-in-from-bottom-2' : 'top-[120%] mt-2 animate-in slide-in-from-top-2'}`}>
                                               <div className="mb-3 text-purple-300 border-b border-white/10 pb-2 flex items-center justify-between">
                                                  Audit Slice <Layers className="w-3 h-3"/>
                                               </div>
                                               <div className="space-y-2 font-mono">
                                                   <div className="flex justify-between">PRD: <span className="text-white">{period}</span></div>
                                                   <div className="flex justify-between">ACC: <span className="text-white">{acc}</span></div>
                                                   <div className="flex justify-between">VAL: <span className="text-white font-black">{cellData.val.toFixed(2)}</span></div>
                                               </div>
                                               <div className="mt-4 pt-2 border-t border-white/5 text-purple-400 animate-pulse text-center">Click to Drill-down →</div>
                                            </div>
                                         </div>
                                      </div>
                                    );
                                  })}
                               </React.Fragment>
                             ))}
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-auto custom-scrollbar">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50/80 backdrop-blur sticky top-0 z-10 border-b border-gray-200">
                          <tr>
                            <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest">Account Structure</th>
                            <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest">Intersect Context</th>
                            <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest text-right">Value (FACT)</th>
                            <th className="px-8 py-6 font-black text-gray-400 uppercase tracking-widest text-center w-32">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-medium">
                          {mockTableData.map(row => (
                            <tr key={row.id} onClick={() => setSelectedRow(row)} className={`hover:bg-blue-50/40 cursor-pointer transition-all border-l-4 border-l-transparent hover:border-l-blue-500 group ${selectedRow?.id === row.id ? 'bg-blue-50/60 border-l-blue-600' : ''}`}>
                              <td className="px-8 py-6">
                                 <div className="text-gray-800 font-black flex items-center gap-2">{row.account}</div>
                                 <div className="text-[10px] text-gray-400 mt-1 font-mono uppercase tracking-tighter">REF: {row.id}</div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex flex-wrap gap-2">
                                   <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-gray-200">{row.period}</span>
                                   <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-blue-100">{row.entity}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-right font-mono font-black text-gray-900 text-sm">{row.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td className="px-8 py-6 text-center">
                                 <div className="flex items-center justify-center gap-4">
                                   <div className={`flex items-center gap-1.5 p-1.5 rounded-lg ${row.attachments > 0 ? 'bg-blue-50 text-blue-600' : 'text-gray-200'}`}><Paperclip className="w-4 h-4" />{row.attachments > 0 && <span className="text-[10px] font-black">{row.attachments}</span>}</div>
                                   <div className={`flex items-center gap-1.5 p-1.5 rounded-lg ${row.comments > 0 ? 'bg-purple-50 text-purple-600' : 'text-gray-200'}`}><MessageSquare className="w-4 h-4" />{row.comments > 0 && <span className="text-[10px] font-black">{row.comments}</span>}</div>
                                 </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {selectedRow && (
                    <div className="fixed right-0 top-16 bottom-0 w-[420px] bg-white shadow-[-20px_0_80px_rgba(0,0,0,0.15)] border-l border-gray-200 z-[4000] animate-in slide-in-from-right duration-300 flex flex-col">
                      <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                         <div>
                            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Intersection Inspector</h4>
                            <div className="text-base font-black text-gray-800 leading-tight">{selectedRow.account}</div>
                         </div>
                         <button onClick={() => setSelectedRow(null)} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-gray-200"><X className="w-6 h-6 text-gray-400" /></button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                         <div className="space-y-5">
                            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Layers className="w-4 h-4 text-gray-300" /> Context</h5>
                            <div className="grid grid-cols-2 gap-4">
                               {placements.map(p => (
                                 <div key={p.id} className="bg-gray-50 p-4 rounded-3xl border border-gray-100 shadow-sm">
                                    <span className="block text-[8px] font-black text-gray-400 uppercase mb-1.5">{p.name}</span>
                                    <span className="block text-[11px] font-black text-gray-800">{p.id === 'period' ? selectedRow.period : p.id === 'account' ? selectedRow.account.split(' ')[0] : dimValues[p.id]}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                         <div className="space-y-5">
                            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="w-4 h-4 text-gray-300" /> Metrics</h5>
                            <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[36px] shadow-2xl shadow-blue-500/20 text-white">
                               <span className="text-[10px] font-black text-blue-100 uppercase opacity-60">Calculated Fact Amount</span>
                               <div className="text-4xl font-black mt-2 leading-none">{selectedRow.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                            </div>
                         </div>
                      </div>
                      <div className="p-8 border-t border-gray-100 bg-white flex gap-4">
                         <button className="flex-1 py-4 border border-gray-200 rounded-[20px] text-[10px] font-black uppercase text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-3 transition-all"><FileDown className="w-4 h-4" /> Export</button>
                         <button className="flex-1 py-4 bg-blue-600 text-white rounded-[20px] text-[10px] font-black uppercase shadow-2xl shadow-blue-500/30 hover:bg-blue-700 flex items-center justify-center gap-3 transition-all active:scale-95"><ShieldCheck className="w-4 h-4" /> Approve</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPlacementModal && (
        <div className="fixed inset-0 z-[5000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <h3 className="font-black text-gray-800 uppercase tracking-[0.2em] text-sm">Dimension Layout</h3>
               <button onClick={() => setShowPlacementModal(false)} className="p-3 hover:bg-white rounded-2xl"><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <div className="p-10 space-y-4 max-h-[500px] overflow-y-auto">
               {placements.map(dim => (
                 <div key={dim.id} className="flex items-center justify-between p-6 bg-white rounded-[32px] border border-gray-100 hover:border-blue-400 transition-all">
                    <div className="flex items-center gap-5">
                       <div className={`w-14 h-14 rounded-[24px] flex items-center justify-center ${dim.location === 'pov' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                          {dim.location === 'pov' ? <Globe className="w-7 h-7" /> : <ListFilter className="w-7 h-7" />}
                       </div>
                       <div>
                          <span className="block text-base font-black text-gray-800">{dim.name}</span>
                          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${dim.location === 'pov' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100'}`}>{dim.location}</span>
                       </div>
                    </div>
                    <button onClick={() => togglePlacement(dim.id)} className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase text-blue-600 border border-blue-100 hover:bg-blue-50">Switch</button>
                 </div>
               ))}
            </div>
            <div className="p-10 border-t border-gray-100 bg-gray-50/50">
               <button onClick={() => setShowPlacementModal(false)} className="w-full py-4 bg-blue-600 text-white rounded-3xl text-xs font-black uppercase shadow-2xl shadow-blue-500/40">Apply Configuration</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataQuery;
