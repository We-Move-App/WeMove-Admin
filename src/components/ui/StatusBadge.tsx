import { useTranslation } from "react-i18next";

interface StatusBadgeProps {
  status?: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useTranslation();

  if (!status) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
        {t("status.unknown")}
      </span>
    );
  }

  const statusLower = status.toString().trim().toLowerCase();

  const getStatusClass = () => {
    if (
      ["approved", "active", "completed", "confirmed", "paid", "success"].includes(
        statusLower
      )
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
      {t(`status.${statusLower}`)}
    </span>
  );
};

export default StatusBadge;
