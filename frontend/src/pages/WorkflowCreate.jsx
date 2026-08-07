import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { workflowAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
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
    
    if (!formData.name.trim()) {
      newErrors.name = "Workflow name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Workflow name must be at least 3 characters";
    } else if (formData.name.length > 100) {
      newErrors.name = "Workflow name must be less than 100 characters";
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await workflowAPI.create(formData);
      navigate("/");
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
    <div className="min-h-screen bg-[#0B1120]">
      <Sidebar />
      <div className="ml-64 max-w-4xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Workflow</h1>
          <p className="text-gray-400">Design a new automation workflow to streamline your tasks</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div className="bg-[#111827] rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Workflow Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                  errors.name
                    ? "border-red-700 focus:ring-red-500 bg-[#0B1120] text-white"
                    : "border-gray-700 focus:ring-[#6366F1] bg-[#0B1120] text-white"
                }`}
                placeholder="e.g., GitHub Issue to Notion"
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none ${
                  errors.description
                    ? "border-red-700 focus:ring-red-500 bg-[#0B1120] text-white"
                    : "border-gray-700 focus:ring-[#6366F1] bg-[#0B1120] text-white"
                }`}
                placeholder="Describe what this workflow does and what it automates"
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-red-400">{errors.description}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">{formData.description.length}/500 characters</p>
            </div>

            <div>
              <label
                htmlFor="trigger_type"
                className="block text-sm font-medium text-gray-400 mb-4"
              >
                Trigger Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {triggerOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.trigger_type === option.value
                        ? "border-[#6366F1] bg-[#6366F1]/10"
                        : "border-gray-800 hover:border-gray-700 bg-[#0B1120]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="trigger_type"
                      value={option.value}
                      checked={formData.trigger_type === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">{option.icon}</span>
                      <div>
                        <h3 className="font-semibold text-white">{option.label}</h3>
                        <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                      </div>
                    </div>
                    {formData.trigger_type === option.value && (
                      <div className="absolute top-4 right-4">
                        <svg className="w-5 h-5 text-[#6366F1]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="workflow_builder"
                className="block text-sm font-medium text-gray-400 mb-4"
              >
                Workflow Builder
              </label>
              <WorkflowBuilder />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Workflow...
                  </span>
                ) : (
                  "Create Workflow"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-3 border border-gray-700 rounded-xl text-gray-400 font-medium hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkflowCreate;
