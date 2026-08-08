import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
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

  const removeNode = () => {
    if (!selectedNode || selectedNode.data.step_type === 'trigger') return;
    
    const nodeIdToRemove = selectedNode.id;
    
    // Remove the node
    setNodes((nds) => nds.filter((node) => node.id !== nodeIdToRemove));
    
    // Remove any edges connected to this node
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeIdToRemove && edge.target !== nodeIdToRemove));
    
    // Close the config panel
    setShowConfig(false);
    setSelectedNode(null);
  };

  const updateNodeType = (type) => {
    let defaultLabel = 'New Step';
    let defaultConfig = {};
    
    if (type === 'http_request') {
      defaultLabel = 'HTTP Request';
      defaultConfig = { url: '', method: 'GET' };
    } else if (type === 'ai_summarize') {
      defaultLabel = 'AI Summarize';
      defaultConfig = { text: '' };
    } else if (type === 'github_create_issue') {
      defaultLabel = 'GitHub Issue';
      defaultConfig = { owner: '', repo: '', title: '', body: '' };
    } else if (type === 'gmail_send') {
      defaultLabel = 'Send Email';
      defaultConfig = { to: '', subject: '', body: '' };
    } else if (type === 'notion_create_page') {
      defaultLabel = 'Notion Page';
      defaultConfig = { databaseId: '', title: '', content: '' };
    }

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              step_type: type,
              config: defaultConfig,
              label: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>{defaultLabel}</span>
                  <span style={{ fontSize: '10px', color: '#9ca3af' }}>Configure settings</span>
                </div>
              )
            }
          };
          setSelectedNode(updatedNode); // keep local state in sync
          return updatedNode;
        }
        return node;
      })
    );
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
          setSelectedNode(updatedNode);
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
            <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Configure Step</h4>
            <button type="button" onClick={() => setShowConfig(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '20px' }}>×</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="flex-col gap-2">
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Integration Type</label>
              <select 
                className="input-field" 
                value={selectedNode.data.step_type}
                onChange={(e) => updateNodeType(e.target.value)}
              >
                <option value="http_request">HTTP Request</option>
                <option value="ai_summarize">🤖 AI Summarize</option>
                <option value="github_create_issue">🐙 GitHub: Create Issue</option>
                <option value="gmail_send">📧 Gmail: Send Email</option>
                <option value="notion_create_page">📓 Notion: Create Page</option>
              </select>
            </div>
            
            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />

            {selectedNode.data.step_type === 'http_request' && (
              <>
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
              </>
            )}

            {selectedNode.data.step_type === 'ai_summarize' && (
              <div className="flex-col gap-2">
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Text to Summarize</label>
                <textarea 
                  className="input-field" 
                  rows={4}
                  placeholder="Paste text or use variables..." 
                  value={selectedNode.data.config?.text || ''}
                  onChange={(e) => updateNodeConfig('text', e.target.value)}
                />
              </div>
            )}

            {selectedNode.data.step_type === 'github_create_issue' && (
              <>
                <div className="flex-col gap-2">
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Repository Owner</label>
                  <input 
                    type="text" className="input-field" placeholder="e.g. facebook" 
                    value={selectedNode.data.config?.owner || ''} onChange={(e) => updateNodeConfig('owner', e.target.value)}
                  />
                </div>
                <div className="flex-col gap-2">
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Repository Name</label>
                  <input 
                    type="text" className="input-field" placeholder="e.g. react" 
                    value={selectedNode.data.config?.repo || ''} onChange={(e) => updateNodeConfig('repo', e.target.value)}
                  />
                </div>
                <div className="flex-col gap-2">
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Issue Title</label>
                  <input 
                    type="text" className="input-field" placeholder="Bug in login form" 
                    value={selectedNode.data.config?.title || ''} onChange={(e) => updateNodeConfig('title', e.target.value)}
                  />
                </div>
                <div className="flex-col gap-2">
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Issue Body</label>
                  <textarea 
                    className="input-field" rows={3} placeholder="Describe the issue..." 
                    value={selectedNode.data.config?.body || ''} onChange={(e) => updateNodeConfig('body', e.target.value)}
                  />
                </div>
              </>
            )}

            {selectedNode.data.step_type === 'gmail_send' && (
              <>
                <div className="flex-col gap-2">
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>To Address</label>
                  <input 
                    type="email" className="input-field" placeholder="user@example.com" 
                    value={selectedNode.data.config?.to || ''} onChange={(e) => updateNodeConfig('to', e.target.value)}
                  />
                </div>
                <div className="flex-col gap-2">
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Subject</label>
                  <input 
                    type="text" className="input-field" placeholder="Workflow Alert" 
                    value={selectedNode.data.config?.subject || ''} onChange={(e) => updateNodeConfig('subject', e.target.value)}
                  />
                </div>
                <div className="flex-col gap-2">
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Email Body</label>
                  <textarea 
                    className="input-field" rows={4} placeholder="Hello, this is an automated message." 
                    value={selectedNode.data.config?.body || ''} onChange={(e) => updateNodeConfig('body', e.target.value)}
                  />
                </div>
              </>
            )}

            {selectedNode.data.step_type === 'notion_create_page' && (
              <>
                <div className="flex-col gap-2">
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Database ID</label>
                  <input 
                    type="text" className="input-field" placeholder="abc123def456..." 
                    value={selectedNode.data.config?.databaseId || ''} onChange={(e) => updateNodeConfig('databaseId', e.target.value)}
                  />
                </div>
                <div className="flex-col gap-2">
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Page Title</label>
                  <input 
                    type="text" className="input-field" placeholder="New Task" 
                    value={selectedNode.data.config?.title || ''} onChange={(e) => updateNodeConfig('title', e.target.value)}
                  />
                </div>
                <div className="flex-col gap-2">
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Content Block</label>
                  <textarea 
                    className="input-field" rows={3} placeholder="Page content..." 
                    value={selectedNode.data.config?.content || ''} onChange={(e) => updateNodeConfig('content', e.target.value)}
                  />
                </div>
              </>
            )}

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button 
                type="button" 
                onClick={removeNode}
                style={{ 
                  width: '100%', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', 
                  color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', 
                  borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              >
                🗑️ Remove Step
              </button>
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
