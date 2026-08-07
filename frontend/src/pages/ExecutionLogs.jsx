import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { executionAPI } from "../services/api";
import StatusBadge from "../components/StatusBadge";

const ExecutionLogs = () => {
  const { id } = useParams();
  const [execution, setExecution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadExecution() {
      try {
        const response = await executionAPI.getById(id);
        setExecution(response.data);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Failed to load execution");
      } finally {
        setLoading(false);
      }
    }

    loadExecution();
  }, [id]);

  const handleRefresh = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await executionAPI.getById(id);
      setExecution(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to refresh execution");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
        <div className="badge badge-info">Loading execution logs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <div className="badge badge-error">{error}</div>
      </div>
    );
  }

  const duration = execution.finished_at
    ? new Date(execution.finished_at) - new Date(execution.started_at)
    : null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Execution Details</h1>
          <p className="page-subtitle">View detailed execution logs and results</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate("/tasks")} className="btn-secondary">
            ← Back to Tasks
          </button>
          <button onClick={handleRefresh} className="btn-primary">
            🔄 Refresh
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>Execution ID</div>
            <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '8px', fontFamily: 'monospace' }}>{execution.id.slice(0, 8)}...</div>
          </div>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--accent-primary)', fontSize: '24px' }}>
            🆔
          </div>
        </div>

        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>Status</div>
            <div style={{ marginTop: '8px' }}>
              <StatusBadge status={execution.status} />
            </div>
          </div>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--accent-secondary)', fontSize: '24px' }}>
            🚦
          </div>
        </div>

        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>Duration</div>
            <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '8px' }}>
              {duration ? `${(duration / 1000).toFixed(2)}s` : "Running..."}
            </div>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--status-success)', fontSize: '24px' }}>
            ⏱️
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Workflow Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>Workflow Name</div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{execution.workflows?.name || "Unknown"}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>Trigger Type</div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{execution.workflows?.trigger_type || "Unknown"}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>Started At</div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{new Date(execution.started_at).toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>Finished At</div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>
                {execution.finished_at ? new Date(execution.finished_at).toLocaleString() : "Not finished"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Execution Timeline</h3>
        <div style={{ position: 'relative', paddingLeft: '16px' }}>
          {execution.logs && JSON.parse(execution.logs).steps ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ position: 'absolute', left: '32px', top: '0', bottom: '0', width: '2px', background: 'var(--border-color)', zIndex: 0 }}></div>
              {JSON.parse(execution.logs).steps.map((step, index) => (
                <div key={index} style={{ display: 'flex', gap: '24px', position: 'relative', zIndex: 1 }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                    background: step.status === 'success' ? 'var(--status-success)' : step.status === 'failed' ? 'var(--status-error)' : 'var(--accent-primary)',
                    boxShadow: '0 0 0 4px var(--bg-surface)'
                  }}>
                    {step.status === 'success' ? '✓' : step.status === 'failed' ? '✗' : '⚙'}
                  </div>
                  
                  <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{step.name}</h4>
                        <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)' }}>
                          Queue: {step.queue || 'default'}
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{step.duration || 'N/A'}</span>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{step.description || 'No description'}</p>
                    
                    {step.response && (
                      <div style={{ background: 'var(--bg-base)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '12px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Response:</div>
                        <pre style={{ fontSize: '12px', color: 'var(--status-success)', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                          {typeof step.response === 'string' ? step.response : JSON.stringify(step.response, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {step.status === 'failed' && step.error && (
                      <div style={{ background: 'var(--status-error-bg)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', marginTop: '12px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--status-error)', marginBottom: '4px', fontWeight: 600 }}>Error:</div>
                        <pre style={{ fontSize: '12px', color: 'var(--status-error)', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                          {step.error}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '24px' }}>
              <p>No step details available</p>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Raw Execution Logs</h3>
          <button 
            onClick={() => {
              if (execution.logs) {
                navigator.clipboard.writeText(JSON.stringify(JSON.parse(execution.logs), null, 2));
              }
            }}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            📋 Copy Logs
          </button>
        </div>
        <div style={{ background: 'var(--bg-base)', padding: '16px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
          <pre style={{ margin: 0, fontSize: '12px', color: 'var(--status-success)' }}>
            {execution.logs ? JSON.stringify(JSON.parse(execution.logs), null, 2) : "No logs available"}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ExecutionLogs;
