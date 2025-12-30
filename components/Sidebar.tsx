
import React, { useState } from 'react';
import { LayoutGrid, ShieldCheck, FileCode, Database, Box, ChevronLeft, ChevronRight, Search, Scale } from 'lucide-react';
import { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const menuItems = [
    { id: 'structure', label: 'Model Structure', icon: LayoutGrid },
    { id: 'strategies', label: 'Dim Strategies', icon: ShieldCheck },
    { id: 'validations', label: 'Validation Rules', icon: Scale },
    { id: 'scripts', label: 'Script Formulas', icon: FileCode },
    { id: 'query', label: 'Data Explorer', icon: Search },
  ];

  return (
    <div 
      className={`bg-white border-r border-gray-200 h-screen flex flex-col justify-between transition-all duration-300 ease-in-out z-20 shadow-sm
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div>
        <div className={`h-16 flex items-center border-b border-gray-200 ${isCollapsed ? 'justify-center' : 'px-6'}`}>
            <Box className="w-8 h-8 text-blue-600 shrink-0" />
            <span className={`ml-3 font-bold text-xl text-gray-800 whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              DeepCube
            </span>
        </div>
        
        <nav className="mt-4 flex flex-col gap-2 px-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                title={isCollapsed ? item.label : ''}
                className={`flex items-center p-2.5 rounded-lg transition-colors duration-200 group relative
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span className={`ml-3 font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    {item.label}
                </span>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                        {item.label}
                    </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div>
          <div className="flex justify-end px-2 pb-2">
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                  {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
          </div>
          <div className={`p-4 border-t border-gray-200 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <div className="flex items-center text-gray-500 overflow-hidden">
                <Database className="w-5 h-5 shrink-0" />
                <div className={`ml-2 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    <span className="text-xs font-mono font-semibold text-gray-700">ClickHouse</span>
                    <span className="text-[10px] text-green-600">Connected</span>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Sidebar;
