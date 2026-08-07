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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="ml-64 max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Integrations</h1>
          <p className="text-gray-600 dark:text-gray-400">Connect your favorite apps and services to automate your workflows</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 ${integration.color} rounded-xl flex items-center justify-center text-3xl shadow-lg`}>
                  {integration.icon}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    integration.status === "connected"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {integration.status === "connected" ? "Connected" : "Not Connected"}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {integration.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {integration.description}
              </p>

              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Features:</p>
                <div className="flex flex-wrap gap-2">
                  {integration.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <button
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  integration.status === "connected"
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {integration.status === "connected" ? "Configure" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Integrations;
