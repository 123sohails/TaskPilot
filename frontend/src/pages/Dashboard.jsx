import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { workflowAPI, executionAPI } from "../services/api";
import TaskCard from "../components/TaskCard";

function Dashboard() {
  const [workflows, setWorkflows] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [workflowResponse, executionResponse] = await Promise.all([
          workflowAPI.getAll(),
          executionAPI.getAll(),
        ]);

        setWorkflows(workflowResponse.data || []);
        setExecutions(executionResponse.data || []);
      } catch (error) {
        setMessage({ type: "error", text: error?.response?.data?.message || error?.message || "Unable to load dashboard data" });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function runWorkflow(workflowId) {
    try {
      const response = await executionAPI.run(workflowId, {
        triggerData: { source: "dashboard", message: "Triggered from the UI" },
      });

      setMessage({ type: "success", text: `Execution started: ${response.data.execution.id}` });
      const executionResponse = await executionAPI.getAll();
      setExecutions(executionResponse.data || []);
    } catch (error) {
      setMessage({ type: "error", text: error?.response?.data?.message || error?.message || "Execution failed" });
    }
  }

  async function deleteWorkflow(workflowId) {
    try {
      await workflowAPI.delete(workflowId);
      setMessage({ type: "success", text: "Workflow deleted successfully" });
      const workflowResponse = await workflowAPI.getAll();
      setWorkflows(workflowResponse.data || []);
    } catch (error) {
      setMessage({ type: "error", text: error?.response?.data?.message || error?.message || "Failed to delete workflow" });
    }
  }

  const stats = {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.status === "active").length,
    totalExecutions: executions.length,
    successfulExecutions: executions.filter(e => e.status === "completed").length,
    failedExecutions: executions.filter(e => e.status === "failed").length,
    successRate: executions.length > 0 
      ? ((executions.filter(e => e.status === "completed").length / executions.length) * 100).toFixed(1)
      : "0.0",
  };

  const recentExecutions = executions.slice(0, 5);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Monitor workflows and trigger executions from one place.</p>
        </div>
      </div>

      {message.text && (
        <div className={`badge ${message.type === 'error' ? 'badge-error' : 'badge-success'}`} style={{ padding: '12px', fontSize: '14px' }}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <div className="badge badge-info">Loading dashboard data...</div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {/* Stat Cards */}
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>Workflows</div>
                <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>{stats.totalWorkflows}</div>
              </div>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--accent-primary)', fontSize: '24px' }}>
                ⚡
              </div>
            </div>

            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>Executions</div>
                <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>{stats.totalExecutions}</div>
              </div>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--status-info)', fontSize: '24px' }}>
                🏃
              </div>
            </div>

            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>Success Rate</div>
                <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>{stats.successRate}%</div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--status-success)', fontSize: '24px' }}>
                ✅
              </div>
            </div>

            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>Failed Jobs</div>
                <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>{stats.failedExecutions}</div>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--status-error)', fontSize: '24px' }}>
                ❌
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Workflows</h2>
                <button className="btn-primary" onClick={() => navigate("/workflows/create")}>
                  ➕ Create Workflow
                </button>
              </div>
              <div style={{ padding: '24px', flex: 1 }}>
                {workflows.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h3>No workflows yet</h3>
                    <p>Create your first workflow to automate your tasks.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {workflows.map((workflow) => (
                      <TaskCard
                        key={workflow.id}
                        workflow={workflow}
                        onRun={runWorkflow}
                        onDelete={deleteWorkflow}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Execution Activity</h2>
              </div>
              <div style={{ padding: '24px', flex: 1 }}>
                {recentExecutions.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">⏱️</div>
                    <p>No executions yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentExecutions.map((execution) => (
                      <div
                        key={execution.id}
                        onClick={() => navigate(`/executions/${execution.id}`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--border-radius-md)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)' }}
                      >
                        <div style={{ fontSize: '20px' }}>
                          {execution.status === "completed" ? "✅" : execution.status === "failed" ? "❌" : "⏳"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {execution.workflows?.name || "Unknown Workflow"}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                            {execution.status === "completed" 
                              ? `Completed in ${((new Date(execution.finished_at) - new Date(execution.started_at)) / 1000).toFixed(1)}s`
                              : execution.status === "failed"
                              ? "Failed after retries"
                              : "Running..."
                            }
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          {new Date(execution.started_at).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600 }}>BullMQ Queue Status</h2>
                <div className="badge badge-success">Connected to Redis</div>
             </div>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Waiting</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-primary)' }}>24</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Active</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--status-success)' }}>5</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Completed</div>
                  <div style={{ fontSize: '24px', fontWeight: 700 }}>1,847</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Failed (Retries)</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--status-error)' }}>8</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Dead Letters</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--status-error)' }}>3</div>
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
