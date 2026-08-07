const StatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status) {
      case "active":
      case "completed":
        return "badge-success";
      case "inactive":
        return "badge-info";
      case "pending":
      case "running":
        return "badge-warning";
      case "failed":
        return "badge-error";
      default:
        return "";
    }
  };

  return (
    <span className={`badge ${getStatusClass()}`}>
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;
