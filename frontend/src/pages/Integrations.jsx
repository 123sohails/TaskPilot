const Integrations = () => {
  const integrations = [
    {
      id: "github",
      name: "GitHub",
      icon: "🐙",
      description: "Connect to GitHub repositories, issues, pull requests, and more",
      status: "connected",
      features: ["Issue tracking", "PR monitoring", "Repository webhooks"],
    },
    {
      id: "notion",
      name: "Notion",
      icon: "📝",
      description: "Integrate with Notion pages, databases, and workspace",
      status: "connected",
      features: ["Page updates", "Database operations", "Content creation"],
    },
    {
      id: "gmail",
      name: "Gmail",
      icon: "📧",
      description: "Connect to Gmail for email automation and processing",
      status: "connected",
      features: ["Email monitoring", "Auto-replies", "Label management"],
    },
    {
      id: "slack",
      name: "Slack",
      icon: "💬",
      description: "Send messages and receive updates in Slack channels",
      status: "disconnected",
      features: ["Message posting", "Channel updates", "File sharing"],
    },
    {
      id: "discord",
      name: "Discord",
      icon: "🎮",
      description: "Automate Discord server actions and bot interactions",
      status: "disconnected",
      features: ["Server management", "Message automation", "Role assignments"],
    },
    {
      id: "google-sheets",
      name: "Google Sheets",
      icon: "📊",
      description: "Read and write data to Google Sheets spreadsheets",
      status: "disconnected",
      features: ["Data sync", "Spreadsheet automation", "Formula execution"],
    },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Integrations</h1>
          <p className="page-subtitle">Connect your favorite apps and services to automate workflows</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {integrations.map((integration) => (
          <div key={integration.id} className="card hover-glow" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ fontSize: '40px' }}>{integration.icon}</div>
              <span className={`badge ${integration.status === 'connected' ? 'badge-success' : 'badge-info'}`}>
                {integration.status === 'connected' ? 'Connected' : 'Connect'}
              </span>
            </div>
            
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {integration.name}
            </h3>
            
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', flex: 1 }}>
              {integration.description}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>Features</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{integration.features.length} available</span>
              </div>
              
              {integration.status === 'connected' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-success)', fontSize: '12px', fontWeight: 500 }}>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Active
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Integrations;
