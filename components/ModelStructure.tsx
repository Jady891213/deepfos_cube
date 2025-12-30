
import React, { useState } from 'react';
import { Dimension, ModelConfig } from '../types';
import { 
  Plus, Search, Database, Link, Trash2, GripVertical, 
  Settings2, LayoutGrid, Network, Box, FileType, Hash, 
  ArrowRight, MoreVertical, Sliders, Info, Calendar, Zap,
  AlertCircle, Eye, Calculator, ChevronRight
} from 'lucide-react';
import ModelDiagram from './ModelDiagram';

const ModelStructure: React.FC = () => {
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    code: 'main_cube',
    name: 'Sales Forecast 2024',
    factTable: 'fact_sales_monthly_v1',
    description: '核心财务规划模型，用于月度收入和支出预测。'
  });

  const [dimensions, setDimensions] = useState<Dimension[]>([
    { id: '1', code: 'scenario', name: '场景 Scenario', type: 'Scenario', binding: 'dim_scenario' },
    { id: '2', code: 'version', name: '版本 Version', type: 'Version', binding: 'dim_version' },
    { id: '3', code: 'entity', name: '实体 Entity', type: 'Entity', binding: 'dim_entity' },
    { id: '4', code: 'year', name: '年份 Year', type: 'Year', binding: 'dim_year' },
    { id: '5', code: 'period', name: '期间 Period', type: 'Period', binding: 'dim_period' },
    { id: '6', code: 'account', name: '科目 Account', type: 'Account', binding: 'dim_account' },
    { id: '7', code: 'd1', name: 'd1', type: 'Generic', binding: 'd1' },
    { id: '8', code: 'decimal_val', name: '度量', type: 'Generic', isMeasure: true, binding: 'val_decimal' },
    { id: '9', code: 'string_val', name: '度量', type: 'Generic', isMeasure: true, binding: 'val_string' },
  ]);

  const [selectedDimId, setSelectedDimId] = useState<string | null>('1'); 
  const [viewMode, setViewMode] = useState<'define' | 'visualize'>('define');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'basic' | 'advanced'>('basic');

  const selectedDim = dimensions.find(d => d.id === selectedDimId);
  const dimCount = dimensions.filter(d => !d.isMeasure).length;
  const measureCount = dimensions.filter(d => d.isMeasure).length;

  const [advSettings, setAdvSettings] = useState({
      autoAgg: true,
      timeGrain: 'Month',
      bsLogic: 'Closing Balance',
      plLogic: 'Periodic',
      nullDisplay: '-',
      postWriteAction: '执行脚本'
  });

  const getDimensionAttributes = (dim: Dimension) => {
    if (dim.isMeasure) return [{ label: '预置度量', color: 'bg-gray-100 text-gray-400 border-transparent' }];
    const attributes = [];
    if (dim.type === 'Scenario') attributes.push({ label: '场景类', color: 'bg-purple-50 text-purple-600 border-purple-100' });
    if (dim.type === 'Version') attributes.push({ label: '版本类', color: 'bg-purple-50 text-purple-600 border-purple-100' });
    if (dim.type === 'Entity') {
        attributes.push({ label: '多版本', color: 'bg-blue-50 text-blue-500 border-blue-100' });
        attributes.push({ label: '实体类', color: 'bg-purple-50 text-purple-600 border-purple-100' });
    }
    if (dim.type === 'Year') attributes.push({ label: '年份类', color: 'bg-purple-50 text-purple-600 border-purple-100' });
    if (dim.type === 'Account') attributes.push({ label: '科目类', color: 'bg-purple-50 text-purple-600 border-purple-100' });
    if (dim.code === 'd1') attributes.push({ label: '通用类', color: 'bg-green-50 text-green-600 border-green-100' });
    return attributes.length ? attributes : [{ label: '未定义', color: 'text-gray-300 border-transparent' }];
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 animate-in">
      <div className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-blue-600" />
            <h1 className="font-bold text-gray-800 text-lg tracking-tight">模型架构定义</h1>
        </div>
        
        <div className="bg-gray-100 p-1 rounded-lg border border-gray-200 flex">
            <button onClick={() => setViewMode('define')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'define' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500'}`}>
                <LayoutGrid className="w-3.5 h-3.5" /> 结构
            </button>
            <button onClick={() => setViewMode('visualize')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'visualize' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500'}`}>
                <Network className="w-3.5 h-3.5" /> 关系图
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'visualize' ? (
             <ModelDiagram dimensions={dimensions} modelConfig={modelConfig} />
        ) : (
            <div className="flex h-full">
                {/* 左侧：双标签页设置栏 */}
                <div className="w-[300px] bg-white border-r border-gray-200 flex flex-col z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
                    <div className="flex border-b border-gray-200 bg-gray-50/50 p-1">
                        <button onClick={() => setActiveSettingsTab('basic')} className={`flex-1 py-2 text-[11px] font-bold rounded transition-all ${activeSettingsTab === 'basic' ? 'bg-white shadow-sm text-blue-600 ring-1 ring-black/5' : 'text-gray-400'}`}>基础配置</button>
                        <button onClick={() => setActiveSettingsTab('advanced')} className={`flex-1 py-2 text-[11px] font-bold rounded transition-all ${activeSettingsTab === 'advanced' ? 'bg-white shadow-sm text-purple-600 ring-1 ring-black/5' : 'text-gray-400'}`}>高级选项</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                        {activeSettingsTab === 'basic' ? (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Model Code</label>
                                    <input type="text" value={modelConfig.code} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-md p-2 font-mono" readOnly />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">事实表 (ClickHouse)</label>
                                    <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-md text-blue-800 font-mono text-xs">
                                        <Database className="w-3.5 h-3.5 shrink-0" /> {modelConfig.factTable}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">模型描述</label>
                                    <textarea className="w-full border border-gray-200 text-xs rounded-md p-2 h-24 resize-none" value={modelConfig.description} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><Calculator className="w-3 h-3"/> 计算策略</h3>
                                    <div className="space-y-4 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-semibold text-gray-700">自动聚合</label>
                                            <input type="checkbox" checked={advSettings.autoAgg} className="w-4 h-4 accent-purple-600" readOnly />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">时间粒度</label>
                                            <select className="w-full border border-gray-200 text-xs rounded p-1.5 bg-white"><option>{advSettings.timeGrain}</option></select>
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><Zap className="w-3 h-3"/> 生命周期 Hook</h3>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] text-gray-500">写入后动作</label>
                                        <select className="w-full border border-gray-200 text-xs rounded p-1.5 bg-white"><option>{advSettings.postWriteAction}</option></select>
                                    </div>
                                </section>
                                <div className="p-3 bg-amber-50 rounded-md border border-amber-100 text-[10px] text-amber-700 flex gap-2">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>高级设置直接影响 ClickHouse 聚合引擎性能，请咨询架构师后调整。</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 中间：高密度字段列表 */}
                <div className="flex-1 bg-white flex flex-col min-w-[600px] border-r border-gray-200">
                    <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-800">模型字段</span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full">D:{dimCount} | M:{measureCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 w-3.5 h-3.5 text-gray-300" />
                                <input type="text" placeholder="Search..." className="pl-7 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs w-40 outline-none focus:ring-1 focus:ring-blue-400 transition-all"/>
                            </div>
                            <button className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm"><Plus className="w-4 h-4"/></button>
                        </div>
                    </div>

                    <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-100 flex text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <div className="w-[30%]">Physical Column</div>
                        <div className="w-[45%]">Logical Mapping</div>
                        <div className="flex-1 text-right">Attributes</div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {dimensions.map((dim) => {
                            const isSelected = selectedDimId === dim.id;
                            const attrs = getDimensionAttributes(dim);
                            return (
                                <div key={dim.id} onClick={() => setSelectedDimId(dim.id)} className={`group flex items-center px-6 py-3.5 border-b border-gray-50 cursor-pointer transition-all ${isSelected ? 'bg-blue-50/50 border-l-2 border-l-blue-500' : 'hover:bg-gray-50/80'}`}>
                                    <div className="w-[30%] flex items-center gap-3">
                                        <div className={`w-7 h-7 rounded flex items-center justify-center border shrink-0 ${isSelected ? 'bg-white border-blue-200 text-blue-600 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                                            {dim.isMeasure ? <Hash className="w-3.5 h-3.5" /> : <FileType className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className={`font-mono text-sm tracking-tight ${isSelected ? 'font-bold text-blue-900' : 'text-gray-600'}`}>{dim.code}</span>
                                    </div>
                                    <div className="w-[45%] flex items-center gap-4">
                                        <ArrowRight className={`w-3.5 h-3.5 transition-colors ${isSelected ? 'text-blue-400' : 'text-gray-200'}`} />
                                        <div className="min-w-0">
                                            <div className={`text-sm truncate ${isSelected ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{dim.name.split(' ')[0]}</div>
                                            <div className="text-[10px] text-gray-400 font-mono truncate">{dim.name.split(' ')[1] || 'Default'}</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex justify-end gap-1.5 flex-wrap">
                                        {attrs.map((at, i) => (
                                            <span key={i} className={`px-1.5 py-0.5 rounded-sm text-[9px] border font-medium ${at.color}`}>{at.label}</span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 右侧：字段详情配置 */}
                <div className="w-[340px] bg-white flex flex-col z-10 border-l border-gray-100 shadow-[-2px_0_10px_rgba(0,0,0,0.02)]">
                    {selectedDim ? (
                        <>
                            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                                <h2 className="text-xs font-bold text-gray-800 flex items-center gap-2"><Settings2 className="w-4 h-4 text-gray-500" /> 字段详细设置</h2>
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <section className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">显示名称</label>
                                        <input type="text" value={selectedDim.name} className="w-full border border-gray-200 text-sm rounded-md p-2 focus:ring-2 focus:ring-blue-100 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">语义类型</label>
                                        <select className="w-full border border-gray-200 text-sm rounded-md p-2 bg-white"><option>{selectedDim.type}</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">物理列绑定</label>
                                        <div className="p-2 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-blue-700 flex items-center gap-2"><Database className="w-3 h-3"/> {selectedDim.binding}</div>
                                    </div>
                                </section>
                                <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-bold shadow-md transition-all active:scale-[0.98]">同步到物理层</button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-2">
                            <Box className="w-12 h-12 opacity-10" />
                            <span className="text-xs">选择字段以配置详细参数</span>
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
