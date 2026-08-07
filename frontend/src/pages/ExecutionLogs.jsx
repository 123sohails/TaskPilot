import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { executionAPI } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import Navbar from "../components/Navbar";

const ExecutionLogs = () => {
  const { id } = useParams();
  const [execution, setExecution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Execution Details</h1>
          <p className="text-gray-600">View detailed execution logs and results</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Execution ID</h3>
              <p className="text-gray-600">{execution.id}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
              <StatusBadge status={execution.status} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow</h3>
              <p className="text-gray-600">{execution.workflows?.name || "Unknown"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Started At</h3>
              <p className="text-gray-600">
                {new Date(execution.started_at).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Finished At</h3>
              <p className="text-gray-600">
                {execution.finished_at
                  ? new Date(execution.finished_at).toLocaleString()
                  : "Not finished"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Logs</h3>
          <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
              {execution.logs ? JSON.stringify(JSON.parse(execution.logs), null, 2) : "No logs available"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionLogs;
