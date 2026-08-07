import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { executionAPI } from "../services/api";
import ExecutionTable from "../components/ExecutionTable";
import Sidebar from "../components/Sidebar";

function Tasks() {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadExecutions() {
      try {
        const response = await executionAPI.getAll();
        setExecutions(response.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Failed to load executions");
      } finally {
        setLoading(false);
      }
    }

    loadExecutions();
  }, []);

  const filteredExecutions = executions.filter((execution) => {
    if (filter === "all") return true;
    return execution.status === filter;
  });

  const stats = {
    total: executions.length,
    pending: executions.filter(e => e.status === "pending").length,
    running: executions.filter(e => e.status === "running").length,
    completed: executions.filter(e => e.status === "completed").length,
    failed: executions.filter(e => e.status === "failed").length,
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await executionAPI.getAll();
      setExecutions(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to refresh executions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <Sidebar />
      <div className="ml-64 max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Task Executions</h1>
          <p className="text-gray-400">Track and manage all your workflow executions</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
              </div>
              <div className="bg-[#6366F1]/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Pending</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.pending}</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Completed</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.completed}</p>
              </div>
              <div className="bg-[#22C55E]/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Failed</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.failed}</p>
              </div>
              <div className="bg-[#EF4444]/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-xl font-semibold text-white">Execution History</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-400">Filter:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] bg-[#0B1120] text-white text-sm"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="running">Running</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : filteredExecutions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 mb-4">No executions found</p>
              <button
                onClick={() => navigate("/")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Go to Dashboard to run workflows
              </button>
            </div>
          ) : (
            <ExecutionTable executions={filteredExecutions} onViewDetails={(id) => navigate(`/executions/${id}`)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
