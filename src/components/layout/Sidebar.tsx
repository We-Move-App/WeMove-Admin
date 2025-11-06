import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "@/context/SidebarContext";
import {
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
} from "lucide-react";
import LogoImg from "../../../public/weMove.svg";
import { useTranslation } from "react-i18next";

type NavItem = {
  path: string;
  label: string;
  icon: JSX.Element;
  subItems?: { path: string; label: string }[];
  requiredPermission?:
    | "userManagement"
    | "busManagement"
    | "taxiManagement"
    | "hotelManagement"
    | "walletManagement"
    | "reportsAnalytics"
    | "notifications"
    | "roleManagement"
    | "commissionManagement"
    | "couponManagement"
    | "bikeManagement";
};

type Props = {
  adminProfile?: any;
  adminAvatar?: string | null;
};

const Sidebar = ({ adminProfile, adminAvatar }: Props) => {
  const { t } = useTranslation();
  const { isOpen } = useSidebar();
  const location = useLocation();
  const [activeNavItem, setActiveNavItem] = useState("");
  const [expandedSubNav, setExpandedSubNav] = useState<string | null>(null);

  const permissions = adminProfile?.permissions || {};
  const role = adminProfile?.role || "";

  const navItems: NavItem[] = [
    {
      path: "/dashboard",
      label: t("sidebar.dashboard"),
      icon: <Home size={20} />,
      requiredPermission: "reportsAnalytics",
    },
    {
      path: "/bus-management",
      label: t("sidebar.busManagement"),
      icon: <Bus size={20} />,
      requiredPermission: "busManagement",
      subItems: [
        { path: "/bus-management/operators", label: t("sidebar.busOperators") },
        { path: "/bus-management/bookings", label: t("sidebar.busBookings") },
      ],
    },
    {
      path: "/hotel-management",
      label: t("sidebar.hotelManagement"),
      icon: <Hotel size={20} />,
      requiredPermission: "hotelManagement",
      subItems: [
        {
          path: "/hotel-management/managers",
          label: t("sidebar.hotelManagers"),
        },
        {
          path: "/hotel-management/bookings",
          label: t("sidebar.hotelBookings"),
        },
      ],
    },
    {
      path: "/taxi-management",
      label: t("sidebar.taxiManagement"),
      icon: <Car size={20} />,
      requiredPermission: "taxiManagement",
      subItems: [
        { path: "/taxi-management/drivers", label: t("sidebar.taxiDrivers") },
        { path: "/taxi-management/bookings", label: t("sidebar.taxiBookings") },
      ],
    },
    {
      path: "/bike-management",
      label: t("sidebar.bikeManagement"),
      icon: <Bike size={20} />,
      requiredPermission: "bikeManagement",
      subItems: [
        { path: "/bike-management/riders", label: t("sidebar.bikeRiders") },
        { path: "/bike-management/bookings", label: t("sidebar.bikeBookings") },
      ],
    },
    {
      path: "/customer-management",
      label: t("sidebar.userManagement"),
      icon: <Users size={20} />,
      requiredPermission: "userManagement",
      subItems: [
        { path: "/customer-management", label: t("sidebar.users") },
        {
          path: "/customer-management/bookings",
          label: t("sidebar.userBookings"),
        },
      ],
    },
    {
      path: "/admin-management",
      label: t("sidebar.adminManagement"),
      icon: <UserCog size={20} />,
      requiredPermission: "roleManagement",
    },
    {
      path: "/commission-management",
      label: t("sidebar.commissionManagement"),
      icon: <Percent size={20} />,
      requiredPermission: "commissionManagement",
    },
    {
      path: "/coupons",
      label: t("sidebar.coupons"),
      icon: <Tag size={20} />,
      requiredPermission: "couponManagement",
    },
    {
      path: "/wallet",
      label: t("sidebar.wallet"),
      icon: <Wallet size={20} />,
      requiredPermission: "walletManagement",
    },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const matchingNavItem = navItems.find(
      (item) =>
        currentPath === item.path ||
        (item.subItems &&
          item.subItems.some((subItem) => currentPath === subItem.path))
    );

    if (matchingNavItem) {
      setActiveNavItem(matchingNavItem.path);
      if (
        matchingNavItem.subItems &&
        matchingNavItem.subItems.some((subItem) => currentPath === subItem.path)
      ) {
        setExpandedSubNav(matchingNavItem.path);
      }
    }
  }, [location.pathname, t]); // include t to update labels when language changes

  const toggleSubNav = (path: string) => {
    setExpandedSubNav((prev) => (prev === path ? null : path));
  };

  if (!adminProfile) {
    return (
      <div
        className={`admin-sidebar min-h-screen h-full w-64 flex flex-col fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ease-in-out overflow-hidden bg-gray-900`}
      >
        <div className="flex items-center px-4 py-5 border-b border-white-100">
          <div className="flex items-center w-full">
            <div className="w-6 h-6 bg-green-900 rounded animate-pulse" />
            <span className="ml-3 font-bold text-lg text-gray-500">WeMove</span>
          </div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul>
            {[...Array(5)].map((_, idx) => (
              <li key={idx} className="mb-1 px-2">
                <div className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-[#14542e] transition-colors duration-200">
                  <div className="w-5 h-5 bg-green-900 rounded" />
                  <div className="w-24 h-3 bg-green-900 rounded" />
                </div>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-white-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-900 animate-pulse" />
            <div className="flex flex-col space-y-2">
              <div className="w-20 h-3 bg-green-900 rounded animate-pulse" />
              <div className="w-32 h-3 bg-green-900 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <img src={LogoImg} alt="" width={24} height={24} />
          {isOpen && <span className="ml-3 font-bold text-lg">WeMove</span>}
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul>
          {navItems
            .filter((item) => permissions[item.requiredPermission])
            .map((item) => (
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
                          ▼
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

      <div className="p-4 border-t border-white-100">
        {isOpen ? (
          <div className="flex items-center">
            {adminAvatar ? (
              <img
                src={adminAvatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center text-white font-medium">
                {adminProfile?.userName
                  ? adminProfile.userName.charAt(0).toUpperCase()
                  : adminProfile?.email
                  ? adminProfile.email.charAt(0).toUpperCase()
                  : "A"}
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
            {adminAvatar ? (
              <img
                src={adminAvatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center text-white font-medium">
                {adminProfile?.userName
                  ? adminProfile.userName.charAt(0).toUpperCase()
                  : adminProfile?.email
                  ? adminProfile.email.charAt(0).toUpperCase()
                  : "A"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
