import { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  status?: "increased" | "decreased";
  changeTimeframe?: string;
  iconBgColor?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  status,
  change,
  changeTimeframe = "since last month",
  iconBgColor = "bg-blue-500",
}: StatsCardProps) => {
  return (
    <div className="dashboard-stat-card">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 font-medium">{title}</span>
        <div className={`p-2 rounded-lg ${iconBgColor} text-white`}>{icon}</div>
      </div>
      <div className="dashboard-stat-value">{value}</div>

      {/* {change !== undefined && (
        <div className="mt-2 flex items-center text-sm">
          {change >= 0 ? (
            <span className="flex items-center text-green-600">
              <ArrowUp size={14} className="mr-1" />
              {change}%
            </span>
          ) : (
            <span className="flex items-center text-red-600">
              <ArrowDown size={14} className="mr-1" />
              {Math.abs(change)}%
            </span>
          )}
          <span className="text-gray-500 ml-2">{changeTimeframe}</span>
        </div>
      )} */}
      {change !== undefined && (
        <div className="mt-2 flex items-center text-sm">
          {status === "increased" ? (
            <span className="flex items-center text-green-600">
              <ArrowUp size={14} className="mr-1" />
              {change}%
            </span>
          ) : (
            <span className="flex items-center text-red-600">
              <ArrowDown size={14} className="mr-1" />
              {change}%
            </span>
          )}
          <span className="text-gray-500 ml-2">{changeTimeframe}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
