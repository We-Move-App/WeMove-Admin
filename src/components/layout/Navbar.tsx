import { useState, useEffect } from "react";
import { Bell, Search, Menu, User, LogOut } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = ({ adminProfile, adminAvatar }) => {
  const navigate = useNavigate();
  const { isOpen, toggleSidebar } = useSidebar();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = () => {
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

        <div className="flex items-center gap-4">
          <button className="p-1 rounded-full hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>

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
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  {/* <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <User className="mr-2" size={16} />
                    <span>Your Profile</span>
                  </a> */}
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
