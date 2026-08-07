import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { workflowAPI } from "../services/api";
import StatusBadge from "../components/StatusBadge";

function Workflows() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadWorkflows() {
      try {
        const response = await workflowAPI.getAll();
        setWorkflows(response.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Failed to load workflows");
      } finally {
        setLoading(false);
      }
    }

    loadWorkflows();
  }, []);

  async function runWorkflow(workflowId) {
    try {
      const { executionAPI } = await import("../services/api");
      const response = await executionAPI.run(workflowId, {
        triggerData: { source: "workflows_page", message: "Triggered from workflows list" },
      });
      navigate(`/executions/${response.data.execution.id}`);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to run workflow");
    }
  }

  async function deleteWorkflow(workflowId) {
    if (!confirm("Are you sure you want to delete this workflow?")) return;
    
    try {
      await workflowAPI.delete(workflowId);
      setWorkflows(workflows.filter(w => w.id !== workflowId));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete workflow");
    }
  }

  const getTriggerIcon = (triggerType) => {
    const icons = {
      manual: "⚡",
      github_issue_created: "🐛",
      github_pr_opened: "🔀",
      gmail_received: "📧",
      notion_updated: "📝",
    };
    return icons[triggerType] || "⚡";
  };

  const getStepsPreview = (workflow) => {
    const steps = {
      manual: ["Manual Trigger", "HTTP Request", "Delay"],
      github_issue_created: ["GitHub Issue", "Create Notion Page", "Send Notification"],
      github_pr_opened: ["GitHub PR", "Run Tests", "Post to Slack"],
      gmail_received: ["New Email", "Filter", "Forward"],
      notion_updated: ["Notion Update", "Sync to Database", "Trigger Webhook"],
    };
    return steps[workflow.trigger_type] || ["Trigger", "Action", "Complete"];
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Workflows</h1>
          <p className="page-subtitle">Manage and monitor your automation workflows</p>
        </div>
        <button
          onClick={() => navigate("/workflows/create")}
          className="btn-primary"
        >
          ➕ Create Workflow
        </button>
      </div>

      {error && (
        <div className="badge badge-error" style={{ padding: '12px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <div className="badge badge-info">Loading workflows...</div>
        </div>
      ) : workflows.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No workflows yet</h3>
          <p>Create your first workflow to get started with automation.</p>
          <button className="btn-primary" onClick={() => navigate("/workflows/create")}>
            Create Workflow
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {workflows.map((workflow) => (
            <div key={workflow.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    fontSize: '24px',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--border-radius-md)'
                  }}>
                    {getTriggerIcon(workflow.trigger_type)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>{workflow.name}</h3>
                    <p style={{ color: 'var(--text-tertiary)', marginTop: '4px' }}>{workflow.description || "No description"}</p>
                  </div>
                </div>
                <StatusBadge status={workflow.status} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', padding: '16px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Trigger</div>
                  <div style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{workflow.trigger_type.replace(/_/g, " ")}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Steps</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {getStepsPreview(workflow).map((step, index) => (
                      <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{step}</span>
                        {index < getStepsPreview(workflow).length - 1 && <span style={{ color: 'var(--text-tertiary)' }}>→</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  Created {new Date(workflow.created_at).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn-secondary" onClick={() => navigate(`/workflows/${workflow.id}`)}>View</button>
                  <button className="btn-primary" onClick={() => runWorkflow(workflow.id)}>▶ Run</button>
                  <button className="btn-secondary" style={{ color: 'var(--status-error)' }} onClick={() => deleteWorkflow(workflow.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Workflows;
