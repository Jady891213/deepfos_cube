import React, { useState } from 'react';
import { Dimension, ModelConfig } from '../types';
import { 
  Plus, Search, Folder, Database, Link, Edit2, Trash2, 
  Settings2, LayoutGrid, Network, List, Sliders, 
  Calendar, AlertCircle, Info, ChevronRight, Layers, 
  Box, MoreVertical, Table2, FileType, Hash, 
  ArrowRightLeft, Shield, Zap, Server, Code, ExternalLink
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
  const [selectedTableId, setSelectedTableId] = useState<string | null>('fact');
  const [viewMode, setViewMode] = useState<'define' | 'tables' | 'visualize'>('define');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'basic' | 'storage' | 'advanced'>('basic');

  const physicalTables = [
    { 
      id: 'fact', name: '事实主表', tableName: 'fact_financial_transactions', 
      rows: '12.5M', size: '2.4 GB', updated: '10 mins ago',
      engine: 'ReplacingMergeTree', partitioned: true, partitionKey: 'toYYYYMM(event_date)',
      orderBy: '(scenario_id, entity_id, period_id, account_id)', primaryKey: '(scenario_id, entity_id)',
      ttl: 'event_date + INTERVAL 5 YEAR', compression: 'LZ4'
    },
    { 
      id: 'annotation', name: '批注表', tableName: 'dim_annotations', 
      rows: '45.2K', size: '12 MB', updated: '1 hour ago',
      engine: 'MergeTree', partitioned: false, partitionKey: '-',
      orderBy: '(annotation_id)', primaryKey: '(annotation_id)',
      ttl: 'None', compression: 'LZ4'
    },
    { 
      id: 'attachment', name: '附件表', tableName: 'sys_attachments', 
      rows: '1.2K', size: '850 MB', updated: '2 hours ago',
      engine: 'MergeTree', partitioned: true, partitionKey: 'toYYYYMM(upload_date)',
      orderBy: '(attachment_id)', primaryKey: '(attachment_id)',
      ttl: 'None', compression: 'ZSTD'
    },
    { 
      id: 'log', name: '日志表', tableName: 'sys_audit_logs', 
      rows: '8.9M', size: '1.1 GB', updated: 'Just now',
      engine: 'MergeTree', partitioned: true, partitionKey: 'toYYYYMMDD(log_time)',
      orderBy: '(log_time, user_id)', primaryKey: '(log_time)',
      ttl: 'log_time + INTERVAL 1 YEAR', compression: 'LZ4'
    },
    { 
      id: 'acl', name: '权限控制表', tableName: 'sec_access_control', 
      rows: '850', size: '245 KB', updated: '1 day ago',
      engine: 'ReplacingMergeTree', partitioned: false, partitionKey: '-',
      orderBy: '(role_id, resource_id)', primaryKey: '(role_id)',
      ttl: 'None', compression: 'LZ4'
    },
    { 
      id: 'mdx_main', name: 'MDX主表', tableName: 'mdx_scripts_main', 
      rows: '124', size: '56 KB', updated: '3 days ago',
      engine: 'ReplacingMergeTree', partitioned: false, partitionKey: '-',
      orderBy: '(script_id)', primaryKey: '(script_id)',
      ttl: 'None', compression: 'LZ4'
    },
    { 
      id: 'mdx_history', name: 'MDX执行历史', tableName: 'mdx_execution_history', 
      rows: '1.2M', size: '340 MB', updated: '5 mins ago',
      engine: 'MergeTree', partitioned: true, partitionKey: 'toYYYYMM(execution_time)',
      orderBy: '(execution_time, script_id)', primaryKey: '(execution_time)',
      ttl: 'execution_time + INTERVAL 3 MONTH', compression: 'LZ4'
    },
  ];

  const selectedDim = dimensions.find(d => d.id === selectedDimId);
  const selectedTable = physicalTables.find(t => t.id === selectedTableId);
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
                    onClick={() => setViewMode('tables')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'tables' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Table2 className="w-3.5 h-3.5" /> 表结构
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
        ) : viewMode === 'tables' ? (
            <div className="flex h-full">
                {/* LEFT: TABLE LIST */}
                <div className="w-[340px] bg-white border-r border-gray-200 flex flex-col z-20 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.02)]">
                    <div className="h-14 px-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
                        <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Physical Tables</h2>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">{physicalTables.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {physicalTables.map(table => (
                            <div 
                                key={table.id}
                                onClick={() => setSelectedTableId(table.id)}
                                className={`group p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-blue-50/30
                                ${selectedTableId === table.id ? 'bg-blue-50/60 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-xs font-black ${selectedTableId === table.id ? 'text-blue-700' : 'text-gray-800'}`}>{table.name}</span>
                                    {table.partitioned && <span className="text-[8px] font-black bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase">Partitioned</span>}
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono truncate">{table.tableName}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: TABLE DETAILS */}
                <div className="flex-1 bg-gray-50 flex flex-col relative overflow-hidden">
                    {selectedTable ? (
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="max-w-3xl mx-auto space-y-6">
                                {/* Header Card */}
                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                            <Database className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-black text-gray-900">{selectedTable.name}</h2>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{selectedTable.tableName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors bg-gray-50 hover:bg-blue-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-200">
                                        <ExternalLink className="w-3.5 h-3.5" /> View Data
                                    </button>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Row Count</span>
                                        <span className="text-lg font-bold text-gray-800">{selectedTable.rows}</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Storage Size</span>
                                        <span className="text-lg font-bold text-gray-800">{selectedTable.size}</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Updated</span>
                                        <span className="text-lg font-bold text-gray-800">{selectedTable.updated}</span>
                                    </div>
                                </div>

                                {/* Storage & Engine Config */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                                        <Settings2 className="w-4 h-4 text-gray-500" />
                                        <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Storage & Engine Configuration</h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Engine</label>
                                                <div className="text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">{selectedTable.engine}</div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Compression</label>
                                                <div className="text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">{selectedTable.compression}</div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-100">
                                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Partition Key</label>
                                            <div className="flex items-center gap-3">
                                                <div className={`text-sm font-mono rounded-lg px-3 py-2 flex-1 border ${selectedTable.partitioned ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                                                    {selectedTable.partitionKey}
                                                </div>
                                                {selectedTable.partitioned && (
                                                    <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-1 rounded uppercase shrink-0">Partitioned</span>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Order By (Sorting Key)</label>
                                            <div className="text-sm font-mono text-gray-700 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 break-all">
                                                {selectedTable.orderBy}
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-1.5">Determines how data is sorted on disk, crucial for query performance.</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Primary Key</label>
                                                <div className="text-sm font-mono text-gray-700 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 break-all">
                                                    {selectedTable.primaryKey}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Time-To-Live (TTL)</label>
                                                <div className="text-sm font-mono text-gray-700 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                                                    {selectedTable.ttl}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">Select a table to view details</div>
                    )}
                </div>
            </div>
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
                                            defaultValue={modelConfig.code}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-mono font-bold rounded-xl p-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase">Display Name</label>
                                        <input 
                                            type="text" 
                                            defaultValue={modelConfig.name}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl p-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase">Description</label>
                                        <textarea 
                                            rows={4}
                                            defaultValue={modelConfig.description}
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
                                                defaultValue={modelConfig.factTable}
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
                                        <input type="text" defaultValue={clickhouseConfig.partitionBy} className="w-full bg-gray-50 border border-gray-200 text-gray-600 text-xs font-mono rounded-xl p-3" />
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
                                                <input type="checkbox" defaultChecked={advSettings.autoAgg} className="toggle-checkbox absolute block w-3 h-3 rounded-full bg-white border-4 appearance-none cursor-pointer border-blue-600 right-0 top-0.5"/>
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
                                        <input type="text" defaultValue={selectedDim.name} className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl p-3" />
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
                                                defaultValue={selectedDim.binding} 
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
                                                <input type="checkbox" defaultChecked={selectedDim.isMeasure || false} className="peer sr-only" />
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