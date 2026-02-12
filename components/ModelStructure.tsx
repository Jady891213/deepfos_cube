import React, { useState } from 'react';
import { Dimension, ModelConfig } from '../types';
import { 
  Plus, Search, Folder, Database, Link, Edit2, Trash2, 
  Settings2, LayoutGrid, Network, List, Sliders, 
  Calendar, AlertCircle, Info, ChevronRight, Layers, 
  Box, MoreVertical, Table2, FileType, Hash, 
  ArrowRightLeft, Shield, Zap, Server, Code
} from 'lucide-react';
import ModelDiagram from './ModelDiagram';

const ModelStructure: React.FC = () => {
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    code: 'finance_cube_v3',
    name: 'Group Consolidated Model',
    factTable: 'fact_financial_transactions',
    description: 'Centralized multi-dimensional cube for group financial reporting and planning across all business units.'
  });

  const [clickhouseConfig, setClickhouseConfig] = useState({
    engine: 'ReplacingMergeTree',
    cluster: 'default_cluster',
    partitionBy: 'toYYYYMM(event_date)',
    orderBy: '(scenario_id, entity_id, period_id, account_id)'
  });

  const [dimensions, setDimensions] = useState<Dimension[]>([
    { id: '1', code: 'scenario', name: 'Scenario', type: 'Scenario', binding: 'scenario_id' },
    { id: '2', code: 'version', name: 'Version', type: 'Version', binding: 'version_id' },
    { id: '3', code: 'entity', name: 'Entity', type: 'Entity', binding: 'entity_id' },
    { id: '4', code: 'year', name: 'Year', type: 'Year', binding: 'year_id' },
    { id: '5', code: 'period', name: 'Period', type: 'Period', binding: 'period_id' },
    { id: '6', code: 'account', name: 'Account', type: 'Account', binding: 'account_id' },
    { id: '7', code: 'amount', name: 'Amount', type: 'Generic', isMeasure: true, binding: 'amount' },
    { id: '8', code: 'local_amount', name: 'Local Amount', type: 'Generic', isMeasure: true, binding: 'local_amount' },
  ]);

  const [selectedDimId, setSelectedDimId] = useState<string | null>('1'); 
  const [viewMode, setViewMode] = useState<'define' | 'visualize'>('define');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'basic' | 'storage' | 'advanced'>('basic');

  const selectedDim = dimensions.find(d => d.id === selectedDimId);
  const dimCount = dimensions.filter(d => !d.isMeasure).length;
  const measureCount = dimensions.filter(d => d.isMeasure).length;

  const [advSettings, setAdvSettings] = useState({
      autoAgg: true,
      timeGrain: 'Month',
      nullDisplay: '-',
      postWriteAction: 'No Action'
  });

  const getDimensionBadges = (dim: Dimension) => {
    if (dim.isMeasure) {
        return [{ label: 'Decimal(18,2)', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' }];
    }
    switch (dim.type) {
        case 'Scenario': return [{ label: 'Scenario Class', color: 'bg-purple-50 text-purple-700 border-purple-100' }];
        case 'Version': return [{ label: 'Ver Class', color: 'bg-purple-50 text-purple-700 border-purple-100' }];
        case 'Entity': return [{ label: 'Multi-Ver', color: 'bg-blue-50 text-blue-700 border-blue-100' }, { label: 'Entity Class', color: 'bg-purple-50 text-purple-700 border-purple-100' }];
        case 'Year': return [{ label: 'Year Class', color: 'bg-purple-50 text-purple-700 border-purple-100' }];
        case 'Account': return [{ label: 'Acct Class', color: 'bg-purple-50 text-purple-700 border-purple-100' }];
        default: return [{ label: 'General', color: 'bg-gray-50 text-gray-700 border-gray-100' }];
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
                <h1 className="font-bold text-gray-800 text-sm">Model Definition</h1>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider uppercase">Structure Configuration</p>
            </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-1 rounded-xl border border-gray-200 flex">
                <button 
                    onClick={() => setViewMode('define')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'define' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Sliders className="w-3.5 h-3.5" /> Definition
                </button>
                <button 
                    onClick={() => setViewMode('visualize')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'visualize' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Network className="w-3.5 h-3.5" /> Topology
                </button>
            </div>
        </div>
      </div>

      {/* Main UI Body */}
      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'visualize' ? (
             <ModelDiagram dimensions={dimensions} modelConfig={modelConfig} />
        ) : (
            <div className="flex h-full">
                
                {/* LEFT: MODEL PROPERTIES & STORAGE */}
                <div className="w-[340px] bg-white border-r border-gray-200 flex flex-col z-20 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.02)]">
                    <div className="flex border-b border-gray-100 bg-gray-50/50">
                        {['basic', 'storage', 'advanced'].map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => setActiveSettingsTab(tab as any)}
                                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-center transition-all border-b-2
                                ${activeSettingsTab === tab ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {activeSettingsTab === 'basic' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Metadata</h3>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase">Model Identifier</label>
                                        <input 
                                            type="text" 
                                            value={modelConfig.code}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-mono font-bold rounded-xl p-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase">Display Name</label>
                                        <input 
                                            type="text" 
                                            value={modelConfig.name}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl p-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase">Description</label>
                                        <textarea 
                                            rows={4}
                                            value={modelConfig.description}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-xl p-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all resize-none leading-relaxed"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSettingsTab === 'storage' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Database className="w-4 h-4 text-blue-600" />
                                        <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-[0.2em]">ClickHouse Engine</h3>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase">Target Fact Table</label>
                                        <div className="relative">
                                            <Server className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <input 
                                                type="text" 
                                                value={modelConfig.factTable}
                                                className="w-full bg-blue-50/50 border border-blue-100 text-blue-700 text-xs font-mono font-bold rounded-xl p-3 pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase">Engine Type</label>
                                        <select className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl p-3">
                                            <option>MergeTree</option>
                                            <option>ReplacingMergeTree</option>
                                            <option>AggregatingMergeTree</option>
                                            <option>Distributed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase">Partition Key</label>
                                        <input type="text" value={clickhouseConfig.partitionBy} className="w-full bg-gray-50 border border-gray-200 text-gray-600 text-xs font-mono rounded-xl p-3" />
                                    </div>
                                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                                        <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                                            Ensure the partition key aligns with your query patterns for optimal ClickHouse performance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSettingsTab === 'advanced' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Runtime Config</h3>
                                    <div className="bg-gray-50 p-5 rounded-[24px] border border-gray-100 space-y-5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-gray-700">Auto-Aggregation</span>
                                            <div className="relative inline-block w-8 h-4 align-middle select-none">
                                                <input type="checkbox" checked={advSettings.autoAgg} className="toggle-checkbox absolute block w-3 h-3 rounded-full bg-white border-4 appearance-none cursor-pointer border-blue-600 right-0 top-0.5"/>
                                                <label className="toggle-label block overflow-hidden h-4 rounded-full bg-blue-600 cursor-pointer"></label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase">Time Granularity</label>
                                            <select className="w-full bg-white border border-gray-200 text-gray-800 text-xs font-bold rounded-xl p-2.5">
                                                <option>Day</option>
                                                <option>Month</option>
                                                <option>Quarter</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase">Post-Write Strategy</label>
                                        <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                                            <Zap className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                                            <span className="text-[10px] font-black uppercase text-gray-400">Configure Trigger</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* MIDDLE: FACT TABLE FIELDS LIST */}
                <div className="flex-1 bg-white flex flex-col min-w-[500px] border-r border-gray-200 relative overflow-hidden">
                     {/* List Header */}
                     <div className="h-20 px-8 border-b border-gray-200 flex justify-between items-center shrink-0 bg-white z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Table2 className="w-4 h-4 text-gray-400" />
                                <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Fact Structure</h2>
                            </div>
                             <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                <span className="flex items-center gap-1.5"><Layers className="w-3 h-3" /> {dimCount} Dimensions</span>
                                <span className="flex items-center gap-1.5"><Hash className="w-3 h-3" /> {measureCount} Measures</span>
                             </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3.5 top-3 w-3.5 h-3.5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Search Field..." 
                                    className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 w-56 outline-none transition-all"
                                />
                            </div>
                            <button className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                                <Plus className="w-3.5 h-3.5" /> Add Field
                            </button>
                        </div>
                    </div>

                    {/* Table Titles */}
                    <div className="px-8 py-3 bg-gray-50 border-b border-gray-200 flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <div className="w-[35%]">Logical Mapping</div>
                        <div className="w-[30%]">Physical Binding</div>
                        <div className="flex-1 text-right">Semantic Class</div>
                    </div>

                    {/* Dimensions & Measures List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {dimensions.map(dim => {
                            const badges = getDimensionBadges(dim);
                            const isSelected = selectedDimId === dim.id;
                            
                            return (
                                <div 
                                    key={dim.id}
                                    onClick={() => setSelectedDimId(dim.id)}
                                    className={`group flex items-center px-8 py-5 border-b border-gray-50 cursor-pointer transition-all hover:bg-blue-50/30
                                    ${isSelected ? 'bg-blue-50/60 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                                >
                                    {/* Logical Mapping */}
                                    <div className="w-[35%] flex items-center gap-4">
                                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-all
                                            ${isSelected 
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                                                : 'bg-white border-gray-200 text-gray-400 group-hover:border-blue-200'}`}>
                                            {dim.isMeasure ? <Hash className="w-4 h-4" /> : <FileType className="w-4 h-4" />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className={`text-xs font-black truncate ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>{dim.name}</div>
                                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">{dim.code}</div>
                                        </div>
                                    </div>

                                    {/* Physical Binding */}
                                    <div className="w-[30%] flex items-center gap-3">
                                        <Link className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-400' : 'text-gray-300'}`} />
                                        <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100 truncate">
                                            {dim.binding}
                                        </span>
                                    </div>

                                    {/* Semantic Badges */}
                                    <div className="flex-1 flex justify-end gap-2 overflow-hidden">
                                        {badges.map((badge, i) => (
                                             <span key={i} className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border tracking-tighter whitespace-nowrap ${badge.color}`}>
                                                {badge.label}
                                             </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: PROPERTY EDITOR */}
                <div className="w-[400px] bg-white flex flex-col z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] border-l border-gray-200">
                    {selectedDim ? (
                        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-2">
                                    <Settings2 className="w-4 h-4 text-gray-500" />
                                    <h2 className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Field Inspector</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                                {/* Field ID Card */}
                                <div className="flex items-center gap-5 pb-8 border-b border-gray-100">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl ${selectedDim.isMeasure ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-blue-600 text-white shadow-blue-500/20'}`}>
                                        {selectedDim.isMeasure ? <Database className="w-7 h-7" /> : <Box className="w-7 h-7" />}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-gray-900 leading-tight">{selectedDim.name}</h3>
                                        <div className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-widest">{selectedDim.code}</div>
                                    </div>
                                </div>

                                {/* Core Settings */}
                                <div className="space-y-6">
                                     <div className="group">
                                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Logical Name</label>
                                        <input type="text" value={selectedDim.name} className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl p-3" />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Semantic Category</label>
                                        <div className="relative">
                                            <select className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl p-3 appearance-none outline-none">
                                                <option>{selectedDim.type}</option>
                                                <option>Generic</option>
                                                <option>Time</option>
                                                <option>Organization</option>
                                                <option>Metric</option>
                                            </select>
                                            <ChevronRight className="absolute right-3 top-3 w-4 h-4 text-gray-400 rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                {/* ClickHouse Binding */}
                                <div className="bg-blue-50/50 rounded-[32px] p-8 border border-blue-100 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-800 uppercase tracking-widest">
                                            <Code className="w-4 h-4" /> Physical Mapping
                                        </div>
                                        <div className="text-[9px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase">System Level</div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[10px] font-bold text-blue-400 mb-2 uppercase">CH Column Identifier</label>
                                        <div className="relative">
                                            <Table2 className="absolute left-3 top-3 w-4 h-4 text-blue-300" />
                                            <input 
                                                type="text" 
                                                value={selectedDim.binding} 
                                                className="w-full bg-white border border-blue-200 text-blue-700 text-xs font-mono font-bold rounded-xl p-3 pl-10" 
                                            />
                                        </div>
                                        <p className="text-[10px] text-blue-400/80 mt-3 leading-relaxed">
                                            Bound to column <code>{selectedDim.binding}</code> in table <code>{modelConfig.factTable}</code>.
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-blue-100">
                                         <label className="flex items-center gap-4 cursor-pointer">
                                            <div className="relative flex items-center">
                                                <input type="checkbox" checked={selectedDim.isMeasure || false} className="peer sr-only" />
                                                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                            </div>
                                            <div className="flex-1">
                                                <span className="block text-[11px] font-black text-gray-800 uppercase tracking-tight">Numerical Fact</span>
                                                <span className="block text-[9px] text-gray-500 font-medium leading-tight">Enable aggregation logic for this field.</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-8 border-t border-gray-100 bg-white">
                                <button className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-[0.98]">
                                    Apply Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-10 text-center">
                            <Sliders className="w-14 h-14 opacity-10 mb-6" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Inspector Idle</h4>
                            <p className="text-[10px] font-medium text-gray-400 max-w-[200px] leading-relaxed">Select a structural element from the center grid to begin detailed configuration.</p>
                        </div>
                    )}
                </div>

            </div>
        )}
      </div>
    </div>
  );
};

export default ModelStructure;