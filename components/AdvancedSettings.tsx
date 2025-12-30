
import React from 'react';
import { ToggleLeft, Calendar, Layout, Info, AlertCircle } from 'lucide-react';

const AdvancedSettings: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto h-full p-8">
        {/* Responsive Grid Container */}
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8 pb-10">
            
            {/* Section 1: Aggregation */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                    <h2 className="text-lg font-bold text-gray-800">Aggregation Strategy</h2>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex-1">
                    <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-100">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Auto-Aggregation</h3>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">Enable real-time summarization of time periods and hierarchies.</p>
                        </div>
                        <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in cursor-pointer">
                            <input type="checkbox" name="toggle" id="toggle" checked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-blue-600 right-0"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-blue-600 cursor-pointer"></label>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Lowest Time Granularity</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <select className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                    <option>Month</option>
                                    <option>Quarter</option>
                                    <option>Year</option>
                                    <option>Day</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">BS Logic</label>
                                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                    <option>Closing Balance</option>
                                    <option>Movement</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">PL Logic</label>
                                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                    <option>Periodic</option>
                                    <option>YTD</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Display */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                    <h2 className="text-lg font-bold text-gray-800">Visual Configuration</h2>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex-1">
                    <div className="space-y-6">
                        <div>
                             <div className="flex justify-between items-center mb-3">
                                <label className="block text-sm font-bold text-gray-700">Restricted Data Placeholder</label>
                                <div className="flex rounded-md shadow-sm" role="group">
                                    <button type="button" className="px-2 py-1 text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-l hover:bg-blue-100">Default</button>
                                    <button type="button" className="px-2 py-1 text-[10px] font-medium text-gray-600 bg-white border border-gray-200 rounded-r hover:bg-gray-50">Custom</button>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-gray-50 text-gray-600 text-sm rounded-lg border border-gray-200">
                                <AlertCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs">Cells without access display:</p>
                                    <code className="block mt-1 font-mono bg-white px-2 py-0.5 rounded border border-gray-300 w-fit text-xs">【NO ACCESS】</code>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="block text-sm font-bold text-gray-700">Null Value Display</label>
                            </div>
                             <div className="relative">
                                <input type="text" value="-" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-center font-bold" />
                                <span className="absolute right-3 top-2.5 text-xs text-gray-400">Preview</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Events */}
            <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                    <h2 className="text-lg font-bold text-gray-800">Event Triggers</h2>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex-1">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Post-Write Callback</label>
                            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                <option>No Action</option>
                                <option>Execute Python Script</option>
                                <option>Trigger HTTP Webhook</option>
                            </select>
                        </div>
                        <div className="p-3 bg-yellow-50 text-yellow-800 text-xs rounded-lg border border-yellow-200 flex gap-2 leading-relaxed">
                            <Info className="w-4 h-4 shrink-0 mt-0.5" />
                            <p>Executes asynchronously after commit. Ideal for ETL notifications or heavy calc jobs.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default AdvancedSettings;
