
import React, { useState } from 'react';
import Sidebar from './components/Sidebar.tsx';
import ModelStructure from './components/ModelStructure.tsx';
import DimensionStrategy from './components/DimensionStrategy.tsx';
import ScriptEditor from './components/ScriptEditor.tsx';
import DataQuery from './components/DataQuery.tsx';
import ValidationRules from './components/ValidationRules.tsx';
import { Tab } from './types.ts';
import { Save, ChevronRight, Home } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('structure');

  const renderContent = () => {
    switch (activeTab) {
      case 'structure': return <ModelStructure />;
      case 'strategies': return <DimensionStrategy />;
      case 'validations': return <ValidationRules />;
      case 'scripts': return <ScriptEditor />;
      case 'query': return <DataQuery />;
      default: return <ModelStructure />;
    }
  };

  const getBreadcrumb = () => {
     switch (activeTab) {
      case 'structure': return '模型结构';
      case 'strategies': return '维度策略';
      case 'validations': return '校验规则';
      case 'scripts': return '脚本公式';
      case 'query': return '数据探索';
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
            <div className="flex items-center text-sm text-gray-500">
                <Home className="w-4 h-4 mr-2" />
                <span>DeepCube 项目模型</span>
                <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
                <span className="font-medium text-gray-900">{getBreadcrumb()}</span>
            </div>

            <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    取消
                </button>
                <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-md shadow-md flex items-center gap-2 transition-all active:scale-95">
                    <Save className="w-4 h-4" />
                    保存模型
                </button>
            </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden relative">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
