import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { workflowAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
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
    // This would come from the workflow definition in a real app
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
    <div className="min-h-screen bg-[#0B1120]">
      <Sidebar />
      <div className="ml-64 max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Workflows</h1>
              <p className="text-gray-400">Manage and monitor your automation workflows</p>
            </div>
            <button
              onClick={() => navigate("/workflows/create")}
              className="bg-[#6366F1] hover:bg-[#5558E3] text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Workflow
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-10 w-10 text-[#6366F1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : workflows.length === 0 ? (
          <div className="text-center py-12 bg-[#111827] rounded-xl border border-gray-800">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 mb-4">No workflows yet</p>
            <button
              onClick={() => navigate("/workflows/create")}
              className="text-[#6366F1] hover:text-[#5558E3] font-medium"
            >
              Create your first workflow
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6 hover:border-[#6366F1] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{getTriggerIcon(workflow.trigger_type)}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{workflow.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{workflow.description || "No description"}</p>
                    </div>
                  </div>
                  <StatusBadge status={workflow.status} />
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Trigger</p>
                  <p className="text-sm text-gray-300 capitalize">{workflow.trigger_type.replace(/_/g, " ")}</p>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Steps</p>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    {getStepsPreview(workflow).map((step, index) => (
                      <span key={index} className="flex items-center">
                        <span className="bg-gray-800 px-2 py-1 rounded">{step}</span>
                        {index < getStepsPreview(workflow).length - 1 && (
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <p className="text-xs text-gray-500">
                    Created {new Date(workflow.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/workflows/${workflow.id}`)}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => runWorkflow(workflow.id)}
                      className="px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Run
                    </button>
                    <button
                      onClick={() => deleteWorkflow(workflow.id)}
                      className="px-4 py-2 bg-gray-800 hover:bg-red-600/20 hover:text-red-400 text-gray-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Workflows;
