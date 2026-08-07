import { useEffect, useState } from "react";
import { workflowAPI, executionAPI } from "../services/api";
import TaskCard from "../components/TaskCard";
import ExecutionTable from "../components/ExecutionTable";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [workflows, setWorkflows] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
        setMessage(error?.response?.data?.message || error?.message || "Unable to load dashboard data");
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

      setMessage(`Execution started: ${response.data.execution.id}`);
      const executionResponse = await executionAPI.getAll();
      setExecutions(executionResponse.data || []);
    } catch (error) {
      setMessage(error?.response?.data?.message || error?.message || "Execution failed");
    }
  }

  async function deleteWorkflow(workflowId) {
    try {
      await workflowAPI.delete(workflowId);
      setMessage("Workflow deleted successfully");
      const workflowResponse = await workflowAPI.getAll();
      setWorkflows(workflowResponse.data || []);
    } catch (error) {
      setMessage(error?.response?.data?.message || error?.message || "Failed to delete workflow");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Monitor workflows and trigger executions from one place.</p>
        </div>

        {message && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Workflows</h2>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : workflows.length === 0 ? (
              <p className="text-gray-600">No workflows yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Executions</h2>
            <ExecutionTable executions={executions} onViewDetails={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
