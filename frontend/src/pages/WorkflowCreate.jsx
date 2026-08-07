import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { workflowAPI } from "../services/api";
import WorkflowBuilder from "../components/WorkflowBuilder";

const WorkflowCreate = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    trigger_type: "manual",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Workflow name is required";
    else if (formData.name.length < 3) newErrors.name = "Workflow name must be at least 3 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await workflowAPI.create(formData);
      navigate("/workflows");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to create workflow");
    } finally {
      setLoading(false);
    }
  };

  const triggerOptions = [
    { value: "manual", label: "Manual Trigger", icon: "⚡", description: "Trigger manually from the dashboard" },
    { value: "github_issue_created", label: "GitHub Issue Created", icon: "🐛", description: "Trigger when a new issue is created" },
    { value: "github_pr_opened", label: "GitHub PR Opened", icon: "🔀", description: "Trigger when a pull request is opened" },
    { value: "gmail_received", label: "Gmail Received", icon: "📧", description: "Trigger when receiving new emails" },
    { value: "notion_updated", label: "Notion Page Updated", icon: "📝", description: "Trigger when a Notion page is updated" },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Workflow</h1>
          <p className="page-subtitle">Design a new automation workflow to streamline your tasks</p>
        </div>
      </div>

      {error && (
        <div className="badge badge-error" style={{ padding: '12px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="flex-col gap-2">
            <label htmlFor="name" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Workflow Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., GitHub Issue to Notion"
            />
            {errors.name && <span style={{ color: 'var(--status-error)', fontSize: '12px' }}>{errors.name}</span>}
          </div>

          <div className="flex-col gap-2">
            <label htmlFor="description" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input-field"
              style={{ resize: 'vertical' }}
              placeholder="Describe what this workflow does and what it automates"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              {errors.description ? (
                <span style={{ color: 'var(--status-error)' }}>{errors.description}</span>
              ) : <span></span>}
              <span style={{ color: 'var(--text-tertiary)' }}>{formData.description.length}/500</span>
            </div>
          </div>

          <div className="flex-col gap-4">
            <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Trigger Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {triggerOptions.map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '16px',
                    borderRadius: 'var(--border-radius-md)',
                    border: formData.trigger_type === option.value ? '2px solid var(--accent-primary)' : '2px solid var(--border-color)',
                    background: formData.trigger_type === option.value ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <input
                    type="radio"
                    name="trigger_type"
                    value={option.value}
                    checked={formData.trigger_type === option.value}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                  <div style={{ fontSize: '24px' }}>{option.icon}</div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{option.label}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{option.description}</p>
                  </div>
                  {formData.trigger_type === option.value && (
                    <div style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--accent-primary)' }}>✅</div>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="flex-col gap-4">
            <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Workflow Builder
            </label>
            <WorkflowBuilder />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '16px' }}
            >
              {loading ? "Creating..." : "Create Workflow"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/workflows")}
              className="btn-secondary"
              style={{ padding: '12px 24px', fontSize: '16px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkflowCreate;
