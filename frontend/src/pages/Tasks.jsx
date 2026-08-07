import { useEffect, useState } from "react";
import { executionAPI } from "../services/api";
import ExecutionTable from "../components/ExecutionTable";
import Navbar from "../components/Navbar";

function Tasks() {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExecutions() {
      try {
        const response = await executionAPI.getAll();
        setExecutions(response.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadExecutions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-600">Execution history from the backend is shown here so you can track workflow progress.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <ExecutionTable executions={executions} onViewDetails={() => {}} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
