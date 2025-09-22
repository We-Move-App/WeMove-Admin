import { useState, useEffect } from "react";
import { Search, Menu, User, LogOut } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useNavigate, Link } from "react-router-dom";
import NotificationDropdown from "@/pages/notifications/NotificationDropdown";
import { getSocket } from "@/utils/socket";
import { Notification } from "@/types/admin";
import axios from "axios";

const Navbar = ({ adminProfile, adminAvatar }) => {
  const navigate = useNavigate();
  const { isOpen, toggleSidebar } = useSidebar();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminProfile")
      ? JSON.parse(localStorage.getItem("adminProfile")!)._id
      : null;

    // 🔹 Fetch old notifications
    const fetchNotifications = async () => {
      try {
        console.log(
          "🔑 AccessToken from localStorage:",
          localStorage.getItem("accessToken")
        );

        const res = await axios.get(
          "http://139.59.20.155:8000/api/v1/notification/admin-get",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (res.data?.data?.notifications) {
          const oldNotifs = res.data.data.notifications.map((n: any) => ({
            id: n._id,
            type: n.type,
            title: n.title,
            message: n.message,
            timestamp: n.createdAt,
            read:
              n.recipients.find((r) => r.adminId === currentAdminId)?.isRead ||
              false,
            image: "/default-avatar.png",
          }));

          setNotifications(oldNotifs);
        }
      } catch (error) {
        console.error("❌ Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    // 🔹 Setup socket connection
    const socket = getSocket();

    socket.on("connect", () => {
      console.log("✅ Connected to admin namespace");
    });

    socket.off("notification:new");
    socket.on("notification:new", (data) => {
      const mappedNotification: Notification = {
        id: data._id,
        type: data.type,
        title: data.title,
        message: data.message,
        timestamp: data.createdAt,
        read:
          data.recipients.find((r) => r.adminId === currentAdminId)?.isRead ||
          false,
        image: "/default-avatar.png",
      };

      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === mappedNotification.id);
        if (exists) return prev;
        return [mappedNotification, ...prev].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected");
    });

    return () => {
      socket.off("notification:new");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  // 🔹 Mark as read (API + local state)
  const handleMarkAsRead = async (id: string) => {
    try {
      await axios.post(
        `http://139.59.20.155:8000/api/v1/notification/admin-read/${id}`,
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("❌ Failed to mark notification as read:", error);
    }
  };

  // 🔹 Clear all (API + local state)
  const handleClearAll = async () => {
    try {
      await axios.delete(
        "http://139.59.20.155:8000/api/v1/notification/admin-clear-all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setNotifications([]);
    } catch (error) {
      console.error("❌ Failed to clear notifications:", error);
    }
  };

  const handleSignOut = () => {
    const socket = getSocket();
    socket.disconnect();
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("adminProfile");
    localStorage.removeItem("adminAvatar");
    navigate("/");
  };

  return (
    <header
      className="bg-white border-b border-gray-200 fixed top-0 right-0 z-30 w-auto shadow-sm"
      style={{
        left: isOpen ? "16rem" : "5rem",
        transition: "left 0.3s ease-in-out",
      }}
    >
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>

          <div className="relative md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="text-gray-500" size={18} />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <NotificationDropdown
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onClearAll={handleClearAll}
          />

          {/* 👤 User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg"
            >
              {adminAvatar ? (
                <img
                  src={adminAvatar}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center text-white font-medium">
                  {adminProfile?.userName?.charAt(0) || "A"}
                </div>
              )}

              <span className="hidden md:block text-sm font-medium">
                {adminProfile?.userName || "Admin User"}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#14542e] hover:text-white"
                    role="menuitem"
                  >
                    <User className="mr-2" size={16} />
                    <span>Your Profile</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                    role="menuitem"
                  >
                    <LogOut className="mr-2" size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
