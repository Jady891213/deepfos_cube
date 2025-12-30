
import React, { useState, useEffect, useRef } from 'react';
import { Database, Folder, Key, Table, Maximize, ZoomIn, ZoomOut, Info, ArrowRightLeft, Layers } from 'lucide-react';
import { Dimension, ModelConfig } from '../types';

interface NodePosition {
  x: number;
  y: number;
}

interface ModelDiagramProps {
  dimensions: Dimension[];
  modelConfig: ModelConfig;
}

const ModelDiagram: React.FC<ModelDiagramProps> = ({ dimensions, modelConfig }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>('fact');
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate layout
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({});
  const centerX = 400;
  const centerY = 350;
  const radius = 220;

  useEffect(() => {
    const positions: Record<string, NodePosition> = {};
    // Center Fact Table
    positions['fact'] = { x: centerX, y: centerY };

    // Orbit Dimensions
    const totalDims = dimensions.length;
    dimensions.forEach((dim, index) => {
      const angle = (index / totalDims) * 2 * Math.PI - (Math.PI / 2); // Start from top
      positions[dim.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
    setNodePositions(positions);
  }, [dimensions]);

  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(0.5, prev + delta), 2));
  };

  const renderConnection = (dimId: string) => {
    const start = nodePositions['fact'];
    const end = nodePositions[dimId];
    if (!start || !end) return null;

    // Calculate control points for Bezier curve
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    return (
      <g key={dimId}>
        {/* Halo effect for line */}
        <path
          d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
          stroke="white"
          strokeWidth="6"
          fill="none"
        />
        {/* Actual line */}
        <path
          d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
          stroke={selectedNode === dimId ? '#2563EB' : '#CBD5E1'}
          strokeWidth={selectedNode === dimId ? '2' : '1.5'}
          strokeDasharray={selectedNode === dimId ? '0' : '5,5'}
          fill="none"
          className="transition-all duration-300"
        />
        {/* Relationship Marker */}
        <circle cx={midX} cy={midY} r="3" fill="white" stroke="#94A3B8" strokeWidth="1" />
      </g>
    );
  };

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      
      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden bg-slate-50 border-r border-gray-200" ref={containerRef}>
        {/* Toolbar */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="bg-white p-1 rounded-md shadow border border-gray-200 flex flex-col gap-1">
                <button onClick={() => handleZoom(0.1)} className="p-2 hover:bg-gray-100 rounded text-gray-600"><ZoomIn className="w-4 h-4"/></button>
                <button onClick={() => handleZoom(-0.1)} className="p-2 hover:bg-gray-100 rounded text-gray-600"><ZoomOut className="w-4 h-4"/></button>
                <button onClick={() => setScale(1)} className="p-2 hover:bg-gray-100 rounded text-gray-600"><Maximize className="w-4 h-4"/></button>
            </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur p-4 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Schema Legend</h4>
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-xs text-gray-700">Fact Table (Center)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white border-2 border-green-500"></div>
                    <span className="text-xs text-gray-700">Dimension Table</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-0 border-t border-dashed border-gray-400"></div>
                    <span className="text-xs text-gray-700">Foreign Key Relation</span>
                </div>
            </div>
        </div>

        {/* Interactive Graph */}
        <div 
            className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center transition-transform duration-200 ease-out"
            style={{ transform: `scale(${scale})` }}
        >
             <div className="relative w-[800px] h-[700px]">
                
                {/* SVG Layer for Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {dimensions.map(dim => renderConnection(dim.id))}
                </svg>

                {/* Nodes Layer */}
                
                {/* Fact Table Node */}
                {nodePositions['fact'] && (
                    <div 
                        onClick={() => setSelectedNode('fact')}
                        className={`absolute w-40 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-lg shadow-lg cursor-pointer transition-all duration-300 z-20 hover:scale-105
                        ${selectedNode === 'fact' ? 'ring-4 ring-blue-200 scale-105' : ''}`}
                        style={{ left: nodePositions['fact'].x, top: nodePositions['fact'].y }}
                    >
                        <div className="p-3 text-center">
                            <Database className="w-6 h-6 mx-auto mb-1 opacity-90" />
                            <div className="font-bold text-xs truncate px-1">{modelConfig.factTable}</div>
                            <div className="text-[10px] opacity-80 mt-1">12.5M Rows</div>
                        </div>
                        {/* Ports */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                )}

                {/* Dimension Nodes */}
                {dimensions.map(dim => {
                    const pos = nodePositions[dim.id];
                    if (!pos) return null;
                    const isSelected = selectedNode === dim.id;

                    return (
                        <div 
                            key={dim.id}
                            onClick={() => setSelectedNode(dim.id)}
                            className={`absolute w-32 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg border-2 cursor-pointer transition-all duration-300 z-10 hover:shadow-md hover:border-blue-400
                            ${isSelected ? 'border-green-500 shadow-lg scale-105' : 'border-gray-200'}`}
                            style={{ left: pos.x, top: pos.y }}
                        >
                             <div className="p-2.5">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className={`p-1 rounded ${isSelected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <Table className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700 truncate">{dim.code}</span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono truncate border-t border-gray-100 pt-1 mt-1">
                                    {dim.binding}
                                </div>
                             </div>
                        </div>
                    );
                })}

             </div>
        </div>
      </div>

      {/* Right Detail Panel */}
      <div className="w-[350px] bg-white z-20 flex flex-col h-full overflow-hidden">
        {selectedNode ? (
            selectedNode === 'fact' ? (
                // Fact Table Details
                <>
                    <div className="p-6 border-b border-gray-100 bg-blue-50">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
                                <Database className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Fact Table</h3>
                                <p className="text-xs text-blue-700 font-mono">{modelConfig.factTable}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                         <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Storage Statistics</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                                    <div className="text-xl font-bold text-gray-900">12.5M</div>
                                    <div className="text-xs text-gray-500">Total Rows</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                                    <div className="text-xl font-bold text-gray-900">1.2 GB</div>
                                    <div className="text-xs text-gray-500">Disk Size</div>
                                </div>
                            </div>
                         </div>
                         <div>
                             <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Partition Strategy</h4>
                             <div className="flex items-start gap-2 text-sm text-gray-700 p-3 border border-gray-200 rounded-lg">
                                <Layers className="w-4 h-4 mt-0.5 text-blue-500" />
                                <div>
                                    <span className="font-mono bg-gray-100 px-1 rounded">toYYYYMM(date)</span>
                                    <p className="text-xs text-gray-500 mt-1">Data is physically partitioned by month for faster time-series queries.</p>
                                </div>
                             </div>
                         </div>
                    </div>
                </>
            ) : (
                // Dimension Details
                (() => {
                    const dim = dimensions.find(d => d.id === selectedNode);
                    if (!dim) return null;
                    return (
                        <>
                            <div className="p-6 border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-white border border-gray-200 text-green-600 rounded-lg shadow-sm">
                                        <Folder className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{dim.name}</h3>
                                        <p className="text-xs text-gray-500 font-mono">{dim.code}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <span className="px-2 py-1 bg-white border border-gray-200 text-xs rounded text-gray-600">{dim.type}</span>
                                    <span className="px-2 py-1 bg-white border border-gray-200 text-xs rounded text-gray-600">Cached</span>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                        <ArrowRightLeft className="w-3.5 h-3.5" /> Relationship
                                    </h4>
                                    <div className="p-4 rounded-lg border border-blue-100 bg-blue-50/50 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 font-mono">fact.{dim.code}</span>
                                            <ArrowRightLeft className="w-3 h-3 text-gray-400" />
                                            <span className="text-gray-900 font-bold font-mono">{dim.binding}.id</span>
                                        </div>
                                        <p className="text-xs text-blue-600 pt-2 border-t border-blue-100">
                                            Star Join: Many-to-One
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Table Schema</h4>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <table className="w-full text-xs">
                                            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                                                <tr>
                                                    <th className="px-3 py-2 text-left">Column</th>
                                                    <th className="px-3 py-2 text-left">Type</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                <tr className="bg-yellow-50/50">
                                                    <td className="px-3 py-2 font-mono flex items-center gap-1.5">
                                                        <Key className="w-3 h-3 text-yellow-600" />
                                                        id
                                                    </td>
                                                    <td className="px-3 py-2 text-gray-500">String</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-3 py-2 font-mono">description</td>
                                                    <td className="px-3 py-2 text-gray-500">String</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-3 py-2 font-mono">parent_id</td>
                                                    <td className="px-3 py-2 text-gray-500">String</td>
                                                </tr>
                                                {dim.type === 'Account' && (
                                                     <tr>
                                                        <td className="px-3 py-2 font-mono">acct_type</td>
                                                        <td className="px-3 py-2 text-gray-500">Enum8</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                })()
            )
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <Info className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-sm">Select a node to view details</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ModelDiagram;
