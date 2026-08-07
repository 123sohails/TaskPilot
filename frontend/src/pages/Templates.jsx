import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Templates = () => {
  const navigate = useNavigate();

  const templates = [
    {
      id: 1,
      name: "GitHub Issue to Notion",
      icon: "🐙",
      description: "Automatically create Notion pages when new GitHub issues are created",
      category: "Development",
      popularity: "High",
      steps: ["GitHub Issue Created", "Create Notion Page", "Add Issue Details"],
    },
    {
      id: 2,
      name: "Gmail to Slack",
      icon: "📧",
      description: "Forward important emails to Slack channels for team collaboration",
      category: "Communication",
      popularity: "High",
      steps: ["New Gmail Received", "Filter by Subject", "Post to Slack Channel"],
    },
    {
      id: 3,
      name: "Notion to Google Sheets",
      icon: "📊",
      description: "Sync Notion database entries to Google Sheets for analysis",
      category: "Productivity",
      popularity: "Medium",
      steps: ["Notion Page Updated", "Extract Data", "Update Google Sheet"],
    },
    {
      id: 4,
      name: "GitHub PR to Discord",
      icon: "🎮",
      description: "Notify Discord channels when pull requests are opened or merged",
      category: "Development",
      popularity: "Medium",
      steps: ["GitHub PR Opened", "Get PR Details", "Send Discord Message"],
    },
    {
      id: 5,
      name: "Daily Email Digest",
      icon: "📅",
      description: "Compile daily tasks from multiple sources into one email",
      category: "Productivity",
      popularity: "Low",
      steps: ["Schedule Trigger", "Fetch Tasks", "Send Email Digest"],
    },
    {
      id: 6,
      name: "Social Media Auto-Post",
      icon: "📱",
      description: "Automatically post content across multiple social platforms",
      category: "Marketing",
      popularity: "High",
      steps: ["Content Created", "Format for Platform", "Auto-Post"],
    },
  ];

  const categories = ["All", "Development", "Communication", "Productivity", "Marketing"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTemplates = selectedCategory === "All" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const useTemplate = (templateId) => {
    navigate("/workflows/create");
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Workflow Templates</h1>
          <p className="page-subtitle">Start with pre-built templates to automate common workflows</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', borderRadius: '999px', fontSize: '14px' }}
          >
            {category}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {filteredTemplates.map((template) => (
          <div key={template.id} className="card hover-glow" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ fontSize: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>{template.icon}</div>
              <span className={`badge ${
                template.popularity === "High" ? "badge-success" :
                template.popularity === "Medium" ? "badge-warning" : "badge-error"
              }`}>
                {template.popularity}
              </span>
            </div>
            
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {template.name}
            </h3>
            
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', flex: 1 }}>
              {template.description}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                {template.steps.length} steps • {template.category}
              </span>
              <button
                onClick={() => useTemplate(template.id)}
                className="btn-primary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
