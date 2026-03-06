import React, { useState, useMemo } from 'react';
import { 
  Play, Search, Table, Code2, Clock, 
  ChevronDown, Database, Download, Filter, 
  Activity, ArrowRight, X, 
  ListFilter, ExternalLink, Paperclip, 
  MessageSquare, SlidersHorizontal, Info,
  Layers, Hash, FileType, LayoutDashboard,
  GripVertical, User
} from 'lucide-react';

type SearchMode = 'model' | 'base';
type QueryResultTab = 'dynamic' | 'code' | 'table' | 'sql';
type DimLocation = 'background' | 'row' | 'col';

interface Dimension {
  id: string;
  name: string;
}

const DataQuery: React.FC = () => {
  const [searchMode, setSearchMode] = useState<SearchMode>('model');
  const [queryTab, setQueryTab] = useState<QueryResultTab>('dynamic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [permissionEnabled, setPermissionEnabled] = useState(false);
  const [showLayoutModal, setShowLayoutModal] = useState(false);

  const [dimensions] = useState<Dimension[]>([
    { id: 'scenario', name: '场景' },
    { id: 'version', name: '版本' },
    { id: 'year', name: '年份' },
    { id: 'entity', name: '实体' },
    { id: 'period', name: '期间' },
    { id: 'account', name: '科目' },
    { id: 'd1', name: 'd1' },
    { id: 'd2', name: 'd2' },
  ]);

  const [dimLocations, setDimLocations] = useState<Record<string, DimLocation>>({
    scenario: 'background',
    version: 'background',
    year: 'background',
    entity: 'background',
    period: 'row',
    account: 'row',
    d1: 'col',
    d2: 'col',
  });

  const [dimValues, setDimValues] = useState<Record<string, string>>({
    scenario: 'Actual',
    version: 'working',
    year: '2025',
    entity: 'entityA',
    period: '',
    account: '',
    d1: '',
    d2: ''
  });

  const backgroundDims = dimensions.filter(d => dimLocations[d.id] === 'background');
  const rowDims = dimensions.filter(d => dimLocations[d.id] === 'row');
  const colDims = dimensions.filter(d => dimLocations[d.id] === 'col');
  const paramDims = dimensions.filter(d => dimLocations[d.id] !== 'background'); // For base query

  const handleRun = () => {
    setIsProcessing(true);
    setHasData(false);
    setSelectedRow(null);
    setTimeout(() => {
      setHasData(true);
      setIsProcessing(false);
      if (searchMode === 'model') {
        setQueryTab('dynamic');
      } else {
        setQueryTab('table');
      }
    }, 800);
  };

  const generatedSql = useMemo(() => {
    return `SELECT 
  period,
  account,
  d1,
  d2,
  decimal_value,
  string_value
FROM fact_financial_transactions
WHERE scenario = '${dimValues.scenario}'
  AND version = '${dimValues.version}'
  AND year = '${dimValues.year}'
  AND entity = '${dimValues.entity}'
LIMIT 100000;`;
  }, [dimValues]);

  const mockBaseTableData = [
    { id: 1, period: '1 - 1月', account: 'acc1 - 科目1', d1: 'None - 不分明细', d2: 'None - 不分明细', decimal_value: '123', string_value: 'null', attachments: 1, comments: 1 },
    { id: 2, period: '2 - 2月', account: 'acc1 - 科目1', d1: 'None - 不分明细', d2: 'None - 不分明细', decimal_value: '123', string_value: 'null', attachments: 0, comments: 0 },
    { id: 3, period: '12 - 12月', account: 'acc1 - 科目1', d1: 'None - 不分明细', d2: 'None - 不分明细', decimal_value: '367.89', string_value: 'null', attachments: 2, comments: 1 },
    { id: 4, period: '11 - 11月', account: 'acc1 - 科目1', d1: 'None - 不分明细', d2: 'None - 不分明细', decimal_value: '123', string_value: 'null', attachments: 0, comments: 0 },
  ];

  return (
    <div className="flex h-full bg-white relative overflow-hidden">
      
      {/* LEFT SIDEBAR: Query Config */}
      <div className="w-[260px] bg-white border-r border-gray-200 flex flex-col shrink-0 z-20 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.02)]">
        {/* Header */}
        <div className="h-14 px-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-bold text-gray-800">查询</h2>
          <button className="text-gray-400 hover:text-gray-600"><ArrowRight className="w-4 h-4 rotate-180"/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
          {/* Mode Switcher */}
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 w-full">
            <button 
              onClick={() => { setSearchMode('model'); setHasData(false); setQueryTab('dynamic'); }}
              className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${searchMode === 'model' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              模型查询
            </button>
            <button 
              onClick={() => { setSearchMode('base'); setHasData(false); setQueryTab('table'); }}
              className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${searchMode === 'base' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              底表查询
            </button>
          </div>

          {/* 背景 (Background) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-600">
              <span>背景 ({backgroundDims.length})</span>
              <button 
                onClick={() => setShowLayoutModal(true)}
                className="p-1 hover:bg-gray-100 rounded border border-transparent hover:border-gray-200 transition-colors text-gray-400 hover:text-blue-600"
                title="切换背景与行列"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
              </button>
            </div>
            {backgroundDims.map(dim => (
              <div key={dim.id} className="flex items-center gap-2">
                <label className="w-10 text-xs text-gray-500 shrink-0">{dim.name}</label>
                <div className="flex-1 relative">
                  <select 
                    defaultValue={dimValues[dim.id]}
                    onChange={(e) => setDimValues({...dimValues, [dim.id]: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-md p-1.5 appearance-none bg-white focus:border-blue-500 outline-none text-gray-700"
                  >
                    <option value={dimValues[dim.id]}>{dimValues[dim.id]}</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          {/* 行列 (Row/Col) */}
          {searchMode === 'model' ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                  <span>行 ({rowDims.length})</span>
                </div>
                {rowDims.map(dim => (
                  <div key={dim.id} className="flex items-center gap-2">
                    <label className="w-10 text-xs text-gray-500 shrink-0">{dim.name}</label>
                    <div className="flex-1 relative">
                      <select className="w-full text-xs border border-gray-200 rounded-md p-1.5 appearance-none bg-white focus:border-blue-500 outline-none text-gray-400">
                        <option>请选择</option>
                      </select>
                      <Filter className="absolute right-2 top-2 w-3 h-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                  <span>列 ({colDims.length})</span>
                </div>
                {colDims.map(dim => (
                  <div key={dim.id} className="flex items-center gap-2">
                    <label className="w-10 text-xs text-gray-500 shrink-0">{dim.name}</label>
                    <div className="flex-1 relative">
                      <select className="w-full text-xs border border-gray-200 rounded-md p-1.5 appearance-none bg-white focus:border-blue-500 outline-none text-gray-400">
                        <option>请选择</option>
                      </select>
                      <Filter className="absolute right-2 top-2 w-3 h-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                <span>行列 ({paramDims.length})</span>
              </div>
              {paramDims.map(dim => (
                <div key={dim.id} className="flex items-center gap-2">
                  <label className="w-10 text-xs text-gray-500 shrink-0">{dim.name}</label>
                  <div className="flex-1 relative">
                    <select className="w-full text-xs border border-gray-200 rounded-md p-1.5 appearance-none bg-white focus:border-blue-500 outline-none text-gray-400">
                      <option>请选择</option>
                    </select>
                    <Filter className="absolute right-2 top-2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-3 py-2 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${showAdvanced ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> 高级
            </button>
            <button onClick={handleRun} disabled={isProcessing} className="flex-1 py-2 bg-blue-600 text-white rounded-md text-xs font-medium flex items-center justify-center gap-1 hover:bg-blue-700 transition-colors disabled:opacity-70">
              {isProcessing ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />} 查询
            </button>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-3 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
              {searchMode === 'model' && (
                <>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs text-gray-600 group-hover:text-gray-900">隐藏无数据行</span>
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs text-gray-600 group-hover:text-gray-900">隐藏零数据行</span>
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs text-gray-600 group-hover:text-gray-900 flex items-center gap-1">隐藏无效维度组合行 <Info className="w-3 h-3 text-gray-400"/></span>
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                  </label>
                </>
              )}
              
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs text-gray-600 group-hover:text-gray-900">隐藏pov列</span>
                <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
              </label>
              
              <div className="h-px bg-gray-100 my-2"></div>
              
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs text-gray-600 group-hover:text-gray-900">显示维度描述</span>
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
              </label>
              
              {searchMode === 'model' && (
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-xs text-gray-600 group-hover:text-gray-900">含父级聚合数</span>
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                </label>
              )}
              
              <div className="h-px bg-gray-100 my-2"></div>
              
              <div className="space-y-1.5">
                <span className="text-xs text-gray-600">行数阈值</span>
                <div className="relative">
                  <select className="w-full text-xs border border-gray-200 rounded-md p-1.5 appearance-none bg-white focus:border-blue-500 outline-none text-gray-700">
                    <option>100,000</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">查询含权限</span>
                  <div className="flex rounded border border-gray-200 overflow-hidden">
                    <button 
                      onClick={() => setPermissionEnabled(false)}
                      className={`px-3 py-1 text-xs font-medium transition-colors ${!permissionEnabled ? 'bg-white text-gray-800' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >关闭</button>
                    <div className="w-px bg-gray-200"></div>
                    <button 
                      onClick={() => setPermissionEnabled(true)}
                      className={`px-3 py-1 text-xs font-medium transition-colors ${permissionEnabled ? 'bg-white text-blue-600 border border-blue-500 -m-px z-10 relative' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >启用</button>
                  </div>
                </div>
                {permissionEnabled && (
                  <div className="relative animate-in slide-in-from-top-1 duration-200">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <select className="w-full text-xs border border-gray-200 rounded-md py-1.5 pl-7 pr-6 appearance-none bg-white focus:border-blue-500 outline-none text-gray-700">
                      <option>当前用户</option>
                      <option>张三 (zhangsan)</option>
                      <option>李四 (lisi)</option>
                      <option>王五 (wangwu)</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT AREA: Results */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Top Bar */}
        <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-6 h-full">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              查询结果 <span className="text-gray-400 font-normal text-xs">({hasData ? (searchMode === 'model' ? '4' : mockBaseTableData.length) : '0'})</span>
            </h2>
            <div className="w-px h-4 bg-gray-200"></div>
            {searchMode === 'model' ? (
              <>
                <button onClick={() => setQueryTab('dynamic')} className={`text-sm font-medium h-full px-2 border-b-2 transition-colors ${queryTab === 'dynamic' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}>动态表</button>
                <button onClick={() => setQueryTab('code')} className={`text-sm font-medium h-full px-2 border-b-2 transition-colors ${queryTab === 'code' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}>示例代码</button>
              </>
            ) : (
              <>
                {hasData && <span className="text-sm font-bold text-gray-800 ml-2">查询结果({mockBaseTableData.length})</span>}
                <button onClick={() => setQueryTab('table')} className={`text-sm font-medium h-full px-2 border-b-2 transition-colors ${queryTab === 'table' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}>表格</button>
                <button onClick={() => setQueryTab('code')} className={`text-sm font-medium h-full px-2 border-b-2 transition-colors ${queryTab === 'code' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}>示例代码</button>
                <button onClick={() => setQueryTab('sql')} className={`text-sm font-medium h-full px-2 border-b-2 transition-colors ${queryTab === 'sql' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}>SQL</button>
              </>
            )}
          </div>
          
          {hasData && (
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">查询时长：802 ms</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <Download className="w-3.5 h-3.5" /> 下载 <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden bg-white">
          {!hasData && !isProcessing ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
              <Database className="w-12 h-12 opacity-10 mb-4" />
              <p className="text-xs font-medium text-gray-400">请在左侧配置查询条件后点击查询</p>
            </div>
          ) : isProcessing ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <Activity className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-xs font-medium text-gray-400">正在查询数据...</p>
            </div>
          ) : (
            <>
              {/* Main Result View */}
              <div className="flex-1 overflow-auto custom-scrollbar relative">
                {searchMode === 'model' ? (
                  queryTab === 'dynamic' ? (
                    <div className="p-4">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th rowSpan={2} className="px-4 py-3 font-medium text-gray-500 border-b border-r border-gray-200 bg-gray-50">期间</th>
                            <th rowSpan={2} className="px-4 py-3 font-medium text-gray-500 border-b border-r border-gray-200 bg-gray-50">科目</th>
                            <th colSpan={2} className="px-4 py-2 font-medium text-gray-500 border-b border-gray-200 text-center bg-gray-50">d1: None - 不分明细</th>
                          </tr>
                          <tr>
                            <th className="px-4 py-2 font-medium text-gray-500 border-b border-r border-gray-200 bg-gray-50">d2: None - 不分明细</th>
                            <th className="px-4 py-2 font-medium text-gray-500 border-b border-gray-200 bg-gray-50">d2: Other</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-4 py-3 text-gray-800 border-r border-gray-200 bg-gray-50 font-medium">1 - 1月</td>
                            <td className="px-4 py-3 text-gray-800 border-r border-gray-200 bg-gray-50 font-medium">acc1 - 科目1</td>
                            <td 
                              className={`px-4 py-3 text-right font-mono text-gray-900 border-r border-gray-100 cursor-pointer transition-colors ${selectedRow?.period === '1 - 1月' && selectedRow?.d2 === 'None - 不分明细' ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                              onClick={() => setSelectedRow({ period: '1 - 1月', account: 'acc1 - 科目1', d1: 'None - 不分明细', d2: 'None - 不分明细', decimal_value: '123.00', string_value: 'null', attachments: 1, comments: 1 })}
                            >123.00</td>
                            <td 
                              className={`px-4 py-3 text-right font-mono text-gray-900 cursor-pointer transition-colors ${selectedRow?.period === '1 - 1月' && selectedRow?.d2 === 'Other' ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                              onClick={() => setSelectedRow({ period: '1 - 1月', account: 'acc1 - 科目1', d1: 'None - 不分明细', d2: 'Other', decimal_value: '456.00', string_value: 'null', attachments: 0, comments: 0 })}
                            >456.00</td>
                          </tr>
                          <tr className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-4 py-3 text-gray-800 border-r border-gray-200 bg-gray-50 font-medium">2 - 2月</td>
                            <td className="px-4 py-3 text-gray-800 border-r border-gray-200 bg-gray-50 font-medium">acc1 - 科目1</td>
                            <td 
                              className={`px-4 py-3 text-right font-mono text-gray-900 border-r border-gray-100 cursor-pointer transition-colors ${selectedRow?.period === '2 - 2月' && selectedRow?.d2 === 'None - 不分明细' ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                              onClick={() => setSelectedRow({ period: '2 - 2月', account: 'acc1 - 科目1', d1: 'None - 不分明细', d2: 'None - 不分明细', decimal_value: '123.00', string_value: 'null', attachments: 0, comments: 0 })}
                            >123.00</td>
                            <td 
                              className={`px-4 py-3 text-right font-mono text-gray-900 cursor-pointer transition-colors ${selectedRow?.period === '2 - 2月' && selectedRow?.d2 === 'Other' ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                              onClick={() => setSelectedRow({ period: '2 - 2月', account: 'acc1 - 科目1', d1: 'None - 不分明细', d2: 'Other', decimal_value: '456.00', string_value: 'null', attachments: 1, comments: 0 })}
                            >456.00</td>
                          </tr>
                          <tr className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-4 py-3 text-gray-800 border-r border-gray-200 bg-gray-50 font-medium">11 - 11月</td>
                            <td className="px-4 py-3 text-gray-800 border-r border-gray-200 bg-gray-50 font-medium">acc1 - 科目1</td>
                            <td 
                              className={`px-4 py-3 text-right font-mono text-gray-900 border-r border-gray-100 cursor-pointer transition-colors ${selectedRow?.period === '11 - 11月' && selectedRow?.d2 === 'None - 不分明细' ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                              onClick={() => setSelectedRow({ period: '11 - 11月', account: 'acc1 - 科目1', d1: 'None - 不分明细', d2: 'None - 不分明细', decimal_value: '123.00', string_value: 'null', attachments: 0, comments: 0 })}
                            >123.00</td>
                            <td 
                              className={`px-4 py-3 text-right font-mono text-gray-900 cursor-pointer transition-colors ${selectedRow?.period === '11 - 11月' && selectedRow?.d2 === 'Other' ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                              onClick={() => setSelectedRow({ period: '11 - 11月', account: 'acc1 - 科目1', d1: 'None - 不分明细', d2: 'Other', decimal_value: '456.00', string_value: 'null', attachments: 0, comments: 0 })}
                            >456.00</td>
                          </tr>
                          <tr className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-4 py-3 text-gray-800 border-r border-gray-200 bg-gray-50 font-medium">12 - 12月</td>
                            <td className="px-4 py-3 text-gray-800 border-r border-gray-200 bg-gray-50 font-medium">acc1 - 科目1</td>
                            <td 
                              className={`px-4 py-3 text-right font-mono text-gray-900 border-r border-gray-100 cursor-pointer transition-colors ${selectedRow?.period === '12 - 12月' && selectedRow?.d2 === 'None - 不分明细' ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                              onClick={() => setSelectedRow({ period: '12 - 12月', account: 'acc1 - 科目1', d1: 'None - 不分明细', d2: 'None - 不分明细', decimal_value: '367.89', string_value: 'null', attachments: 2, comments: 1 })}
                            >367.89</td>
                            <td 
                              className={`px-4 py-3 text-right font-mono text-gray-900 cursor-pointer transition-colors ${selectedRow?.period === '12 - 12月' && selectedRow?.d2 === 'Other' ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                              onClick={() => setSelectedRow({ period: '12 - 12月', account: 'acc1 - 科目1', d1: 'None - 不分明细', d2: 'Other', decimal_value: '890.12', string_value: 'null', attachments: 0, comments: 0 })}
                            >890.12</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : queryTab === 'code' ? (
                    <div className="p-6 bg-[#1e1e1e] h-full text-blue-300 font-mono text-sm whitespace-pre-wrap">
                      // Python SDK Example
                      {`\nfrom deepfinance import Cube\n\ncube = Cube('fact_financial_transactions')\ndata = cube.query(\n    scenario='${dimValues.scenario}',\n    version='${dimValues.version}',\n    year='${dimValues.year}'\n)`}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm h-full">暂无内容</div>
                  )
                ) : (
                  queryTab === 'table' ? (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 font-medium text-gray-500 flex items-center gap-1">period <ArrowRight className="w-3 h-3 rotate-90 opacity-50"/><Filter className="w-3 h-3 opacity-50"/></th>
                          <th className="px-4 py-3 font-medium text-gray-500">account</th>
                          <th className="px-4 py-3 font-medium text-gray-500">d1</th>
                          <th className="px-4 py-3 font-medium text-gray-500">d2</th>
                          <th className="px-4 py-3 font-medium text-gray-500">decimal_value</th>
                          <th className="px-4 py-3 font-medium text-gray-500">string_value</th>
                          <th className="px-4 py-3 font-medium text-gray-500">cell_detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {mockBaseTableData.map(row => (
                          <tr 
                            key={row.id} 
                            onClick={() => setSelectedRow(row)}
                            className={`cursor-pointer transition-colors ${selectedRow?.id === row.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                          >
                            <td className="px-4 py-3 text-gray-700">{row.period}</td>
                            <td className="px-4 py-3 text-gray-700">{row.account}</td>
                            <td className="px-4 py-3 text-gray-500">{row.d1}</td>
                            <td className="px-4 py-3 text-gray-500">{row.d2}</td>
                            <td className="px-4 py-3 text-gray-700">{row.decimal_value}</td>
                            <td className="px-4 py-3 text-gray-400">{row.string_value}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2 text-gray-400">
                                <Paperclip className={`w-3.5 h-3.5 ${row.attachments > 0 ? 'text-blue-500' : ''}`} />
                                {row.attachments > 0 && <span className="text-blue-500 text-[10px]">{row.attachments}</span>}
                                <MessageSquare className={`w-3.5 h-3.5 ${row.comments > 0 ? 'text-emerald-500' : ''}`} />
                                {row.comments > 0 && <span className="text-emerald-500 text-[10px]">{row.comments}</span>}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : queryTab === 'code' ? (
                    <div className="p-6 bg-[#1e1e1e] h-full text-blue-300 font-mono text-sm whitespace-pre-wrap">
                      // Base Table Query Example
                      {`\nSELECT * FROM fact_financial_transactions\nWHERE scenario='${dimValues.scenario}'`}
                    </div>
                  ) : (
                    <div className="p-6 bg-[#1e1e1e] h-full text-blue-300 font-mono text-sm whitespace-pre-wrap">
                      {generatedSql}
                    </div>
                  )
                )}
              </div>

              {/* Detail Panel */}
              {((searchMode === 'base' && queryTab === 'table') || (searchMode === 'model' && queryTab === 'dynamic')) && selectedRow && (
                <div className="w-[340px] bg-white border-l border-gray-200 flex flex-col shrink-0 z-20 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)] animate-in slide-in-from-right duration-200">
                  <div className="h-14 px-4 border-b border-gray-200 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <ListFilter className="w-4 h-4 text-gray-500" />
                      <h3 className="text-sm font-bold text-gray-800">详情</h3>
                    </div>
                    <button onClick={() => setSelectedRow(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4"/></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                    {/* Dimensions Table */}
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="py-2 font-medium text-gray-500 w-24">维度</th>
                          <th className="py-2 font-medium text-gray-500">值</th>
                          <th className="py-2 text-right">
                            <button className="px-2 py-1 border border-gray-200 rounded text-gray-600 flex items-center gap-1 ml-auto hover:bg-gray-50 transition-colors">
                              <Code2 className="w-3 h-3"/> 复制为script
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        <tr><td className="py-2.5 text-blue-600 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5"/> Scenario</td><td className="py-2.5 text-gray-800" colSpan={2}>Actual - 实际数</td></tr>
                        <tr><td className="py-2.5 text-blue-600 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5"/> Version</td><td className="py-2.5 text-gray-800" colSpan={2}>Working - 工作版</td></tr>
                        <tr><td className="py-2.5 text-blue-600 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5"/> Year</td><td className="py-2.5 text-gray-800" colSpan={2}>2025 - 2025年</td></tr>
                        <tr><td className="py-2.5 text-blue-600 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5"/> Entity</td><td className="py-2.5 text-gray-800" colSpan={2}>entityA - 公司A</td></tr>
                        <tr><td className="py-2.5 text-blue-600 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5"/> Period</td><td className="py-2.5 text-gray-800" colSpan={2}>{selectedRow.period}</td></tr>
                        <tr><td className="py-2.5 text-blue-600 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5"/> Account</td><td className="py-2.5 text-gray-800" colSpan={2}>{selectedRow.account}</td></tr>
                        <tr><td className="py-2.5 text-blue-600 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5"/> d1</td><td className="py-2.5 text-gray-800" colSpan={2}>{selectedRow.d1}</td></tr>
                        <tr><td className="py-2.5 text-blue-600 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5"/> d2</td><td className="py-2.5 text-gray-800" colSpan={2}>{selectedRow.d2}</td></tr>
                        <tr><td className="py-2.5 text-gray-500 flex items-center gap-1.5"><Hash className="w-3.5 h-3.5"/> decimal_value</td><td className="py-2.5 font-mono text-gray-900" colSpan={2}>{selectedRow.decimal_value}</td></tr>
                        <tr><td className="py-2.5 text-gray-500 flex items-center gap-1.5"><FileType className="w-3.5 h-3.5"/> string_value</td><td className="py-2.5 font-mono text-gray-400" colSpan={2}>{selectedRow.string_value}</td></tr>
                      </tbody>
                    </table>

                    {/* Remarks */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-800">备注</h4>
                      <textarea 
                        className="w-full h-20 border border-gray-200 rounded-lg p-3 text-xs resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-700" 
                        defaultValue="这是一条备注"
                      ></textarea>
                    </div>

                    {/* Attachments & Logs */}
                    <div>
                      <div className="flex border-b border-gray-200">
                        <button className="px-4 py-2 text-xs font-medium text-blue-600 border-b-2 border-blue-600">附件 (2)</button>
                        <button className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700">日志</button>
                      </div>
                      <div className="py-4 space-y-3">
                        <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-200 transition-colors bg-gray-50/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                              <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded flex items-center justify-center">
                                <FileType className="w-3 h-3"/>
                              </div>
                              这里是文件名.xlsx
                            </div>
                            <div className="flex gap-2 text-gray-400">
                              <button className="hover:text-blue-600"><Search className="w-3.5 h-3.5"/></button>
                              <button className="hover:text-blue-600"><Download className="w-3.5 h-3.5"/></button>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold shrink-0">五只</div>
                            <div className="text-[10px] text-gray-500">
                              <div className="font-medium text-gray-700">五只乳鸽</div>
                              <div>lidovce@deepfinance.com</div>
                            </div>
                            <div className="ml-auto text-[10px] text-gray-400 text-right flex flex-col items-end">
                              <Clock className="w-3 h-3 mb-0.5 opacity-50" />
                              <div>2025-11-11</div>
                              <div>20:30:40</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-200 transition-colors bg-gray-50/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                              <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded flex items-center justify-center">
                                <FileType className="w-3 h-3"/>
                              </div>
                              这里是文件名.xlsx
                            </div>
                            <div className="flex gap-2 text-gray-400">
                              <button className="hover:text-blue-600"><Search className="w-3.5 h-3.5"/></button>
                              <button className="hover:text-blue-600"><Download className="w-3.5 h-3.5"/></button>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold shrink-0">六只</div>
                            <div className="text-[10px] text-gray-500">
                              <div className="font-medium text-gray-700">六只乳鸽</div>
                              <div>lidovce@deepfinance.com</div>
                            </div>
                            <div className="ml-auto text-[10px] text-gray-400 text-right flex flex-col items-end">
                              <Clock className="w-3 h-3 mb-0.5 opacity-50" />
                              <div>2025-11-21</div>
                              <div>20:40:50</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Layout Configuration Modal */}
      {showLayoutModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-[500px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">配置行列与背景</h3>
              <button onClick={() => setShowLayoutModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {dimensions.map(dim => (
                <div key={dim.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                    <span className="text-sm font-medium text-gray-700">{dim.name}</span>
                  </div>
                  <div className="flex bg-white rounded-md border border-gray-200 p-0.5">
                    {(['background', 'row', 'col'] as DimLocation[]).map(loc => (
                      <button
                        key={loc}
                        onClick={() => setDimLocations({...dimLocations, [dim.id]: loc})}
                        className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${dimLocations[dim.id] === loc ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        {loc === 'background' ? '背景' : loc === 'row' ? '行' : '列'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setShowLayoutModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">取消</button>
              <button onClick={() => setShowLayoutModal(false)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">确定</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataQuery;
