import Sidebar from "../components/Sidebar";

const Integrations = () => {
  const integrations = [
    {
      id: "github",
      name: "GitHub",
      icon: "🐙",
      color: "bg-gray-900",
      description: "Connect to GitHub repositories, issues, pull requests, and more",
      status: "connected",
      features: ["Issue tracking", "PR monitoring", "Repository webhooks"],
    },
    {
      id: "notion",
      name: "Notion",
      icon: "📝",
      color: "bg-gray-800",
      description: "Integrate with Notion pages, databases, and workspace",
      status: "connected",
      features: ["Page updates", "Database operations", "Content creation"],
    },
    {
      id: "gmail",
      name: "Gmail",
      icon: "📧",
      color: "bg-red-500",
      description: "Connect to Gmail for email automation and processing",
      status: "connected",
      features: ["Email monitoring", "Auto-replies", "Label management"],
    },
    {
      id: "slack",
      name: "Slack",
      icon: "💬",
      color: "bg-purple-600",
      description: "Send messages and receive updates in Slack channels",
      status: "disconnected",
      features: ["Message posting", "Channel updates", "File sharing"],
    },
    {
      id: "discord",
      name: "Discord",
      icon: "🎮",
      color: "bg-indigo-600",
      description: "Automate Discord server actions and bot interactions",
      status: "disconnected",
      features: ["Server management", "Message automation", "Role assignments"],
    },
    {
      id: "google-sheets",
      name: "Google Sheets",
      icon: "📊",
      color: "bg-green-600",
      description: "Read and write data to Google Sheets spreadsheets",
      status: "disconnected",
      features: ["Data sync", "Spreadsheet automation", "Formula execution"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <Sidebar />
      <div className="ml-64 max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Integrations</h1>
          <p className="text-gray-400">Connect your favorite apps and services to automate workflows</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-[#111827] rounded-xl shadow-sm border border-gray-800 p-6 hover:border-[#6366F1] transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{integration.icon}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  integration.status === "connected"
                    ? "bg-[#22C55E]/20 text-[#22C55E]"
                    : "bg-gray-700 text-gray-400"
                }`}>
                  {integration.status === "connected" ? "Connected" : "Connect"}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{integration.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{integration.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{integration.category}</span>
                {integration.status === "connected" && (
                  <span className="text-xs text-[#22C55E] flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Active
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Integrations;
