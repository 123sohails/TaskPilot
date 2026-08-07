import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { executionAPI } from "../services/api";
import ExecutionTable from "../components/ExecutionTable";

function Tasks() {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadExecutions() {
      try {
        const response = await executionAPI.getAll();
        setExecutions(response.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Failed to load executions");
      } finally {
        setLoading(false);
      }
    }

    loadExecutions();
  }, []);

  const filteredExecutions = executions.filter((execution) => {
    if (filter === "all") return true;
    return execution.status === filter;
  });

  const stats = {
    total: executions.length,
    pending: executions.filter(e => e.status === "pending").length,
    running: executions.filter(e => e.status === "running").length,
    completed: executions.filter(e => e.status === "completed").length,
    failed: executions.filter(e => e.status === "failed").length,
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await executionAPI.getAll();
      setExecutions(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to refresh executions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Task Executions</h1>
          <p className="page-subtitle">Track and manage all your workflow executions</p>
        </div>
      </div>

      {error && (
        <div className="badge badge-error" style={{ padding: '12px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>Total</div>
            <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>{stats.total}</div>
          </div>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--accent-primary)', fontSize: '24px' }}>
            📊
          </div>
        </div>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>Pending</div>
            <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>{stats.pending}</div>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--status-warning)', fontSize: '24px' }}>
            ⏳
          </div>
        </div>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>Completed</div>
            <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>{stats.completed}</div>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--status-success)', fontSize: '24px' }}>
            ✅
          </div>
        </div>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>Failed</div>
            <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>{stats.failed}</div>
          </div>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--status-error)', fontSize: '24px' }}>
            ❌
          </div>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Execution History</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>Filter:</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="input-field"
                style={{ width: '150px', padding: '8px 12px' }}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <button className="btn-secondary" onClick={handleRefresh} disabled={loading}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <div className="badge badge-info">Loading executions...</div>
          </div>
        ) : (
          <ExecutionTable executions={filteredExecutions} onViewDetails={(id) => navigate(`/executions/${id}`)} />
        )}
      </div>
    </div>
  );
}

export default Tasks;
