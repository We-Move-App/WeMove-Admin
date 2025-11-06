interface StatusBadgeProps {
  status?: string; // allow undefined
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  // console.log("StatusBadge received:", status);
  if (!status) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
        Unknown
      </span>
    );
  }

  // console.log("StatusBadge input:", JSON.stringify(status));

  // const getStatusClass = () => {
  //   const statusLower = status.toLowerCase().trim();
  //   if (
  //     ["approved", "active", "completed", "confirmed"].includes(statusLower)
  //   ) {
  //     return "bg-green-100 text-green-800";
  //   }
  //   if (statusLower === "paid") {
  //     return "bg-green-100 text-green-800";
  //   }
  //   if (["pending", "submitted", "upcoming", "booked"].includes(statusLower)) {
  //     return "bg-yellow-100 text-yellow-800";
  //   }
  //   if (["rejected", "blocked", "cancelled", "failed"].includes(statusLower)) {
  //     return "bg-red-100 text-red-800";
  //   }
  //   if (["processing", "in progress"].includes(statusLower)) {
  //     return "bg-blue-100 text-blue-800";
  //   }
  //   return "bg-gray-100 text-gray-800";
  // };
  const getStatusClass = () => {
    const statusLower = status?.toString().trim().toLowerCase();

    if (
      [
        "approved",
        "active",
        "completed",
        "confirmed",
        "paid",
        "success",
      ].includes(statusLower)
    ) {
      return "bg-green-100 text-green-800";
    }
    if (["pending", "submitted", "upcoming", "booked"].includes(statusLower)) {
      return "bg-yellow-100 text-yellow-800";
    }
    if (["rejected", "blocked", "cancelled", "failed"].includes(statusLower)) {
      return "bg-red-100 text-red-800";
    }
    if (["processing", "in progress"].includes(statusLower)) {
      return "bg-blue-100 text-blue-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
