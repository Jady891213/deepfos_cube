
import React, { useState } from 'react';
import { Dimension, ModelConfig } from '../types';
import { 
  Plus, Search, Database, Link, Trash2, GripVertical, 
  Settings2, LayoutGrid, Network, Box, FileType, Hash, 
  ArrowRight, MoreVertical, Sliders, Info, Calendar, Zap,
  AlertCircle, Eye, Calculator
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

  // 扩展的高级设置状态（对应原 AdvancedSettings.tsx 逻辑）
  const [advSettings, setAdvSettings] = useState({
      autoAgg: true,
      timeGrain: 'Month',
      bsLogic: 'Closing Balance',
      plLogic: 'Periodic',
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
      {/* 顶部标题栏 */}
      <div className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-blue-600" />
            <h1 className="font-bold text-gray-800 text-lg">模型定义</h1>
        </div>
        
        <div className="bg-gray-100 p-1 rounded-lg border border-gray-200 flex">
            <button 
                onClick={() => setViewMode('define')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'define' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <LayoutGrid className="w-3.5 h-3.5" /> 结构定义
            </button>
            <button 
                onClick={() => setViewMode('visualize')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'visualize' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Network className="w-3.5 h-3.5" /> 关系图
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'visualize' ? (
             <ModelDiagram dimensions={dimensions} modelConfig={modelConfig} />
        ) : (
            <div className="flex h-full">
                
                {/* 左侧栏：整合了高级选项的设置区 */}
                <div className="w-[300px] bg-white border-r border-gray-200 flex flex-col z-10 shadow-[2px_0_8px_rgba(0,0,0,0.03)]">
                    <div className="flex border-b border-gray-200 bg-gray-50/50">
                        <button 
                            onClick={() => setActiveSettingsTab('basic')}
                            className={`flex-1 py-3 text-xs font-bold text-center transition-colors border-b-2
                            ${activeSettingsTab === 'basic' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            基础信息
                        </button>
                        <button 
                            onClick={() => setActiveSettingsTab('advanced')}
                             className={`flex-1 py-3 text-xs font-bold text-center transition-colors border-b-2
                            ${activeSettingsTab === 'advanced' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            高级选项
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                        {activeSettingsTab === 'basic' ? (
                            <div className="space-y-6 animate-in slide-in-from-left-2 duration-200">
                                <section className="space-y-4">
                                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2">标识与存储</h3>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">模型编码</label>
                                        <input type="text" value={modelConfig.code} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-md p-2 font-mono" readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">模型名称</label>
                                        <input type="text" value={modelConfig.name} className="w-full border border-gray-200 text-sm rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">物理事实表</label>
                                        <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-md text-blue-800 font-mono text-xs">
                                            <Database className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">{modelConfig.factTable}</span>
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">业务描述</label>
                                    <textarea className="w-full border border-gray-200 text-xs rounded-md p-2 h-24 resize-none focus:ring-1 focus:ring-blue-500 outline-none" value={modelConfig.description} />
                                </section>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in slide-in-from-right-2 duration-200 pb-10">
                                {/* 聚合策略 */}
                                <section className="space-y-4">
                                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                                        <Calculator className="w-3 h-3" /> 聚合与时间逻辑
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-semibold text-gray-700">自动聚合</label>
                                        <input type="checkbox" checked={advSettings.autoAgg} className="w-4 h-4 accent-purple-600" readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">最低时间粒度</label>
                                        <select className="w-full border border-gray-200 text-xs rounded-md p-2 bg-white outline-none focus:border-purple-500">
                                            <option>{advSettings.timeGrain}</option>
                                            <option>Day</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1">资产负债逻辑</label>
                                            <select className="w-full border border-gray-200 text-[10px] rounded p-1.5 bg-gray-50">
                                                <option>{advSettings.bsLogic}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1">损益表逻辑</label>
                                            <select className="w-full border border-gray-200 text-[10px] rounded p-1.5 bg-gray-50">
                                                <option>{advSettings.plLogic}</option>
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                {/* 显示控制 */}
                                <section className="space-y-4">
                                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                                        <Eye className="w-3 h-3" /> 视觉配置
                                    </h3>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">空值显示符号</label>
                                        <input type="text" value={advSettings.nullDisplay} className="w-full border border-gray-200 text-xs rounded-md p-2 text-center font-bold" />
                                    </div>
                                </section>

                                {/* 事件触发 */}
                                <section className="space-y-4">
                                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                                        <Zap className="w-3 h-3 text-orange-500" /> 事件钩子 (Hooks)
                                    </h3>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">数据写入后触发</label>
                                        <select className="w-full border border-gray-200 text-xs rounded-md p-2 bg-white outline-none">
                                            <option>{advSettings.postWriteAction}</option>
                                            <option>发送 Webhook</option>
                                            <option>无动作</option>
                                        </select>
                                    </div>
                                </section>

                                <div className="p-3 bg-amber-50 border border-amber-100 rounded-md text-[10px] text-amber-700 flex gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>更改聚合策略可能需要重新加载全量数据，请谨慎操作。</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 中间列：事实表字段列表（保持高密度图片样式） */}
                <div className="flex-1 bg-white flex flex-col min-w-[600px] border-r border-gray-200">
                    <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-800">事实表</span>
                            <span className="text-xs text-gray-400">维度({dimCount}) & 度量({measureCount})</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-300" />
                                <input 
                                    type="text" 
                                    placeholder="搜索字段编码或名称" 
                                    className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs w-56 focus:bg-white transition-all outline-none focus:ring-1 focus:ring-blue-400"
                                />
                            </div>
                            <button className="flex items-center gap-1.5 text-xs bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded transition-all font-medium text-gray-700 shadow-sm">
                                <Plus className="w-3.5 h-3.5 text-blue-500" /> 添加字段
                            </button>
                        </div>
                    </div>

                    <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-50 flex text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <div className="w-[30%]">字段 (事实表列)</div>
                        <div className="w-[45%]">逻辑名称与映射</div>
                        <div className="flex-1 text-right">属性回显</div>
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
                                    ${isSelected ? 'bg-indigo-50/50 relative after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-indigo-500' : 'hover:bg-gray-50/80'}`}
                                >
                                    {/* 字段 ID & 图标 */}
                                    <div className="w-[30%] flex items-center gap-4">
                                        <div className={`w-7 h-7 rounded-md flex items-center justify-center border shrink-0
                                            ${isSelected ? 'bg-white border-indigo-200 text-indigo-600 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                                            {dim.isMeasure ? <Hash className="w-4 h-4" /> : <FileType className="w-4 h-4" />}
                                        </div>
                                        <span className={`font-mono text-sm ${isSelected ? 'font-bold text-indigo-900' : 'text-gray-600'}`}>
                                            {dim.code}
                                        </span>
                                    </div>

                                    {/* 映射关系 */}
                                    <div className="w-[45%] flex items-center gap-5">
                                        <div className="flex flex-col items-center justify-center text-gray-300">
                                            {dim.isMeasure ? <ArrowRight className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className={`text-sm truncate ${isSelected ? 'text-indigo-900 font-bold' : 'text-gray-800'}`}>
                                                {dim.name.split(' ')[0]}
                                            </div>
                                            {dim.name.split(' ')[1] && (
                                                <div className="text-[10px] text-gray-400 font-mono truncate mt-0.5">
                                                    {dim.name.split(' ')[1]}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 标签回显 */}
                                    <div className="flex-1 flex justify-end gap-2 flex-wrap items-center">
                                        <div className="hidden group-hover:flex items-center gap-2 mr-3 transition-all">
                                            <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                                            <Trash2 className="w-4 h-4 text-gray-300 hover:text-red-500" />
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

                {/* 右侧栏：具体字段详情 */}
                <div className="w-[360px] bg-white flex flex-col z-10 shadow-[-2px_0_8px_rgba(0,0,0,0.03)] border-l border-gray-100">
                    {selectedDim ? (
                        <>
                             <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center shrink-0">
                                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <Settings2 className="w-4 h-4 text-gray-500" /> 字段配置详情
                                </h2>
                                <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                <section className="space-y-4">
                                     <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">逻辑显示名称</label>
                                        <input type="text" value={selectedDim.name} className="w-full border border-gray-200 text-sm rounded-md p-2.5 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">语义类型</label>
                                        <select className="w-full border border-gray-200 text-sm rounded-md p-2.5 bg-white shadow-sm outline-none focus:border-indigo-500">
                                            <option>{selectedDim.type}</option>
                                            <option>Generic</option>
                                            <option>Metric</option>
                                            <option>Time</option>
                                        </select>
                                    </div>
                                </section>

                                <section className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-4">
                                    <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider mb-2">
                                        <Database className="w-3.5 h-3.5" /> 物理层绑定
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase">物理列名 (Facts)</label>
                                        <div className="px-3 py-2 bg-white border border-gray-200 rounded text-sm font-mono text-indigo-700 shadow-inner">
                                            {selectedDim.binding}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                            <input type="radio" checked={selectedDim.isMeasure} className="w-3.5 h-3.5 accent-indigo-600" readOnly /> 
                                            <span>度量 (Metric)</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                            <input type="radio" checked={!selectedDim.isMeasure} className="w-3.5 h-3.5 accent-indigo-600" readOnly /> 
                                            <span>维度 (Dimension)</span>
                                        </label>
                                    </div>
                                </section>
                                
                                <div className="pt-6">
                                     <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-bold shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0">
                                         更新字段映射
                                     </button>
                                </div>
                            </div>
                        </>
                    ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <Box className="w-16 h-16 opacity-5 mb-4" />
                            <p className="text-sm font-medium">请从左侧列表选择一个字段进行配置</p>
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
