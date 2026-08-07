import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { executionAPI } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import Sidebar from "../components/Sidebar";

const ExecutionLogs = () => {
  const { id } = useParams();
  const [execution, setExecution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadExecution() {
      try {
        const response = await executionAPI.getById(id);
        setExecution(response.data);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Failed to load execution");
      } finally {
        setLoading(false);
      }
    }

    loadExecution();
  }, [id]);

  const handleRefresh = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await executionAPI.getById(id);
      setExecution(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to refresh execution");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120]">
        <Sidebar />
        <div className="ml-64 max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-10 w-10 text-[#6366F1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1120]">
        <Sidebar />
        <div className="ml-64 max-w-7xl mx-auto px-8 py-8">
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  const duration = execution.finished_at
    ? new Date(execution.finished_at) - new Date(execution.started_at)
    : null;

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <Sidebar />
      <div className="ml-64 max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Execution Details</h1>
              <p className="text-gray-400">View detailed execution logs and results</p>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Execution ID</p>
                <p className="text-lg font-bold text-white mt-1 font-mono text-sm">{execution.id.slice(0, 8)}...</p>
              </div>
              <div className="bg-[#6366F1]/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Status</p>
                <div className="mt-1">
                  <StatusBadge status={execution.status} />
                </div>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Duration</p>
                <p className="text-lg font-bold text-white mt-1">
                  {duration ? `${(duration / 1000).toFixed(2)}s` : "Running..."}
                </p>
              </div>
              <div className="bg-[#22C55E]/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Workflow Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Workflow Name</p>
                <p className="text-white font-semibold mt-1">{execution.workflows?.name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Trigger Type</p>
                <p className="text-white mt-1 capitalize">{execution.workflows?.trigger_type || "Unknown"}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Timeline</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Started At</p>
                <p className="text-white mt-1">{new Date(execution.started_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Finished At</p>
                <p className="text-white mt-1">
                  {execution.finished_at
                    ? new Date(execution.finished_at).toLocaleString()
                    : "Not finished"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-6">Execution Timeline</h3>
          <div className="space-y-4">
            {execution.logs && JSON.parse(execution.logs).steps ? (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800"></div>
                
                {JSON.parse(execution.logs).steps.map((step, index) => (
                  <div
                    key={index}
                    className="relative flex items-start gap-4 pb-6 last:pb-0"
                  >
                    {/* Timeline dot */}
                    <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      step.status === 'success'
                        ? 'bg-[#22C55E] border-[#22C55E]'
                        : step.status === 'failed'
                        ? 'bg-[#EF4444] border-[#EF4444]'
                        : 'bg-[#6366F1] border-[#6366F1] animate-pulse'
                    }`}>
                      {step.status === 'success' ? (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : step.status === 'failed' ? (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                    </div>

                    {/* Retry indicators */}
                    {step.retries > 0 && (
                      <div className="absolute left-2 top-8 flex flex-col gap-1">
                        {Array.from({ length: step.retries }).map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                        ))}
                      </div>
                    )}

                    {/* Step content */}
                    <div className="flex-1 min-w-0 bg-[#0B1120] border border-gray-800 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-white">{step.name}</p>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              step.queue === 'jobs' ? 'bg-[#6366F1]/20 text-[#6366F1]' :
                              step.queue === 'process' ? 'bg-purple-500/20 text-purple-500' :
                              step.queue === 'webhook' ? 'bg-[#22C55E]/20 text-[#22C55E]' :
                              'bg-gray-700 text-gray-400'
                            }`}>
                              Queue: {step.queue || 'default'}
                            </span>
                            {step.idempotent && (
                              <span className="px-2 py-0.5 bg-[#22C55E]/20 text-[#22C55E] text-xs rounded-full flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Idempotent
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{step.description || 'No description'}</p>
                        </div>
                        <div className="text-right ml-4">
                          <span className="text-xs text-gray-500">{step.duration || 'N/A'}</span>
                          {step.retries > 0 && (
                            <div className="text-xs text-yellow-500 mt-1">
                              {step.retries} retry{step.retries > 1 ? 'ies' : ''}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* BullMQ Job State */}
                      <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-800">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            step.jobState === 'waiting' ? 'bg-[#6366F1]' :
                            step.jobState === 'active' ? 'bg-[#22C55E] animate-pulse' :
                            step.jobState === 'completed' ? 'bg-[#22C55E]' :
                            step.jobState === 'failed' ? 'bg-[#EF4444]' :
                            'bg-gray-500'
                          }`}></div>
                          <span className="text-xs text-gray-400 capitalize">{step.jobState || 'completed'}</span>
                        </div>
                        {step.attemptsMade && (
                          <div className="text-xs text-gray-500">
                            Attempt {step.attemptsMade}/{step.maxAttempts || 3}
                          </div>
                        )}
                        {step.jobId && (
                          <div className="text-xs text-gray-500 font-mono">
                            Job: {step.jobId.slice(0, 8)}...
                          </div>
                        )}
                      </div>

                      {/* Response */}
                      {step.response && (
                        <div className="bg-[#0B1120] p-3 rounded border border-gray-800">
                          <p className="text-xs text-gray-500 mb-1">Response:</p>
                          <pre className="text-xs text-[#22C55E] font-mono overflow-x-auto">
                            {typeof step.response === 'string' ? step.response : JSON.stringify(step.response, null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* Error if failed */}
                      {step.status === 'failed' && step.error && (
                        <div className="mt-3 bg-[#EF4444]/10 border border-[#EF4444]/30 p-3 rounded">
                          <p className="text-xs text-[#EF4444] mb-1">Error:</p>
                          <p className="text-xs text-[#EF4444] font-mono">{step.error}</p>
                          {step.sentToDLQ && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-[#EF4444]">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Sent to Dead Letter Queue
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No step details available</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Queue Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0B1120] rounded-lg p-4 border border-gray-800">
              <p className="text-xs text-gray-400 mb-1">Total Jobs</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
            <div className="bg-[#0B1120] rounded-lg p-4 border border-gray-800">
              <p className="text-xs text-gray-400 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-[#22C55E]">98.5%</p>
            </div>
            <div className="bg-[#0B1120] rounded-lg p-4 border border-gray-800">
              <p className="text-xs text-gray-400 mb-1">Avg Latency</p>
              <p className="text-2xl font-bold text-[#6366F1]">245ms</p>
            </div>
            <div className="bg-[#0B1120] rounded-lg p-4 border border-gray-800">
              <p className="text-xs text-gray-400 mb-1">DLQ Size</p>
              <p className="text-2xl font-bold text-[#EF4444]">12</p>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Execution Logs</h3>
            <button
              onClick={() => {
                if (execution.logs) {
                  navigator.clipboard.writeText(JSON.stringify(JSON.parse(execution.logs), null, 2));
                }
              }}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
          </div>
          <div className="bg-[#0B1120] p-4 rounded-lg overflow-x-auto">
            <pre className="text-[#22C55E] text-sm font-mono">
              {execution.logs ? JSON.stringify(JSON.parse(execution.logs), null, 2) : "No logs available"}
            </pre>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate("/tasks")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionLogs;
