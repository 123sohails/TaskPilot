import { useState } from "react";
import Sidebar from "../components/Sidebar";
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
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      id: 2,
      name: "Gmail to Slack",
      icon: "📧",
      description: "Forward important emails to Slack channels for team collaboration",
      category: "Communication",
      popularity: "High",
      steps: ["New Gmail Received", "Filter by Subject", "Post to Slack Channel"],
      color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    },
    {
      id: 3,
      name: "Notion to Google Sheets",
      icon: "📊",
      description: "Sync Notion database entries to Google Sheets for analysis",
      category: "Productivity",
      popularity: "Medium",
      steps: ["Notion Page Updated", "Extract Data", "Update Google Sheet"],
      color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    {
      id: 4,
      name: "GitHub PR to Discord",
      icon: "🎮",
      description: "Notify Discord channels when pull requests are opened or merged",
      category: "Development",
      popularity: "Medium",
      steps: ["GitHub PR Opened", "Get PR Details", "Send Discord Message"],
      color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    },
    {
      id: 5,
      name: "Daily Email Digest",
      icon: "📅",
      description: "Compile daily tasks from multiple sources into one email",
      category: "Productivity",
      popularity: "Low",
      steps: ["Schedule Trigger", "Fetch Tasks", "Send Email Digest"],
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      id: 6,
      name: "Social Media Auto-Post",
      icon: "📱",
      description: "Automatically post content across multiple social platforms",
      category: "Marketing",
      popularity: "High",
      steps: ["Content Created", "Format for Platform", "Auto-Post"],
      color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
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
    <div className="min-h-screen bg-[#0B1120]">
      <Sidebar />
      <div className="ml-64 max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Workflow Templates</h1>
          <p className="text-gray-400">Start with pre-built templates to automate common workflows</p>
        </div>

        <div className="mb-8">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[#6366F1] text-white"
                    : "bg-[#111827] text-gray-400 hover:bg-gray-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6 hover:border-[#6366F1] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{template.icon}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  template.popularity === "High"
                    ? "bg-[#22C55E]/20 text-[#22C55E]"
                    : template.popularity === "Medium"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-[#EF4444]/20 text-[#EF4444]"
                }`}>
                  {template.popularity}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{template.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <span className="text-xs text-gray-500">{template.steps.length} steps • {template.category}</span>
                <button
                  onClick={() => useTemplate(template.id)}
                  className="bg-[#6366F1] hover:bg-[#5558E3] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;
