
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Script } from '../types';
import { Play, Code, Braces, BookOpen, Copy, FileText, ChevronRight, Settings, Blocks, RefreshCw, ArrowRight } from 'lucide-react';

// Declare Blockly global from CDN
declare const Blockly: any;

const ScriptEditor: React.FC = () => {
  const [editorMode, setEditorMode] = useState<'code' | 'visual'>('code');
  const [scripts, setScripts] = useState<Script[]>([
    { 
        id: '1', 
        name: 'Calculate Revenue', 
        triggerType: 'Calculation', 
        content: `# Calculate total revenue from Price * Qty\n\n# Scope: 2024 Budget\ncube.scope.year = '2024'\ncube.scope.scenario = 'Budget'\n\n# Formula\n# Revenue = Price * Quantity\ncube.account['Revenue'] = cube.account['Price'] * cube.account['Quantity']\n\n# Save results\ncube.save()`,
        blockXml: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="dc_scope_year" id="1" x="50" y="50"><value name="YEAR"><shadow type="math_number"><field name="NUM">2024</field></shadow></value><next><block type="dc_scope_scenario" id="2"><field name="SCENARIO">\'Budget\'</field><next><block type="dc_set_value" id="3"><field name="ACCOUNT">Revenue</field><value name="VALUE"><block type="math_arithmetic" id="4"><field name="OP">MULTIPLY</field><value name="A"><shadow type="math_number"><field name="NUM">1</field></shadow><block type="dc_get_value" id="5"><field name="ACCOUNT">Price</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">1</field></shadow><block type="dc_get_value" id="6"><field name="ACCOUNT">Quantity</field></block></value></block></value><next><block type="dc_save" id="7"></block></next></block></next></block></next></block></xml>'
    },
    { 
        id: '2', 
        name: 'Validate Input', 
        triggerType: 'Validation', 
        content: `def validate(data_point):\n    if data_point['amount'] < 0:\n        return "Negative values not allowed"\n    return True`
    }
  ]);

  const [selectedScriptId, setSelectedScriptId] = useState<string>('1');
  const selected = scripts.find(s => s.id === selectedScriptId);
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<any>(null);
  const [generatedCode, setGeneratedCode] = useState("");

  // Update scripts state helper
  const updateScript = (id: string, updates: Partial<Script>) => {
    setScripts(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // Define Custom Blocks for DeepCube
  const defineBlocks = useCallback(() => {
      if (!Blockly.Blocks['dc_scope_year']) {
          Blockly.Blocks['dc_scope_year'] = {
            init: function() {
              this.appendValueInput("YEAR")
                  .setCheck(["String", "Number"])
                  .appendField("Set Scope Year =");
              this.setPreviousStatement(true, null);
              this.setNextStatement(true, null);
              this.setColour(230);
              this.setTooltip("Set the Year dimension scope");
            }
          };
          
          Blockly.Python['dc_scope_year'] = function(block: any) {
             const value_year = Blockly.Python.valueToCode(block, 'YEAR', Blockly.Python.ORDER_ATOMIC) || "''";
             return `cube.scope.year = ${value_year}\n`;
          };

          Blockly.Blocks['dc_scope_scenario'] = {
            init: function() {
              this.appendDummyInput()
                  .appendField("Set Scope Scenario =")
                  .appendField(new Blockly.FieldDropdown([["Budget","'Budget'"], ["Actual","'Actual'"], ["Forecast","'Forecast'"]]), "SCENARIO");
              this.setPreviousStatement(true, null);
              this.setNextStatement(true, null);
              this.setColour(230);
              this.setTooltip("Set the Scenario dimension scope");
            }
          };
          
          Blockly.Python['dc_scope_scenario'] = function(block: any) {
             const dropdown_scenario = block.getFieldValue('SCENARIO');
             return `cube.scope.scenario = ${dropdown_scenario}\n`;
          };

          Blockly.Blocks['dc_set_value'] = {
            init: function() {
              this.appendValueInput("VALUE")
                  .setCheck("Number")
                  .appendField("Set Account")
                  .appendField(new Blockly.FieldTextInput("Revenue"), "ACCOUNT")
                  .appendField("=");
              this.setPreviousStatement(true, null);
              this.setNextStatement(true, null);
              this.setColour(160);
              this.setTooltip("Assign a value to an account");
            }
          };

          Blockly.Python['dc_set_value'] = function(block: any) {
             const text_account = block.getFieldValue('ACCOUNT');
             const value_val = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC) || '0';
             return `cube.account['${text_account}'] = ${value_val}\n`;
          };

          Blockly.Blocks['dc_get_value'] = {
            init: function() {
              this.appendDummyInput()
                  .appendField("Get Account")
                  .appendField(new Blockly.FieldTextInput("Price"), "ACCOUNT");
              this.setOutput(true, "Number");
              this.setColour(160);
              this.setTooltip("Get value from an account");
            }
          };

          Blockly.Python['dc_get_value'] = function(block: any) {
             const text_account = block.getFieldValue('ACCOUNT');
             return [`cube.account['${text_account}']`, Blockly.Python.ORDER_ATOMIC];
          };

          Blockly.Blocks['dc_save'] = {
            init: function() {
              this.appendDummyInput()
                  .appendField("Save Data to Cube");
              this.setPreviousStatement(true, null);
              this.setColour(20);
              this.setTooltip("Commit changes to database");
            }
          };
          
          Blockly.Python['dc_save'] = function(block: any) {
             return `cube.save()\n`;
          };
      }
  }, []);

  // Initialize Blockly Workspace
  useEffect(() => {
    if (editorMode === 'visual' && blocklyDiv.current) {
        defineBlocks();

        // Create workspace if it doesn't exist
        if (!workspaceRef.current) {
            workspaceRef.current = Blockly.inject(blocklyDiv.current, {
                toolbox: `
                <xml>
                    <category name="Scope" colour="230">
                        <block type="dc_scope_year">
                            <value name="YEAR">
                                <shadow type="math_number">
                                    <field name="NUM">2024</field>
                                </shadow>
                            </value>
                        </block>
                        <block type="dc_scope_scenario"></block>
                    </category>
                    <category name="Data Ops" colour="160">
                        <block type="dc_set_value">
                             <value name="VALUE">
                                <shadow type="math_number">
                                    <field name="NUM">0</field>
                                </shadow>
                            </value>
                        </block>
                        <block type="dc_get_value"></block>
                        <block type="dc_save"></block>
                    </category>
                    <category name="Math" colour="210">
                        <block type="math_number"></block>
                        <block type="math_arithmetic"></block>
                    </category>
                    <category name="Logic" colour="210">
                        <block type="logic_compare"></block>
                        <block type="logic_operation"></block>
                        <block type="logic_boolean"></block>
                    </category>
                     <category name="Loops" colour="120">
                        <block type="controls_repeat_ext"></block>
                    </category>
                </xml>
                `,
                scrollbars: true,
                trashcan: true,
                grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
                zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 }
            });

            // Handle real-time code generation and XML saving
            const handleWorkspaceUpdate = () => {
                 const code = Blockly.Python.workspaceToCode(workspaceRef.current);
                 setGeneratedCode(code);
                 
                 // We save the XML to a ref or directly to state logic?
                 // Updating state here causes re-renders. We should rely on a manual save or optimized update.
                 // For now, let's allow the UI to be responsive and save XML when unmounting/switching.
            };
            
            workspaceRef.current.addChangeListener(handleWorkspaceUpdate);
        }

        // Resize handling
        const resizeObserver = new ResizeObserver(() => {
             if (workspaceRef.current) Blockly.svgResize(workspaceRef.current);
        });
        resizeObserver.observe(blocklyDiv.current);
        
        // Cleanup function
        return () => {
             resizeObserver.disconnect();
             if (workspaceRef.current) {
                // IMPORTANT: Dispose to prevent ghost DOM nodes and white screens
                workspaceRef.current.dispose();
                workspaceRef.current = null;
             }
        };
    }
  }, [editorMode, defineBlocks]);

  // Load Script Content into Workspace
  useEffect(() => {
      if (editorMode === 'visual' && workspaceRef.current && selected) {
          workspaceRef.current.clear(); // Clear existing blocks
          
          if (selected.blockXml) {
              try {
                  const xml = Blockly.utils.xml.textToDom(selected.blockXml);
                  Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
              } catch (e) {
                  console.error("Failed to load blocks", e);
              }
          }
      }
  }, [selectedScriptId, editorMode]); 

  // Save XML before switching scripts or unmounting
  // We use a separate effect that runs when selectedScriptId changes, capturing the *previous* state is hard.
  // Instead, we trust the user to hit "Apply" or we autosave on change events.
  // For this prototype, we'll auto-save XML to the state on every change event in the INIT effect if we wanted, 
  // but to avoid lag, we'll save on specific actions or debounce.
  // Let's implement a "Save Visual State" on unmount of the specific script ID is tricky.
  // Simplest approach: Update the state when `generatedCode` changes, but that's text.
  // We will hook the `workspaceChangeListener` to update a Ref, and sync that Ref to state.

  const saveWorkspaceToState = () => {
      if (workspaceRef.current && selected) {
          const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
          const xmlText = Blockly.utils.xml.domToText(xml);
          updateScript(selected.id, { blockXml: xmlText });
      }
  };
  
  // Hook into blur or id change to save? 
  // For simplicity in this demo, we save when clicking "Apply" or switching tabs manually in the UI.
  // But let's add a manual "Save Blocks" or ensure it saves when you click "Apply to Script".

  const snippets = [
      { label: 'Set Scope (Year)', code: "cube.scope.year = '2024'" },
      { label: 'Get Value', code: "val = cube.account['Sales']" },
      { label: 'Set Value', code: "cube.account['Profit'] = 100" },
      { label: 'Save Data', code: "cube.save()" },
      { label: 'Dimension Loop', code: "for entity in cube.entity.members:\n    pass" }
  ];

  const handleSnippetClick = (code: string) => {
      // Copy to clipboard
      navigator.clipboard.writeText(code);
      // Optional: Insert into text area if we had a ref to it
      alert("Snippet copied to clipboard");
  };
  
  const handleApplyVisualCode = () => {
      if (workspaceRef.current && selected) {
           const code = Blockly.Python.workspaceToCode(workspaceRef.current);
           const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
           const xmlText = Blockly.utils.xml.domToText(xml);
           
           updateScript(selected.id, { 
               content: code,
               blockXml: xmlText 
           });
           alert("Visual blocks applied to script and saved!");
      }
  };

  return (
    <div className="flex flex-col h-full bg-white">
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
            <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                    <button 
                        onClick={() => {
                            if (editorMode === 'visual') saveWorkspaceToState();
                            setEditorMode('code');
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${editorMode === 'code' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Code className="w-3.5 h-3.5" /> Code
                    </button>
                    <button 
                        onClick={() => setEditorMode('visual')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${editorMode === 'visual' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Blocks className="w-3.5 h-3.5" /> Visual
                    </button>
                </div>
                <div className="h-6 w-px bg-gray-300 mx-2"></div>
                <div>
                    <h1 className="font-bold text-gray-800 text-sm leading-none">{selected?.name || 'Untitled'}</h1>
                    <span className="text-[10px] text-gray-500 font-mono">
                        {editorMode === 'visual' ? 'Blockly Visual Builder' : 'Python SDK v2.0'}
                    </span>
                </div>
            </div>
            <div className="flex gap-3">
                <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition-colors">
                    <Settings className="w-3.5 h-3.5" /> Env Config
                </button>
                <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition-colors">
                    <BookOpen className="w-3.5 h-3.5" /> SDK Docs
                </button>
                <button className="px-4 py-1.5 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 shadow-sm transition-colors">
                    <Play className="w-3.5 h-3.5" /> Run & Test
                </button>
            </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Left: Script Explorer - Fixed Width */}
            <div className="w-[260px] border-r border-gray-200 flex flex-col bg-gray-50/50 shrink-0">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                     <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider">Explorer</span>
                     <button className="text-gray-400 hover:text-blue-600">+</button>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {scripts.map(s => (
                        <div 
                            key={s.id}
                            onClick={() => {
                                if (editorMode === 'visual') saveWorkspaceToState();
                                setSelectedScriptId(s.id);
                            }}
                            className={`group p-2.5 mb-1 rounded-md cursor-pointer flex items-center gap-3 transition-all
                            ${selectedScriptId === s.id ? 'bg-white text-blue-700 shadow-sm ring-1 ring-gray-200' : 'hover:bg-gray-100 text-gray-700'}`}
                        >
                            <FileText className={`w-4 h-4 ${selectedScriptId === s.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-xs truncate">{s.name}</div>
                                <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${s.triggerType === 'Calculation' ? 'bg-blue-400' : 'bg-orange-400'}`}></span>
                                    {s.triggerType}
                                </div>
                            </div>
                            {selectedScriptId === s.id && <ChevronRight className="w-3 h-3 text-blue-400" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Center: Editor Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {selected ? (
                    <>
                         {/* File Info Bar */}
                         <div className="flex items-center bg-[#1e1e1e] border-b border-black shrink-0">
                             <div className="px-4 py-2 bg-[#252526] text-gray-200 text-xs border-t-2 border-blue-500 flex items-center gap-2">
                                 <span className="font-mono">{selected.name}.py</span>
                                 {editorMode === 'visual' && <span className="ml-2 text-[10px] bg-blue-900 text-blue-200 px-1 rounded">Visual Mode</span>}
                             </div>
                        </div>

                        {editorMode === 'visual' ? (
                             // Visual Blockly Editor
                             <div className="flex-1 relative w-full h-full bg-gray-100">
                                 <div ref={blocklyDiv} className="absolute inset-0 w-full h-full" />
                             </div>
                        ) : (
                            // Text Editor
                            <div className="flex-1 relative bg-[#1e1e1e] flex">
                                <div className="w-12 bg-[#1e1e1e] text-[#858585] text-right pr-3 pt-4 font-mono text-xs select-none border-r border-[#333] shrink-0">
                                    1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>10<br/>11
                                </div>
                                <textarea 
                                    value={selected.content}
                                    onChange={(e) => updateScript(selected.id, { content: e.target.value })}
                                    className="flex-1 h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed custom-scrollbar"
                                    spellCheck="false"
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 bg-gray-100 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <Code className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>No script selected</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Snippets or Generated Code - Fixed Width */}
            <div className="w-[280px] border-l border-gray-200 bg-white flex flex-col shrink-0 z-0 transition-all">
                {editorMode === 'visual' ? (
                    // Generated Code Preview
                    <>
                        <div className="px-4 py-3 border-b border-gray-200 font-semibold text-xs text-gray-500 uppercase flex items-center justify-between bg-gray-50">
                            <div className="flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 text-green-600" /> Live Preview
                            </div>
                        </div>
                        <div className="flex-1 bg-[#1e1e1e] p-4 overflow-y-auto custom-scrollbar">
                            <pre className="font-mono text-xs text-green-400 whitespace-pre-wrap break-all">
                                {generatedCode || "# Drag blocks to generate code..."}
                            </pre>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                             <button 
                                onClick={handleApplyVisualCode}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
                            >
                                <ArrowRight className="w-4 h-4" /> Save & Sync
                             </button>
                             <p className="text-[10px] text-gray-500 mt-2 text-center leading-tight">
                                This will save the blocks and overwrite the Python script with the generated code.
                             </p>
                        </div>
                    </>
                ) : (
                    // Code Snippets
                    <>
                        <div className="px-4 py-3 border-b border-gray-200 font-semibold text-xs text-gray-500 uppercase flex items-center gap-2 bg-gray-50">
                            <Braces className="w-4 h-4" /> SDK Reference
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {snippets.map((snip, idx) => (
                                <div key={idx} className="group relative p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all bg-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-xs font-bold text-gray-700">{snip.label}</div>
                                        <button 
                                            onClick={() => handleSnippetClick(snip.code)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Copy Code"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="text-[10px] font-mono text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 overflow-x-auto whitespace-pre-wrap break-all">
                                        {snip.code}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                            <p className="font-semibold text-gray-700 mb-1">Documentation Helper</p>
                            <p>Use <code className="bg-gray-200 px-1 rounded">Ctrl+Space</code> for auto-completion in the editor.</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    </div>
  );
};

export default ScriptEditor;
