
import React, { useState } from 'react';
import { Strategy } from '../types';
import { Plus, Edit3, Trash, Link2, ShieldAlert, ArrowRight } from 'lucide-react';

const DimensionStrategy: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([
    { id: '1', code: 'strategy1', name: 'Standard Account Rules', type: 'DimensionUD', relatedDimension: 'account', linkedUD: 'ud1', targetField: 'account' },
    { id: '2', code: 'check_period', name: 'Monthly Lock Control', type: 'DataControl', relatedDimension: 'period', linkedUD: '', targetField: 'period' },
    { id: '3', code: 'entity_val', name: 'Entity Validation', type: 'DimensionUD', relatedDimension: 'entity', linkedUD: 'ud2', targetField: 'entity' },
  ]);

  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('1');
  const selected = strategies.find(s => s.id === selectedStrategyId);

  return (
    <div className="flex flex-col h-full bg-gray-50">
         <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-sm shrink-0">
             <div>
                <h2 className="text-xl font-bold text-gray-800">Dimension Strategies</h2>
                <p className="text-xs text-gray-500 mt-1">Configure validity rules and data controls for write-back operations.</p>
             </div>
             <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-all">
                 <Plus className="w-4 h-4" /> Create Strategy
             </button>
         </div>

         <div className="flex flex-1 overflow-hidden">
             {/* Left List - Fixed Width */}
             <div className="w-[380px] shrink-0 border-r border-gray-200 bg-white flex flex-col z-0">
                <div className="flex bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide sticky top-0">
                    <div className="flex-1 px-4 py-3">Strategy Identifier</div>
                    <div className="w-20 px-4 py-3 text-center">Action</div>
                </div>
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    {strategies.map(s => (
                        <div 
                            key={s.id}
                            onClick={() => setSelectedStrategyId(s.id)}
                            className={`group flex flex-col border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors
                            ${selectedStrategyId === s.id ? 'bg-blue-50/60' : ''}`}
                        >
                             <div className="flex justify-between items-start px-4 pt-3 pb-2">
                                <div>
                                    <div className={`text-sm font-bold font-mono ${selectedStrategyId === s.id ? 'text-blue-700' : 'text-gray-800'}`}>
                                        {s.code}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">{s.name}</div>
                                </div>
                                <button className="p-1.5 text-gray-300 hover:text-red-500 rounded hover:bg-white transition-colors">
                                     <Trash className="w-4 h-4" />
                                </button>
                             </div>
                             <div className="px-4 pb-3 flex items-center gap-2">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${s.type === 'DimensionUD' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                                    {s.type}
                                </span>
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <ArrowRight className="w-3 h-3" /> {s.relatedDimension}
                                </span>
                             </div>
                        </div>
                    ))}
                </div>
             </div>

             {/* Right Config - Fluid */}
             <div className="flex-1 bg-gray-50/50 p-6 overflow-y-auto">
                {selected ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
                         <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selected.name}</h3>
                                <p className="text-xs text-gray-400 mt-1 font-mono">{selected.code}</p>
                            </div>
                            <button className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors">
                                <Edit3 className="w-5 h-5"/>
                            </button>
                        </div>
                        
                        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                                
                                <div className="space-y-6">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Basic Info</h4>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Strategy Code <span className="text-red-500">*</span></label>
                                        <input type="text" value={selected.code} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Strategy Name <span className="text-red-500">*</span></label>
                                        <input type="text" value={selected.name} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                </div>

                                <div className="space-y-6 lg:col-span-1 2xl:col-span-2">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Type Definition</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Strategy Logic Type</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selected.type === 'DimensionUD' ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                                                <div className="mt-0.5">
                                                     <input type="radio" checked={selected.type === 'DimensionUD'} name="stype" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-bold text-gray-900">Dimension Attribute (UD)</span>
                                                    <span className="text-xs text-gray-500 mt-1">Validate based on User Defined attributes linked to the dimension.</span>
                                                </div>
                                            </label>
                                            <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selected.type === 'DataControl' ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                                                <div className="mt-0.5">
                                                    <input type="radio" checked={selected.type === 'DataControl'} name="stype" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-bold text-gray-900">Data Permission Control</span>
                                                    <span className="text-xs text-gray-500 mt-1">Restrict write-access based on dimension values or status.</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 lg:col-span-2 2xl:col-span-3">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Target Configuration</h4>
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Link2 className="w-4 h-4 text-gray-500" /> 
                                            <span className="text-sm font-bold text-gray-900">Linkage Settings</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="col-span-1">
                                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Dependent Dimension</label>
                                                <div className="relative">
                                                    <ShieldAlert className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                    <select className="pl-10 w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500">
                                                        <option>{selected.relatedDimension}</option>
                                                        <option>entity</option>
                                                        <option>scenario</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-span-1">
                                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Associated UD Field</label>
                                                <div className="relative">
                                                    <Link2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                    <select className="pl-10 w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500">
                                                        <option>{selected.linkedUD}</option>
                                                        <option>ud2</option>
                                                        <option>ud3</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-span-1">
                                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Target Write-back Field</label>
                                                <select className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500">
                                                    <option>{selected.targetField}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-400 text-center mt-20">Select a strategy to edit</div>
                )}
             </div>
         </div>
    </div>
  );
};

export default DimensionStrategy;
