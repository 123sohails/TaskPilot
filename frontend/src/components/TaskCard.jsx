import StatusBadge from "./StatusBadge";

const TaskCard = ({ workflow, onRun, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
        <StatusBadge status={workflow.status} />
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {workflow.description || "No description"}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>Trigger: {workflow.trigger_type}</span>
        <span>
          {new Date(workflow.created_at).toLocaleDateString()}
        </span>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onRun(workflow.id)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Run Workflow
        </button>
        <button
          onClick={() => onDelete(workflow.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
