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
      manual: "bg-[#6366F1]/20 text-[#6366F1]",
      github_issue_created: "bg-purple-500/20 text-purple-500",
      github_pr_opened: "bg-blue-500/20 text-blue-500",
      gmail_received: "bg-red-500/20 text-red-500",
      notion_updated: "bg-gray-500/20 text-gray-400",
    };
    return colors[triggerType] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6 hover:border-[#6366F1] transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${getTriggerColor(workflow.trigger_type)}`}>
            {getTriggerIcon(workflow.trigger_type)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{workflow.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{workflow.description || "No description"}</p>
          </div>
        </div>
        <StatusBadge status={workflow.status} />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {workflow.trigger_type}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(workflow.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRun(workflow.id)}
            className="px-3 py-1.5 bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Run
          </button>
          <button
            onClick={() => onDelete(workflow.id)}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
