
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ModelStructure from './components/ModelStructure';
import DimensionStrategy from './components/DimensionStrategy';
import ScriptEditor from './components/ScriptEditor';
import DataQuery from './components/DataQuery';
import ValidationRules from './components/ValidationRules';
import { Tab } from './types';
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
      case 'structure': return 'Model Structure';
      case 'strategies': return 'Dimension Strategies';
      case 'validations': return 'Validation Rules';
      case 'scripts': return 'Script Formulas';
      case 'query': return 'Data Explorer';
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
            <div className="flex items-center text-sm text-gray-500">
                <Home className="w-4 h-4 mr-2" />
                <span>Project Budget Model</span>
                <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
                <span className="font-medium text-gray-900">{getBreadcrumb()}</span>
            </div>

            <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
                    Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Model
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
