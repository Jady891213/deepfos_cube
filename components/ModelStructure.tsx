
import React, { useState } from 'react';
import { Dimension, ModelConfig } from '../types';
import { 
  Plus, Search, Database, Link, Trash2, GripVertical, 
  Settings2, LayoutGrid, Network, Box, FileType, Hash, 
  ArrowRight, MoreVertical, Sliders, Info, Calendar, Zap
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

  // 高级设置状态
  const [advSettings, setAdvSettings] = useState({
      autoAgg: true,
      timeGrain: 'Month',
      nullDisplay: '-',
      postWriteAction: '执行脚本'
  });

  // 模拟维度的复杂属性标签
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
    
    if (attributes.length === 0 && !dim.isMeasure) {
        return [{ label: '不设置', color: 'text-gray-400 border-transparent' }];
    }
    return attributes;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      {/* 1. 顶部标题栏 */}
      <div className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-blue-600" />
            <h1 className="font-bold text-gray-800 text-lg">模型定义</h1>
        </div>
        
        <div className="bg-gray-100 p-1 rounded-lg border border-gray-200 flex">
            <button 
                onClick={() => setViewMode('define')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'define' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <LayoutGrid className="w-3.5 h-3.5" /> 结构
            </button>
            <button 
                onClick={() => setViewMode('visualize')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'visualize' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Network className="w-3.5 h-3.5" /> 可视化
            </button>
        </div>
      </div>

      {/* 2. 主内容区 */}
      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'visualize' ? (
             <ModelDiagram dimensions={dimensions} modelConfig={modelConfig} />
        ) : (
            <div className="flex h-full">
                
                {/* 左侧栏：模型设置 */}
                <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col z-10 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.02)]">
                    <div className="flex border-b border-gray-200">
                        <button 
                            onClick={() => setActiveSettingsTab('basic')}
                            className={`flex-1 py-3 text-xs font-bold text-center transition-colors border-b-2
                            ${activeSettingsTab === 'basic' ? 'border-blue-600 text-blue-700 bg-blue-50/20' : 'border-transparent text-gray-400'}`}
                        >
                            基础设置
                        </button>
                        <button 
                            onClick={() => setActiveSettingsTab('advanced')}
                             className={`flex-1 py-3 text-xs font-bold text-center transition-colors border-b-2
                            ${activeSettingsTab === 'advanced' ? 'border-purple-600 text-purple-700 bg-purple-50/20' : 'border-transparent text-gray-400'}`}
                        >
                            高级选项
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {activeSettingsTab === 'basic' ? (
                            <div className="space-y-5 animate-in slide-in-from-left-2 duration-200">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">模型标识</label>
                                    <input type="text" value={modelConfig.code} className="w-full bg-gray-50 border border-gray-200 text-sm rounded p-2 font-mono" readOnly />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">模型名称</label>
                                    <input type="text" value={modelConfig.name} className="w-full border border-gray-200 text-sm rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">事实表绑定</label>
                                    <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded text-blue-800 font-mono text-xs">
                                        <Database className="w-3.5 h-3.5" />
                                        {modelConfig.factTable}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">模型描述</label>
                                    <textarea className="w-full border border-gray-200 text-xs rounded p-2 h-20 resize-none" value={modelConfig.description} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in slide-in-from-right-2 duration-200">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                            <Sliders className="w-3.5 h-3.5 text-purple-600" /> 自动聚合
                                        </label>
                                        <input type="checkbox" checked={advSettings.autoAgg} className="w-4 h-4 accent-purple-600" readOnly />
                                    </div>
                                    <p className="text-[10px] text-gray-400">开启后将自动处理跨时间维度的加总逻辑。</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-purple-600" /> 时间粒度
                                    </label>
                                    <select className="w-full border border-gray-200 text-xs rounded p-2 bg-white outline-none">
                                        <option>{advSettings.timeGrain}</option>
                                        <option>Day</option>
                                        <option>Quarter</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5 text-orange-500" /> 写入后 Hook
                                    </label>
                                    <select className="w-full border border-gray-200 text-xs rounded p-2 bg-white outline-none">
                                        <option>{advSettings.postWriteAction}</option>
                                        <option>发送 Webhook</option>
                                        <option>无动作</option>
                                    </select>
                                </div>
                                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded text-[10px] text-yellow-700 flex gap-2">
                                    <Info className="w-3.5 h-3.5 shrink-0" />
                                    <span>高级选项涉及底层计算引擎逻辑，非必要请勿随意修改。</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 中间列：模型字段列表 (保留高密度样式) */}
                <div className="flex-1 bg-white flex flex-col min-w-[600px] border-r border-gray-200">
                    <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-800">事实表字段</span>
                            <span className="text-xs text-gray-400">维度({dimCount}) & 度量({measureCount})</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-300" />
                                <input 
                                    type="text" 
                                    placeholder="搜索字段编码或名称" 
                                    className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs w-48 focus:bg-white transition-all outline-none focus:ring-1 focus:ring-blue-400"
                                />
                            </div>
                            <button className="flex items-center gap-1.5 text-xs bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded transition-all font-medium">
                                <Plus className="w-3.5 h-3.5" /> 添加字段
                            </button>
                        </div>
                    </div>

                    <div className="px-6 py-3 bg-gray-50/30 border-b border-gray-50 flex text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <div className="w-[30%]">物理字段</div>
                        <div className="w-[45%]">逻辑映射</div>
                        <div className="flex-1 text-right">属性标签</div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {dimensions.map((dim) => {
                            const isSelected = selectedDimId === dim.id;
                            const attributes = getDimensionAttributes(dim);
                            
                            return (
                                <div 
                                    key={dim.id}
                                    onClick={() => setSelectedDimId(dim.id)}
                                    className={`group flex items-center px-6 py-4 border-b border-gray-50 cursor-pointer transition-all
                                    ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-gray-50/80'}`}
                                >
                                    <div className="w-[30%] flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded flex items-center justify-center border shrink-0
                                            ${isSelected ? 'bg-white border-indigo-200 text-indigo-600 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                                            {dim.isMeasure ? <Hash className="w-3.5 h-3.5" /> : <FileType className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className={`font-mono text-sm ${isSelected ? 'font-bold text-indigo-900' : 'text-gray-600'}`}>
                                            {dim.code}
                                        </span>
                                    </div>

                                    <div className="w-[45%] flex items-center gap-4">
                                        <div className="flex flex-col items-center justify-center text-gray-300">
                                            {dim.isMeasure ? <ArrowRight className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className={`text-sm truncate ${isSelected ? 'text-indigo-900 font-medium' : 'text-gray-800'}`}>
                                                {dim.name.split(' ')[0]}
                                            </div>
                                            {dim.name.split(' ')[1] && (
                                                <div className="text-[10px] text-gray-400 font-mono truncate">
                                                    {dim.name.split(' ')[1]}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 flex justify-end gap-2 flex-wrap items-center">
                                        <div className="hidden group-hover:flex items-center gap-2 mr-2 transition-all">
                                            <GripVertical className="w-3.5 h-3.5 text-gray-300 cursor-grab" />
                                            <Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-500" />
                                        </div>
                                        {attributes.map((attr, idx) => (
                                            <span 
                                                key={idx} 
                                                className={`px-2 py-0.5 rounded-sm text-[10px] border whitespace-nowrap font-medium ${attr.color}`}
                                            >
                                                {attr.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 右侧栏：字段详细配置 */}
                <div className="w-[360px] bg-white flex flex-col z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)] border-l border-gray-100">
                    {selectedDim ? (
                        <>
                             <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <Settings2 className="w-4 h-4 text-gray-500" /> 字段配置
                                </h2>
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                <div className="space-y-4">
                                     <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">字段显示名称</label>
                                        <input type="text" value={selectedDim.name} className="w-full border border-gray-200 text-sm rounded p-2 focus:ring-1 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">物理列名</label>
                                        <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-indigo-700">
                                            <Database className="w-3.5 h-3.5" />
                                            {selectedDim.binding}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">是否为度量</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2 text-xs text-gray-700">
                                                <input type="radio" checked={selectedDim.isMeasure} readOnly /> 是
                                            </label>
                                            <label className="flex items-center gap-2 text-xs text-gray-700">
                                                <input type="radio" checked={!selectedDim.isMeasure} readOnly /> 否
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t border-gray-100">
                                     <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-bold shadow-sm transition-all">
                                         保存字段配置
                                     </button>
                                </div>
                            </div>
                        </>
                    ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <Settings2 className="w-12 h-12 opacity-10 mb-3" />
                            <p className="text-sm font-medium">请从列表选择一个字段</p>
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
