import StatusBadge from "./StatusBadge";

const ExecutionTable = ({ executions, onViewDetails }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-[#111827] rounded-lg shadow-sm border border-gray-800">
        <thead className="bg-gray-800/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Workflow
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Started
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Finished
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {executions && executions.length > 0 ? (
            executions.map((execution) => (
              <tr key={execution.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                  {execution.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                  {execution.workflows?.name || "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={execution.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(execution.started_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {execution.finished_at
                    ? new Date(execution.finished_at).toLocaleString()
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(execution.id)}
                    className="text-[#6366F1] hover:text-[#5558E3] font-medium transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-12 text-center text-sm text-gray-500"
              >
                No executions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExecutionTable;
