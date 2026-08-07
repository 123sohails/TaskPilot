import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { workflowAPI } from "../services/api";
import Navbar from "../components/Navbar";

const WorkflowCreate = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    trigger_type: "manual",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await workflowAPI.create(formData);
      navigate(`/workflows/${response.data.id}`);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to create workflow");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Workflow</h1>
          <p className="text-gray-600">Design a new automation workflow</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Workflow Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g., GitHub Issue to Notion"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe what this workflow does"
              />
            </div>

            <div>
              <label
                htmlFor="trigger_type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Trigger Type
              </label>
              <select
                id="trigger_type"
                name="trigger_type"
                value={formData.trigger_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="manual">Manual Trigger</option>
                <option value="github_issue_created">GitHub Issue Created</option>
                <option value="github_pr_opened">GitHub PR Opened</option>
                <option value="gmail_received">Gmail Received</option>
                <option value="notion_updated">Notion Page Updated</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Workflow"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md"
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
