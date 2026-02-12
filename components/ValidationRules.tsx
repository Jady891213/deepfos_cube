
import React, { useState } from 'react';
import { ValidationRule } from '../types';
import { Plus, Trash2, CheckCircle, AlertTriangle, Scale, Equal, ArrowRight, Layers, Sliders } from 'lucide-react';

const ValidationRules: React.FC = () => {
  const [rules, setRules] = useState<ValidationRule[]>([
    { 
        id: '1', 
        code: 'VAL_BS_001', 
        name: 'Balance Sheet Identity', 
        targetAccount: 'chk_BalanceSheet', 
        tolerance: 0.01,
        lhs: '[Total Assets]',
        rhs: '[Total Liabilities] + [Total Equity]',
        scope: { scenario: 'Actual, Budget', entity: 'Base Level' },
        isActive: true
    },
    { 
        id: '2', 
        code: 'VAL_CF_002', 
        name: 'Cash Flow Cross-Check', 
        targetAccount: 'chk_CashFlow', 
        tolerance: 1.00,
        lhs: '[Net Increase in Cash]',
        rhs: '[Cash End of Period] - [Cash Beginning]',
        scope: { scenario: 'Actual', entity: 'All' },
        isActive: true
    }
  ]);

  const [selectedRuleId, setSelectedRuleId] = useState<string>('1');
  const selected = rules.find(r => r.id === selectedRuleId);

  return (
    <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-sm shrink-0">
             <div>
                <h2 className="text-xl font-bold text-gray-800">Validation Rules</h2>
                <p className="text-xs text-gray-500 mt-1">Define accounting logic checks and data block scopes.</p>
             </div>
             <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-all">
                 <Plus className="w-4 h-4" /> Add Rule
             </button>
         </div>

         <div className="flex flex-1 overflow-hidden">
             {/* Left: Rule List */}
             <div className="w-[320px] shrink-0 border-r border-gray-200 bg-white flex flex-col z-0">
                <div className="flex bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <div className="flex-1 px-4 py-3">Rule Name</div>
                    <div className="w-16 px-4 py-3 text-center">Status</div>
                </div>
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    {rules.map(rule => (
                        <div 
                            key={rule.id}
                            onClick={() => setSelectedRuleId(rule.id)}
                            className={`group p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors
                            ${selectedRuleId === rule.id ? 'bg-blue-50/60' : ''}`}
                        >
                             <div className="flex justify-between items-start mb-1">
                                <div className={`text-sm font-bold ${selectedRuleId === rule.id ? 'text-blue-700' : 'text-gray-800'}`}>
                                    {rule.name}
                                </div>
                                {rule.isActive ? 
                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> : 
                                    <AlertTriangle className="w-4 h-4 text-gray-300 shrink-0" />
                                }
                             </div>
                             <div className="text-xs text-gray-500 font-mono mb-2">{rule.code}</div>
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">
                                    {rule.targetAccount}
                                </span>
                             </div>
                        </div>
                    ))}
                </div>
             </div>

             {/* Right: Configuration */}
             <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                {selected ? (
                    <div className="max-w-5xl mx-auto space-y-6">
                        
                        {/* 1. Definition Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <Sliders className="w-4 h-4 text-blue-500" /> Definition
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="col-span-1">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Rule Code</label>
                                    <input type="text" value={selected.code} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Rule Name</label>
                                    <input type="text" value={selected.name} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Target Account</label>
                                    <select className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5">
                                        <option>{selected.targetAccount}</option>
                                        <option>chk_CustomCheck</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 2. Logic / Equation Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full"></div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                                    <Scale className="w-4 h-4 text-blue-500" /> Balance Equation
                                </h3>
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 border border-gray-200">
                                    <span className="text-xs font-semibold text-gray-500">Tolerance:</span>
                                    <input type="number" value={selected.tolerance} className="w-16 bg-transparent text-sm font-mono text-gray-900 focus:outline-none text-right" />
                                </div>
                            </div>
                            
                            {/* Visual Equation Builder */}
                            <div className="flex items-center justify-between gap-4 py-4">
                                {/* Left Hand Side */}
                                <div className="flex-1 p-5 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-text group">
                                    <div className="text-center">
                                        <div className="text-xs font-bold text-gray-400 uppercase mb-2">Left Hand Side (LHS)</div>
                                        <div className="font-mono text-lg font-medium text-gray-700 group-hover:text-blue-700">
                                            {selected.lhs}
                                        </div>
                                    </div>
                                </div>

                                {/* Operator */}
                                <div className="flex flex-col items-center justify-center shrink-0 w-12 h-12 rounded-full bg-blue-100 text-blue-600 shadow-sm border border-blue-200">
                                    <Equal className="w-6 h-6" />
                                </div>

                                {/* Right Hand Side */}
                                <div className="flex-1 p-5 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-text group">
                                     <div className="text-center">
                                        <div className="text-xs font-bold text-gray-400 uppercase mb-2">Right Hand Side (RHS)</div>
                                        <div className="font-mono text-lg font-medium text-gray-700 group-hover:text-blue-700">
                                            {selected.rhs}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4 flex items-center justify-center text-xs text-gray-400 gap-2">
                                <InfoIcon />
                                <span>The system will automatically calculate <code>{`Diff = LHS - RHS`}</code>. If <code>{`ABS(Diff) > Tolerance`}</code>, the Validation Account will be populated.</span>
                            </div>
                        </div>

                        {/* 3. Scope / Data Block Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-blue-500" /> Query Scope (Data Block)
                            </h3>
                            <p className="text-xs text-gray-500 mb-4">Define the dimensional slice where this validation runs. Unspecified dimensions will iterate over all base members.</p>
                            
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                                        <tr>
                                            <th className="px-4 py-3 border-b border-gray-200">Dimension</th>
                                            <th className="px-4 py-3 border-b border-gray-200">Scope Type</th>
                                            <th className="px-4 py-3 border-b border-gray-200 w-1/2">Selection / Filter</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {['Scenario', 'Version', 'Entity', 'Period'].map((dim, i) => (
                                            <tr key={i} className="bg-white hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-900">{dim}</td>
                                                <td className="px-4 py-3">
                                                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded block p-1.5">
                                                        <option>Fixed Selection</option>
                                                        <option>Hierarchy Level</option>
                                                        <option>All Base Members</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            type="text" 
                                                            value={selected.scope[dim.toLowerCase()] || 'All Base Members'}
                                                            className="bg-white border border-gray-300 text-gray-700 text-xs rounded block w-full p-1.5 font-mono"
                                                        />
                                                        <button className="text-gray-400 hover:text-blue-600"><Sliders className="w-3 h-3" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md shadow-sm hover:bg-gray-50">
                                Discard Changes
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700">
                                Save Rule
                            </button>
                        </div>

                    </div>
                ) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-gray-400 mt-20">
                        <Scale className="w-12 h-12 opacity-20 mb-4" />
                        <p>Select a validation rule to configure</p>
                    </div>
                )}
             </div>
         </div>
    </div>
  );
};

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);

export default ValidationRules;
