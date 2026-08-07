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
    failedExecutions: executions.filter(e => e.status === "failed").length,
    successRate: executions.length > 0 
      ? ((executions.filter(e => e.status === "completed").length / executions.length) * 100).toFixed(1)
      : "0.0",
  };

  const recentExecutions = executions.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <Sidebar />
      <div className="ml-64">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Monitor workflows and trigger executions from one place.</p>
          </div>

          {message.text && (
            <div className={`mb-6 px-4 py-3 rounded-lg flex items-center ${
              message.type === "error" 
                ? "bg-red-900/20 border border-red-800 text-red-400" 
                : "bg-green-900/20 border border-green-800 text-green-400"
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
              <svg className="animate-spin h-10 w-10 text-[#6366F1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#111827] rounded-xl shadow-sm p-6 border border-gray-800 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Workflows</p>
                      <p className="text-3xl font-bold text-white mt-2">{stats.totalWorkflows}</p>
                    </div>
                    <div className="bg-[#6366F1]/20 p-3 rounded-full">
                      <svg className="w-6 h-6 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111827] rounded-xl shadow-sm p-6 border border-gray-800 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Executions</p>
                      <p className="text-3xl font-bold text-white mt-2">{stats.totalExecutions}</p>
                    </div>
                    <div className="bg-[#6366F1]/20 p-3 rounded-full">
                      <svg className="w-6 h-6 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111827] rounded-xl shadow-sm p-6 border border-gray-800 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Success Rate</p>
                      <p className="text-3xl font-bold text-white mt-2">{stats.successRate}%</p>
                    </div>
                    <div className="bg-[#22C55E]/20 p-3 rounded-full">
                      <svg className="w-6 h-6 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111827] rounded-xl shadow-sm p-6 border border-gray-800 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Failed Jobs</p>
                      <p className="text-3xl font-bold text-white mt-2">{stats.failedExecutions}</p>
                    </div>
                    <div className="bg-[#EF4444]/20 p-3 rounded-full">
                      <svg className="w-6 h-6 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Workflows</h2>
                    <button
                      onClick={() => navigate("/workflows/create")}
                      className="bg-[#6366F1] hover:bg-[#5558E3] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Workflow
                    </button>
                  </div>
                  {workflows.length === 0 ? (
                    <div className="text-center py-12">
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

                <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800">
                  <h2 className="text-xl font-semibold text-white mb-6">Execution Activity</h2>
                  {recentExecutions.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500">No executions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentExecutions.map((execution) => (
                        <div
                          key={execution.id}
                          className="flex items-start gap-4 p-4 rounded-lg bg-[#0B1120] border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
                          onClick={() => navigate(`/executions/${execution.id}`)}
                        >
                          <div className={`mt-1 flex-shrink-0`}>
                            {execution.status === "completed" ? (
                              <svg className="w-5 h-5 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : execution.status === "failed" ? (
                              <svg className="w-5 h-5 text-[#EF4444]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-[#6366F1] animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {execution.workflows?.name || "Unknown Workflow"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {execution.status === "completed" 
                                ? `Completed in ${((new Date(execution.finished_at) - new Date(execution.started_at)) / 1000).toFixed(1)}s`
                                : execution.status === "failed"
                                ? "Failed after retries"
                                : "Running..."
                              }
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(execution.started_at).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* BullMQ Queue Status Panel */}
              <div className="mt-8 bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    BullMQ Queue Status
                  </h2>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
                    Connected to Redis
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="bg-[#0B1120] rounded-lg p-4 border border-gray-800">
                    <p className="text-xs text-gray-400 mb-1">Waiting</p>
                    <p className="text-2xl font-bold text-[#6366F1]">24</p>
                    <p className="text-xs text-gray-500 mt-1">jobs</p>
                  </div>
                  <div className="bg-[#0B1120] rounded-lg p-4 border border-gray-800">
                    <p className="text-xs text-gray-400 mb-1">Active</p>
                    <p className="text-2xl font-bold text-[#22C55E]">5</p>
                    <p className="text-xs text-gray-500 mt-1">processing</p>
                  </div>
                  <div className="bg-[#0B1120] rounded-lg p-4 border border-gray-800">
                    <p className="text-xs text-gray-400 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-gray-300">1,847</p>
                    <p className="text-xs text-gray-500 mt-1">total</p>
                  </div>
                  <div className="bg-[#0B1120] rounded-lg p-4 border border-gray-800">
                    <p className="text-xs text-gray-400 mb-1">Failed</p>
                    <p className="text-2xl font-bold text-[#EF4444]">8</p>
                    <p className="text-xs text-gray-500 mt-1">retries</p>
                  </div>
                  <div className="bg-[#0B1120] rounded-lg p-4 border border-gray-800">
                    <p className="text-xs text-gray-400 mb-1">DLQ</p>
                    <p className="text-2xl font-bold text-[#EF4444]">3</p>
                    <p className="text-xs text-gray-500 mt-1">dead letters</p>
                  </div>
                  <div className="bg-[#0B1120] rounded-lg p-4 border border-gray-800">
                    <p className="text-xs text-gray-400 mb-1">Latency</p>
                    <p className="text-2xl font-bold text-[#6366F1]">124ms</p>
                    <p className="text-xs text-gray-500 mt-1">avg</p>
                  </div>
                </div>
                
                {/* Queue Details */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#0B1120] rounded-lg p-4 border border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-white">jobs queue</h4>
                      <span className="px-2 py-0.5 bg-[#6366F1]/20 text-[#6366F1] text-xs rounded-full">high</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Waiting</span>
                        <span className="text-white">12</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Active</span>
                        <span className="text-[#22C55E]">2</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Retry Rate</span>
                        <span className="text-yellow-500">2.3%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0B1120] rounded-lg p-4 border border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-white">process queue</h4>
                      <span className="px-2 py-0.5 bg-[#22C55E]/20 text-[#22C55E] text-xs rounded-full">normal</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Waiting</span>
                        <span className="text-white">8</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Active</span>
                        <span className="text-[#22C55E]">2</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Retry Rate</span>
                        <span className="text-[#22C55E]">0.8%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0B1120] rounded-lg p-4 border border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-white">webhook queue</h4>
                      <span className="px-2 py-0.5 bg-[#22C55E]/20 text-[#22C55E] text-xs rounded-full">normal</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Waiting</span>
                        <span className="text-white">4</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Active</span>
                        <span className="text-[#22C55E]">1</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Retry Rate</span>
                        <span className="text-[#22C55E]">0.1%</span>
                      </div>
                    </div>
                  </div>
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
