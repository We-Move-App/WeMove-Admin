import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useSidebar } from "@/context/SidebarContext.jsx";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-100 w-[100%]">
      <Sidebar />
      <div
        className="flex-1 transition-all duration-300 ease-in-out overflow-hidden"
        style={{ marginLeft: isOpen ? "16rem" : "5rem" }}
      >
        <Navbar />
        <main className="p-6 pt-24">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
