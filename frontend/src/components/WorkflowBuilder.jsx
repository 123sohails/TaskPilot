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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Trigger</span>
            <span style={{ padding: '2px 8px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontSize: '10px', borderRadius: '999px' }}>Webhook</span>
          </div>
        )
      },
      position: { x: 250, y: 0 },
      style: {
        background: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '600',
        width: 200,
        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
      },
    },
    {
      id: '2',
      data: { 
        label: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>HTTP Request</span>
            <span style={{ fontSize: '10px', color: '#9ca3af' }}>Retry: 3x • Backoff: 1s</span>
          </div>
        )
      },
      position: { x: 250, y: 100 },
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>Process Data</span>
            <span style={{ fontSize: '10px', color: '#34d399' }}>Idempotent ✓</span>
          </div>
        )
      },
      position: { x: 250, y: 200 },
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Webhook</span>
            <span style={{ padding: '2px 8px', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', fontSize: '10px', borderRadius: '999px' }}>POST</span>
          </div>
        )
      },
      position: { x: 250, y: 300 },
      style: {
        background: '#059669',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '600',
        width: 200,
        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)'
      },
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#818cf8', strokeWidth: 2 }, label: 'Queue: jobs', labelStyle: { fill: '#9CA3AF', fontSize: 10 } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#818cf8', strokeWidth: 2 }, label: 'Queue: process', labelStyle: { fill: '#9CA3AF', fontSize: 10 } },
    { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#818cf8', strokeWidth: 2 }, label: 'Queue: webhook', labelStyle: { fill: '#9CA3AF', fontSize: 10 } },
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>New Step</span>
            <span style={{ fontSize: '10px', color: '#9ca3af' }}>Queue: default</span>
          </div>
        )
      },
      position: { x: 250, y: nodes.length * 100 + 100 },
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px',
        width: 200,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ width: '100%', height: '600px', background: '#030712', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        style={{ background: '#030712' }}
      >
        <Controls style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)' }} />
        <MiniMap 
          style={{ 
            background: '#111827', 
            border: '1px solid rgba(255,255,255,0.1)',
            height: 120,
            width: 200,
          }}
          nodeColor="#6366F1"
          maskColor="rgba(0, 0, 0, 0.5)"
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="rgba(255,255,255,0.1)" />
      </ReactFlow>
      
      {/* Configuration Panel overlay */}
      {showConfig && selectedNode && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '320px',
          background: 'rgba(17, 24, 39, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '20px',
          maxHeight: 'calc(100% - 32px)',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Node Configuration</h4>
            <button onClick={() => setShowConfig(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '20px' }}>×</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="flex-col gap-2">
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Queue Name</label>
              <input type="text" className="input-field" defaultValue="default" />
            </div>
            
            <div className="flex-col gap-2">
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Retry Policy</label>
              <input type="number" className="input-field" defaultValue={3} />
            </div>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              Enable Dead Letter Queue
            </label>
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '12px' }}>
        <button onClick={addNode} className="btn-secondary">
          ➕ Add Step
        </button>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
