import StatusBadge from "./StatusBadge";

const ExecutionTable = ({ executions, onViewDetails }) => {
  return (
    <div className="table-container card" style={{ padding: 0, overflow: 'hidden' }}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Workflow</th>
            <th>Status</th>
            <th>Started</th>
            <th>Finished</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {executions && executions.length > 0 ? (
            executions.map((execution) => (
              <tr key={execution.id}>
                <td style={{ fontFamily: 'monospace' }}>
                  {execution.id.slice(0, 8)}...
                </td>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                  {execution.workflows?.name || "Unknown"}
                </td>
                <td>
                  <StatusBadge status={execution.status} />
                </td>
                <td>
                  {new Date(execution.started_at).toLocaleString()}
                </td>
                <td>
                  {execution.finished_at
                    ? new Date(execution.finished_at).toLocaleString()
                    : "-"}
                </td>
                <td>
                  <button
                    onClick={() => onViewDetails(execution.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 500 }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-tertiary)' }}>
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
