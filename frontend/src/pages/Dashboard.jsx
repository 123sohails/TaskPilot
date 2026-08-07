import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { workflowAPI, executionAPI } from "../services/api";
import TaskCard from "../components/TaskCard";
import ExecutionTable from "../components/ExecutionTable";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [workflows, setWorkflows] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [workflowResponse, executionResponse] = await Promise.all([
          workflowAPI.getAll(),
          executionAPI.getAll(),
        ]);

        setWorkflows(workflowResponse.data || []);
        setExecutions(executionResponse.data || []);
      } catch (error) {
        setMessage({ type: "error", text: error?.response?.data?.message || error?.message || "Unable to load dashboard data" });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function runWorkflow(workflowId) {
    try {
      const response = await executionAPI.run(workflowId, {
        triggerData: { source: "dashboard", message: "Triggered from the UI" },
      });

      setMessage({ type: "success", text: `Execution started: ${response.data.execution.id}` });
      const executionResponse = await executionAPI.getAll();
      setExecutions(executionResponse.data || []);
    } catch (error) {
      setMessage({ type: "error", text: error?.response?.data?.message || error?.message || "Execution failed" });
    }
  }

  async function deleteWorkflow(workflowId) {
    try {
      await workflowAPI.delete(workflowId);
      setMessage({ type: "success", text: "Workflow deleted successfully" });
      const workflowResponse = await workflowAPI.getAll();
      setWorkflows(workflowResponse.data || []);
    } catch (error) {
      setMessage({ type: "error", text: error?.response?.data?.message || error?.message || "Failed to delete workflow" });
    }
  }

  const stats = {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.status === "active").length,
    totalExecutions: executions.length,
    successfulExecutions: executions.filter(e => e.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="ml-64">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor workflows and trigger executions from one place.</p>
          </div>

          {message.text && (
            <div className={`mb-6 px-4 py-3 rounded-lg flex items-center ${
              message.type === "error" 
                ? "bg-red-50 border border-red-200 text-red-700" 
                : "bg-green-50 border border-green-200 text-green-700"
            }`}>
              {message.type === "error" ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Workflows</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalWorkflows}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Workflows</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.activeWorkflows}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Executions</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalExecutions}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Successful</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.successfulExecutions}</p>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Workflows</h2>
                    <button
                      onClick={() => navigate("/workflows/create")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Workflow
                    </button>
                  </div>
                  {workflows.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-gray-500 mb-4">No workflows yet</p>
                      <button
                        onClick={() => navigate("/workflows/create")}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Create your first workflow
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {workflows.map((workflow) => (
                        <TaskCard
                          key={workflow.id}
                          workflow={workflow}
                          onRun={runWorkflow}
                          onDelete={deleteWorkflow}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Executions</h2>
                  <ExecutionTable executions={executions} onViewDetails={(id) => navigate(`/executions/${id}`)} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
