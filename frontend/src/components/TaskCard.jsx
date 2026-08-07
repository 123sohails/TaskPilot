import StatusBadge from "./StatusBadge";

const TaskCard = ({ workflow, onRun, onDelete }) => {
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

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius-md)',
      padding: '24px',
      transition: 'all var(--transition-fast)'
    }}
    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '12px',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '20px'
          }}>
            {getTriggerIcon(workflow.trigger_type)}
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{workflow.name}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{workflow.description || "No description"}</p>
          </div>
        </div>
        <StatusBadge status={workflow.status} />
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingTop: '16px', 
        borderTop: '1px solid var(--border-color)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>🔗</span>
            {workflow.trigger_type}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>📅</span>
            {new Date(workflow.created_at).toLocaleDateString()}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => onRun(workflow.id)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '14px' }}>
            ▶ Run
          </button>
          <button onClick={() => onDelete(workflow.id)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '14px', color: 'var(--status-error)' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
