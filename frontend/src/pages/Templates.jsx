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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="ml-64 max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Workflow Templates</h1>
          <p className="text-gray-600 dark:text-gray-400">Start with pre-built workflows and customize them to your needs</p>
        </div>

        <div className="mb-8">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 ${template.color} rounded-xl flex items-center justify-center text-3xl shadow-lg`}>
                  {template.icon}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    template.popularity === "High"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : template.popularity === "Medium"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {template.popularity} Popularity
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {template.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {template.description}
              </p>

              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Workflow Steps:</p>
                <div className="space-y-2">
                  {template.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className={`w-6 h-6 rounded-full ${template.color} flex items-center justify-center text-xs font-bold`}>
                        {index + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Category: {template.category}
                </span>
                <button
                  onClick={() => useTemplate(template.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
