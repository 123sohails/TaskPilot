import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: '1',
      type: 'input',
      data: { 
        label: (
          <div className="flex items-center gap-2">
            <span>Trigger</span>
            <span className="px-2 py-0.5 bg-[#6366F1]/20 text-[#6366F1] text-xs rounded-full">Webhook</span>
          </div>
        )
      },
      position: { x: 250, y: 0 },
      style: {
        background: '#6366F1',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '600',
        width: 200,
      },
    },
    {
      id: '2',
      data: { 
        label: (
          <div className="flex flex-col gap-1">
            <span>HTTP Request</span>
            <span className="text-xs text-gray-400">Retry: 3x • Backoff: 1s</span>
          </div>
        )
      },
      position: { x: 250, y: 100 },
      style: {
        background: '#111827',
        color: '#fff',
        border: '1px solid #374151',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px',
        width: 200,
      },
    },
    {
      id: '3',
      data: { 
        label: (
          <div className="flex flex-col gap-1">
            <span>Process Data</span>
            <span className="text-xs text-[#22C55E]">Idempotent ✓</span>
          </div>
        )
      },
      position: { x: 250, y: 200 },
      style: {
        background: '#111827',
        color: '#fff',
        border: '1px solid #374151',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px',
        width: 200,
      },
    },
    {
      id: '4',
      type: 'output',
      data: { 
        label: (
          <div className="flex items-center gap-2">
            <span>Webhook</span>
            <span className="px-2 py-0.5 bg-[#22C55E]/20 text-[#22C55E] text-xs rounded-full">POST</span>
          </div>
        )
      },
      position: { x: 250, y: 300 },
      style: {
        background: '#22C55E',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '600',
        width: 200,
      },
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#6366F1', strokeWidth: 2 }, label: 'Queue: jobs', labelStyle: { fill: '#9CA3AF', fontSize: 10 } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#6366F1', strokeWidth: 2 }, label: 'Queue: process', labelStyle: { fill: '#9CA3AF', fontSize: 10 } },
    { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#6366F1', strokeWidth: 2 }, label: 'Queue: webhook', labelStyle: { fill: '#9CA3AF', fontSize: 10 } },
  ]);

  const [showConfig, setShowConfig] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setShowConfig(true);
  }, []);

  const addNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      data: { 
        label: (
          <div className="flex flex-col gap-1">
            <span>New Step</span>
            <span className="text-xs text-gray-400">Queue: default</span>
          </div>
        )
      },
      position: { x: 250, y: nodes.length * 100 + 100 },
      style: {
        background: '#111827',
        color: '#fff',
        border: '1px solid #374151',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px',
        width: 200,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="w-full h-[600px] bg-[#0B1120] rounded-xl border border-gray-800 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        style={{ background: '#0B1120' }}
      >
        <Controls style={{ background: '#111827', border: '1px solid #374151' }} />
        <MiniMap 
          style={{ 
            background: '#111827', 
            border: '1px solid #374151',
            height: 120,
            width: 200,
          }}
          nodeColor="#6366F1"
          maskColor="rgba(0, 0, 0, 0.5)"
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#374151" />
      </ReactFlow>
      
      {/* Distributed Workflow Info Panel */}
      <div className="absolute top-4 left-4 bg-[#111827] border border-gray-800 rounded-lg p-4 w-64">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          BullMQ Status
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Waiting Jobs</span>
            <span className="text-[#6366F1] font-medium">12</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Active Jobs</span>
            <span className="text-[#22C55E] font-medium">3</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Completed</span>
            <span className="text-gray-300 font-medium">847</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Failed (DLQ)</span>
            <span className="text-[#EF4444] font-medium">2</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Retries</span>
            <span className="text-yellow-500 font-medium">5</span>
          </div>
        </div>
      </div>

      {/* Node Configuration Panel */}
      {showConfig && selectedNode && (
        <div className="absolute top-4 right-4 bg-[#111827] border border-gray-800 rounded-lg p-4 w-80 max-h-[500px] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-white">Node Configuration</h4>
            <button onClick={() => setShowConfig(false)} className="text-gray-400 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            {/* Queue Configuration */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium">Queue Configuration</label>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Queue Name</label>
                  <input 
                    type="text" 
                    defaultValue="default" 
                    className="w-full bg-[#0B1120] border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:border-[#6366F1] focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="dlq" defaultChecked className="rounded bg-gray-700 border-gray-600" />
                  <label htmlFor="dlq" className="text-xs text-gray-300">Enable Dead Letter Queue</label>
                </div>
              </div>
            </div>

            {/* Retry Policy */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium">Retry Policy</label>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Retry Attempts</label>
                  <input 
                    type="number" 
                    defaultValue={3} 
                    className="w-full bg-[#0B1120] border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:border-[#6366F1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Backoff Strategy</label>
                  <select className="w-full bg-[#0B1120] border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:border-[#6366F1] focus:outline-none">
                    <option value="exponential">Exponential</option>
                    <option value="fixed">Fixed</option>
                    <option value="linear">Linear</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Initial Backoff (ms)</label>
                  <input 
                    type="number" 
                    defaultValue={1000} 
                    className="w-full bg-[#0B1120] border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:border-[#6366F1] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Idempotency */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium">Idempotency</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="idempotent" defaultChecked className="rounded bg-gray-700 border-gray-600" />
                  <label htmlFor="idempotent" className="text-xs text-gray-300">Enable Idempotency</label>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Idempotency Key</label>
                  <input 
                    type="text" 
                    placeholder="e.g., {{workflow.id}}-{{step.id}}" 
                    className="w-full bg-[#0B1120] border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:border-[#6366F1] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Webhook Configuration */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Webhook Configuration
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="webhook-enabled" defaultChecked className="rounded bg-gray-700 border-gray-600" />
                  <label htmlFor="webhook-enabled" className="text-xs text-gray-300">Enable Webhook</label>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Webhook URL</label>
                  <input 
                    type="url" 
                    placeholder="https://api.example.com/webhook" 
                    className="w-full bg-[#0B1120] border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:border-[#6366F1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Method</label>
                  <select className="w-full bg-[#0B1120] border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:border-[#6366F1] focus:outline-none">
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Headers (JSON)</label>
                  <textarea 
                    rows={2}
                    placeholder='{"Authorization": "Bearer token"}'
                    className="w-full bg-[#0B1120] border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:border-[#6366F1] focus:outline-none font-mono"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="webhook-retry" defaultChecked className="rounded bg-gray-700 border-gray-600" />
                  <label htmlFor="webhook-retry" className="text-xs text-gray-300">Retry on failure</label>
                </div>
              </div>
            </div>

            {/* Timeout Configuration */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium">Timeout</label>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Job Timeout (ms)</label>
                <input 
                  type="number" 
                  defaultValue={30000} 
                  className="w-full bg-[#0B1120] border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:border-[#6366F1] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={addNode}
          className="bg-[#6366F1] hover:bg-[#5558E3] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Step
        </button>
        <button
          className="bg-[#22C55E] hover:bg-[#1DA64A] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Deploy
        </button>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
