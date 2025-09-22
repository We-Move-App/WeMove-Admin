import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  X,
  Check,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  User,
} from "lucide-react";
import { Notification } from "@/types/admin";

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onMarkAsRead,
  onClearAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTypeIcon = (type: Notification["type"]) => {
    const iconProps = { size: 16 };
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500" {...iconProps} />;
      case "error":
        return <AlertCircle className="text-red-500" {...iconProps} />;
      case "warning":
        return <AlertTriangle className="text-yellow-500" {...iconProps} />;
      default:
        return <Info className="text-blue-500" {...iconProps} />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      {/* <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-900"
      > */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 transform transition-all duration-200 ease-out">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              Notifications
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto pb-2">
            {notifications.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <Bell className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-50 last:border-b-0 ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      {/* <img
                        src={notification.image}
                        alt="Notification"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                      /> */}
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
                        <User className="text-gray-500" size={24} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(notification.type)}
                          <h4 className="text-sm font-semibold text-gray-800 truncate">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTimeAgo(new Date(notification.timestamp))}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 flex items-center space-x-1"
                        >
                          <Check size={12} />
                          <span>Mark as read</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {/* {notifications.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 rounded-b-xl">
              <button className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200">
                View all notifications
              </button>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
