import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "@/context/SidebarContext";
import {
  BarChart,
  Home,
  Bus,
  Hotel,
  Car,
  Bike,
  Users,
  UserCog,
  Percent,
  Tag,
  Wallet,
  Bell,
  Menu,
  X,
  Settings,
} from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import LogoImg from "../../../public/weMove.svg";

interface NavItem {
  path: string;
  label: string;
  icon: JSX.Element;
  subItems?: { path: string; label: string }[];
}

const Sidebar = () => {
  const { isOpen } = useSidebar();
  const location = useLocation();
  const [activeNavItem, setActiveNavItem] = useState("");
  const [expandedSubNav, setExpandedSubNav] = useState<string | null>(null);
  const [adminProfile, setAdminProfile] = useState<any>(null);

  useEffect(() => {
    const currentPath = location.pathname;

    // Find which main nav item matches the current path
    const matchingNavItem = navItems.find(
      (item) =>
        currentPath === item.path ||
        (item.subItems &&
          item.subItems.some((subItem) => currentPath === subItem.path))
    );

    if (matchingNavItem) {
      setActiveNavItem(matchingNavItem.path);

      // If the matching item has subitems, expand that section
      if (
        matchingNavItem.subItems &&
        matchingNavItem.subItems.some((subItem) => currentPath === subItem.path)
      ) {
        setExpandedSubNav(matchingNavItem.path);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await axiosInstance.get("/auth/my-profile");
        if (response.data.success) {
          setAdminProfile(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
      }
    };

    fetchAdminProfile();
  }, []);

  const toggleSubNav = (path: string) => {
    if (expandedSubNav === path) {
      setExpandedSubNav(null);
    } else {
      setExpandedSubNav(path);
    }
  };

  const navItems: NavItem[] = [
    { path: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    {
      path: "/bus-management",
      label: "Bus Management",
      icon: <Bus size={20} />,
      subItems: [
        { path: "/bus-management/operators", label: "Bus Operators" },
        { path: "/bus-management/bookings", label: "Bus Bookings" },
      ],
    },
    {
      path: "/hotel-management",
      label: "Hotel Management",
      icon: <Hotel size={20} />,
      subItems: [
        { path: "/hotel-management/managers", label: "Hotel Managers" },
        { path: "/hotel-management/bookings", label: "Hotel Bookings" },
      ],
    },
    {
      path: "/taxi-management",
      label: "Taxi Management",
      icon: <Car size={20} />,
      subItems: [
        { path: "/taxi-management/drivers", label: "Taxi Drivers" },
        { path: "/taxi-management/bookings", label: "Taxi Bookings" },
      ],
    },
    {
      path: "/bike-management",
      label: "Bike Management",
      icon: <Bike size={20} />,
      subItems: [
        { path: "/bike-management/riders", label: "Bike Riders" },
        { path: "/bike-management/bookings", label: "Bike Bookings" },
      ],
    },
    {
      path: "/customer-management",
      label: "Customer Management",
      icon: <Users size={20} />,
    },
    {
      path: "/user-management",
      label: "User Management",
      icon: <UserCog size={20} />,
    },
    {
      path: "/commission-management",
      label: "Commission Management",
      icon: <Percent size={20} />,
    },
    { path: "/coupons", label: "Coupons", icon: <Tag size={20} /> },
    { path: "/wallet", label: "Wallet", icon: <Wallet size={20} /> },
    {
      path: "/notifications",
      label: "Notifications & Alerts",
      icon: <Bell size={20} />,
    },
    // { path: "/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div
      className={`admin-sidebar min-h-screen h-full ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ease-in-out overflow-hidden`}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-white-100">
        <div
          className={`flex items-center ${
            isOpen ? "" : "justify-center w-full"
          }`}
        >
          {/* <BarChart className="text-blue-500" size={24} /> */}
          <img src={LogoImg} alt="" width={24} height={24} />
          {isOpen && <span className="ml-3 font-bold text-lg">WeMove</span>}
        </div>
        {isOpen && (
          <div className="lg:hidden">
            <X className="cursor-pointer" size={20} />
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-1 px-2">
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleSubNav(item.path)}
                    className={`sidebar-menu-item w-full justify-between ${
                      activeNavItem === item.path ? "bg-green-900" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      {isOpen && <span className="ml-3">{item.label}</span>}
                    </div>
                    {isOpen && (
                      <span
                        className={`transform transition-transform ${
                          expandedSubNav === item.path
                            ? "rotate-180"
                            : "rotate-0"
                        }`}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                  {isOpen && expandedSubNav === item.path && (
                    <div className="mt-1 ml-8 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`block py-2 px-3 rounded-md text-sm ${
                            location.pathname === subItem.path
                              ? "bg-green-900 text-white"
                              : "hover:bg-green-900"
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`sidebar-menu-item ${
                    location.pathname === item.path ? "bg-green-900" : ""
                  }`}
                >
                  {item.icon}
                  {isOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* <div className="p-4 border-t border-white-100">
        {isOpen ? (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center text-white font-medium">
              A
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-white">Admin User</div>
              <div className="text-xs text-gray-400">admin@example.com</div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center text-white font-medium">
              A
            </div>
          </div>
        )}
      </div> */}

      <div className="p-4 border-t border-white-100">
        {isOpen ? (
          <div className="flex items-center">
            {adminProfile?.avatar?.url ? (
              <img
                src={adminProfile.avatar.url}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center text-white font-medium">
                A
              </div>
            )}
            <div className="ml-3">
              <div className="text-sm font-medium text-white">
                {adminProfile?.userName || "Admin User"}
              </div>
              <div className="text-xs text-gray-400">
                {adminProfile?.email || "admin@example.com"}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            {adminProfile?.avatar?.url ? (
              <img
                src={adminProfile.avatar.url}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center text-white font-medium">
                A
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
