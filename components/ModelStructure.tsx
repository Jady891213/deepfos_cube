
import React, { useState } from 'react';
import { Dimension, ModelConfig } from '../types';
import { Plus, Search, Folder, Database, Link, Edit2, Trash2, GripVertical, Settings2, LayoutGrid, Network, List, Sliders, Calendar, AlertCircle, Info, ChevronRight, Layers, Box, MoreVertical, Table2, FileType, Hash, ArrowRightLeft } from 'lucide-react';
import ModelDiagram from './ModelDiagram';

const ModelStructure: React.FC = () => {
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    code: 'main_cube',
    name: 'Sales Forecast 2024',
    factTable: 'fact_sales_monthly_v1',
    description: 'Core financial planning model for monthly revenue and expense forecasting.'
  });

  const [dimensions, setDimensions] = useState<Dimension[]>([
    { id: '1', code: 'scenario', name: 'Scenario', type: 'Scenario', binding: 'dim_scenario' },
    { id: '2', code: 'version', name: 'Version', type: 'Version', binding: 'dim_version' },
    { id: '3', code: 'entity', name: 'Entity', type: 'Entity', binding: 'dim_entity' },
    { id: '4', code: 'year', name: 'Year', type: 'Year', binding: 'dim_year' },
    { id: '5', code: 'period', name: 'Period', type: 'Period', binding: 'dim_period' },
    { id: '6', code: 'account', name: 'Account', type: 'Account', binding: 'dim_account' },
    { id: '7', code: 'amount', name: 'Amount', type: 'Generic', isMeasure: true, binding: 'val_decimal' },
  ]);

  const [selectedDimId, setSelectedDimId] = useState<string | null>('1'); 
  const [viewMode, setViewMode] = useState<'define' | 'visualize'>('define');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'basic' | 'advanced'>('basic');

  const selectedDim = dimensions.find(d => d.id === selectedDimId);
  const dimCount = dimensions.filter(d => !d.isMeasure).length;
  const measureCount = dimensions.filter(d => d.isMeasure).length;

  // Advanced settings state (mock integrated)
  const [advSettings, setAdvSettings] = useState({
      autoAgg: true,
      timeGrain: 'Month',
      nullDisplay: '-',
      postWriteAction: 'No Action'
  });

  // Helper to generate mock attribute badges for display
  const getDimensionBadges = (dim: Dimension) => {
    if (dim.isMeasure) {
        return [{ label: 'Decimal(18,2)', color: 'bg-gray-100 text-gray-500' }];
    }
    switch (dim.type) {
        case 'Scenario': 
            return [{ label: 'Scenario Class', color: 'bg-purple-50 text-purple-700 border-purple-100' }];
        case 'Version':
            return [{ label: 'Ver Class', color: 'bg-purple-50 text-purple-700 border-purple-100' }];
        case 'Entity':
            return [
                { label: 'Multi-Ver', color: 'bg-blue-50 text-blue-700 border-blue-100' }, 
                { label: 'Entity Class', color: 'bg-purple-50 text-purple-700 border-purple-100' }
            ];
        case 'Year':
            return [{ label: 'Year Class', color: 'bg-purple-50 text-purple-700 border-purple-100' }];
        case 'Period':
            return []; // Minimal display
        case 'Account':
            return [{ label: 'Acct Class', color: 'bg-purple-50 text-purple-700 border-purple-100' }];
        default:
            return [{ label: 'General', color: 'bg-green-50 text-green-700 border-green-100' }];
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      {/* 1. Header & View Toggle */}
      <div className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-blue-600" />
            <h1 className="font-bold text-gray-800 text-lg">Model Definition</h1>
        </div>
        
        {/* View Switcher (Tab Style) */}
        <div className="bg-gray-100 p-1 rounded-lg border border-gray-200 flex">
            <button 
                onClick={() => setViewMode('define')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'define' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <LayoutGrid className="w-3.5 h-3.5" /> Structure
            </button>
            <button 
                onClick={() => setViewMode('visualize')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'visualize' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Network className="w-3.5 h-3.5" /> Visualize
            </button>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'visualize' ? (
             <ModelDiagram dimensions={dimensions} modelConfig={modelConfig} />
        ) : (
            <div className="flex h-full">
                
                {/* LEFT COLUMN: Model & Advanced Settings */}
                <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col z-10 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.02)]">
                    
                    {/* Settings Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button 
                            onClick={() => setActiveSettingsTab('basic')}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center transition-colors border-b-2
                            ${activeSettingsTab === 'basic' ? 'border-blue-600 text-blue-700 bg-blue-50/20' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            General Info
                        </button>
                        <button 
                            onClick={() => setActiveSettingsTab('advanced')}
                             className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center transition-colors border-b-2
                            ${activeSettingsTab === 'advanced' ? 'border-purple-600 text-purple-700 bg-purple-50/20' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            Advanced
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                        {activeSettingsTab === 'basic' ? (
                            <div className="space-y-6 animate-in slide-in-from-left-2 duration-200">
                                {/* Identity */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm border-b border-gray-100 pb-2">
                                        <Box className="w-4 h-4" /> Identity
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Model Code</label>
                                        <input 
                                            type="text" 
                                            value={modelConfig.code}
                                            onChange={(e) => setModelConfig({...modelConfig, code: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Display Name</label>
                                        <input 
                                            type="text" 
                                            value={modelConfig.name}
                                            onChange={(e) => setModelConfig({...modelConfig, name: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description</label>
                                        <textarea 
                                            rows={3}
                                            value={modelConfig.description}
                                            onChange={(e) => setModelConfig({...modelConfig, description: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Storage */}
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm border-b border-gray-100 pb-2">
                                        <Database className="w-4 h-4" /> Physical Storage
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">ClickHouse Table</label>
                                        <input 
                                            type="text" 
                                            value={modelConfig.factTable}
                                            onChange={(e) => setModelConfig({...modelConfig, factTable: e.target.value})}
                                            className="w-full bg-blue-50 border border-blue-200 text-blue-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 font-mono font-medium"
                                        />
                                        <div className="mt-2 text-[10px] text-gray-400 flex items-start gap-1">
                                            <Info className="w-3 h-3 shrink-0 mt-0.5" />
                                            Table must use MergeTree engine.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in slide-in-from-right-2 duration-200">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm border-b border-gray-100 pb-2">
                                        <Sliders className="w-4 h-4 text-purple-600" /> Aggregation
                                    </div>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-gray-700">Auto-Aggregation</span>
                                            <div className="relative inline-block w-8 h-4 align-middle select-none transition duration-200 ease-in cursor-pointer">
                                                <input type="checkbox" checked={advSettings.autoAgg} className="toggle-checkbox absolute block w-3 h-3 rounded-full bg-white border-4 appearance-none cursor-pointer border-purple-600 right-0 top-0.5"/>
                                                <label className="toggle-label block overflow-hidden h-4 rounded-full bg-purple-600 cursor-pointer"></label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Time Granularity</label>
                                            <select 
                                                value={advSettings.timeGrain}
                                                onChange={(e) => setAdvSettings({...advSettings, timeGrain: e.target.value})}
                                                className="w-full bg-white border border-gray-300 text-gray-900 text-xs rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                                            >
                                                <option>Month</option>
                                                <option>Day</option>
                                                <option>Year</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm border-b border-gray-100 pb-2">
                                        <Network className="w-4 h-4 text-orange-600" /> Events
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Post-Write Action</label>
                                        <select 
                                            value={advSettings.postWriteAction}
                                            onChange={(e) => setAdvSettings({...advSettings, postWriteAction: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg p-2.5 focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option>No Action</option>
                                            <option>Execute Script</option>
                                            <option>Webhook</option>
                                        </select>
                                        <p className="text-[10px] text-gray-400 mt-2">Triggered asynchronously after data commit.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* MIDDLE COLUMN: Dimensions List (Model Fields) */}
                <div className="flex-1 bg-white flex flex-col min-w-[500px] border-r border-gray-200">
                     {/* Column Header */}
                     <div className="h-16 px-6 border-b border-gray-200 flex justify-between items-center shrink-0 bg-white">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Fact Table</h2>
                             <div className="flex items-center gap-3 text-xs font-medium text-gray-400 mt-1">
                                <span>Dimensions ({dimCount})</span>
                                <span className="w-px h-3 bg-gray-300"></span>
                                <span>Measures ({measureCount})</span>
                             </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search field code or name" 
                                    className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 w-52 transition-all hover:bg-white focus:bg-white"
                                />
                            </div>
                            <button className="flex items-center gap-1.5 text-xs bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md transition-all shadow-sm font-medium">
                                <Plus className="w-3.5 h-3.5" /> Add Field
                            </button>
                        </div>
                    </div>

                    {/* Table Header */}
                    <div className="px-6 py-2.5 bg-gray-50/50 border-b border-gray-100 flex items-center text-xs font-bold text-gray-400 uppercase tracking-wide">
                        <div className="w-[30%]">Field Code</div>
                        <div className="w-[35%]">Mapping & Name</div>
                        <div className="flex-1 text-right">Properties</div>
                    </div>

                    {/* List Items */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                        {dimensions.map(dim => {
                            const badges = getDimensionBadges(dim);
                            const isSelected = selectedDimId === dim.id;
                            
                            return (
                                <div 
                                    key={dim.id}
                                    onClick={() => setSelectedDimId(dim.id)}
                                    className={`group flex items-center px-6 py-3 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50
                                    ${isSelected ? 'bg-blue-50/40' : ''}`}
                                >
                                    {/* Column 1: Code & Icon */}
                                    <div className="w-[30%] flex items-center gap-3">
                                        <div className={`w-7 h-7 rounded border flex items-center justify-center shrink-0 transition-colors
                                            ${isSelected 
                                                ? 'bg-white border-blue-200 text-blue-600 shadow-sm' 
                                                : 'bg-gray-50 border-gray-200 text-gray-400 group-hover:border-gray-300'}`}>
                                            {dim.isMeasure ? <Hash className="w-3.5 h-3.5" /> : <FileType className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className={`font-mono text-sm ${isSelected ? 'font-bold text-blue-700' : 'text-gray-700 font-medium'}`}>
                                            {dim.code}
                                        </span>
                                    </div>

                                    {/* Column 2: Binding & Name */}
                                    <div className="w-[35%] flex items-center gap-3 pr-4">
                                        <div className="flex flex-col items-center justify-center w-5 text-gray-300">
                                            <Link className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : ''}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm text-gray-900 truncate font-medium">{dim.name}</div>
                                            <div className="text-[10px] text-gray-400 font-mono truncate mt-0.5">{dim.binding}</div>
                                        </div>
                                    </div>

                                    {/* Column 3: Badges */}
                                    <div className="flex-1 flex justify-end gap-2 flex-wrap">
                                        {!dim.isMeasure && (
                                            <span className="px-2 py-0.5 rounded text-[10px] border bg-gray-50 border-gray-200 text-gray-500 font-medium">
                                                {dim.type}
                                            </span>
                                        )}
                                        {badges.map((badge, i) => (
                                             <span key={i} className={`px-2 py-0.5 rounded text-[10px] border font-medium ${badge.color}`}>
                                                {badge.label}
                                             </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* Empty state filler if needed */}
                        <div className="p-8 text-center text-gray-400 opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-xs">End of list</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Field Properties */}
                <div className="w-[380px] bg-white flex flex-col z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)] border-l border-gray-200">
                    {selectedDim ? (
                        <>
                             <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-2">
                                    <Settings2 className="w-4 h-4 text-gray-500" />
                                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Field Configuration</h2>
                                </div>
                                <button className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors" title="Delete Field">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                {/* Header Info */}
                                <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${selectedDim.isMeasure ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {selectedDim.isMeasure ? <Database className="w-6 h-6" /> : <Folder className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{selectedDim.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{selectedDim.code}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="space-y-4">
                                     <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Display Name</label>
                                        <input type="text" value={selectedDim.name} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Semantic Type</label>
                                        <select className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500">
                                            <option>{selectedDim.type}</option>
                                            <option>Generic</option>
                                            <option>Time</option>
                                            <option>Organization</option>
                                            <option>Metric</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
                                            <Link className="w-4 h-4 text-blue-500" /> Data Binding
                                        </div>
                                        <div className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Required</div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Fact Table Column</label>
                                        <div className="relative">
                                            <Table2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                            <input 
                                                type="text" 
                                                value={selectedDim.binding} 
                                                className="w-full bg-white border border-gray-300 text-blue-900 text-sm font-mono font-medium rounded-lg p-2.5 pl-9 focus:ring-blue-500 focus:border-blue-500" 
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">
                                            Physical column name in <code>{modelConfig.factTable}</code>.
                                        </p>
                                    </div>

                                    <div className="pt-2 border-t border-gray-200">
                                         <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input type="checkbox" checked={selectedDim.isMeasure || false} className="peer sr-only" />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                            </div>
                                            <div className="flex-1">
                                                <span className="block text-sm font-medium text-gray-900">Treat as Measure</span>
                                                <span className="block text-xs text-gray-500">Enable numeric aggregations (SUM, AVG)</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <Settings2 className="w-12 h-12 opacity-10 mb-3" />
                            <p className="text-sm font-medium">Select a field to configure</p>
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
