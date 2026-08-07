import StatusBadge from "./StatusBadge";

const TaskCard = ({ workflow, onRun, onDelete }) => {
  const getTriggerIcon = (triggerType) => {
    const icons = {
      manual: "⚡",
      github_issue_created: "🐛",
      github_pr_opened: "🔀",
      gmail_received: "📧",
      notion_updated: "📝",
    };
    return icons[triggerType] || "⚡";
  };

  const getTriggerColor = (triggerType) => {
    const colors = {
      manual: "bg-yellow-100 text-yellow-700",
      github_issue_created: "bg-purple-100 text-purple-700",
      github_pr_opened: "bg-blue-100 text-blue-700",
      gmail_received: "bg-red-100 text-red-700",
      notion_updated: "bg-gray-100 text-gray-700",
    };
    return colors[triggerType] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${getTriggerColor(workflow.trigger_type)}`}>
            {getTriggerIcon(workflow.trigger_type)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{workflow.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {workflow.trigger_type.replace(/_/g, " ")}
            </p>
          </div>
        </div>
        <StatusBadge status={workflow.status} />
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
        {workflow.description || "No description provided"}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(workflow.created_at).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {new Date(workflow.updated_at).toLocaleDateString()}
        </span>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onRun(workflow.id)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Run
        </button>
        <button
          onClick={() => onDelete(workflow.id)}
          className="bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
