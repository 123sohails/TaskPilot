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

const WorkflowBuilder = ({ nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange }) => {


  const [showConfig, setShowConfig] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setShowConfig(true);
  }, []);

  const addNode = () => {
    const newId = `${nodes.length + 1}`;
    
    // Add edge linking to previous node if it exists
    if (nodes.length > 0) {
      const prevId = nodes[nodes.length - 1].id;
      setEdges((eds) => [...eds, { 
        id: `e${prevId}-${newId}`, 
        source: prevId, 
        target: newId, 
        animated: true, 
        style: { stroke: '#818cf8', strokeWidth: 2 } 
      }]);
    }

    const newNode = {
      id: newId,
      data: { 
        step_type: 'http_request',
        config: { url: '', method: 'GET' },
        label: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>HTTP Request</span>
            <span style={{ fontSize: '10px', color: '#9ca3af' }}>Configure url and method</span>
          </div>
        )
      },
      position: { x: 250, y: nodes.length * 100 },
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

  const updateNodeConfig = (key, value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              config: {
                ...node.data.config,
                [key]: value
              }
            }
          };
          setSelectedNode(updatedNode); // keep local state in sync
          return updatedNode;
        }
        return node;
      })
    );
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
      {showConfig && selectedNode && selectedNode.data.step_type !== 'trigger' && (
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
            <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Configure HTTP Request</h4>
            <button type="button" onClick={() => setShowConfig(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '20px' }}>×</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="flex-col gap-2">
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Method</label>
              <select 
                className="input-field" 
                value={selectedNode.data.config?.method || 'GET'}
                onChange={(e) => updateNodeConfig('method', e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            
            <div className="flex-col gap-2">
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>URL</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="https://api.example.com/data" 
                value={selectedNode.data.config?.url || ''}
                onChange={(e) => updateNodeConfig('url', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '12px' }}>
        <button type="button" onClick={addNode} className="btn-secondary">
          ➕ Add Step
        </button>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
