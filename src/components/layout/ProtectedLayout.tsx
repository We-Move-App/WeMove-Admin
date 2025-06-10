import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useSidebar } from "@/context/SidebarContext";

const ProtectedLayout = () => {
    const { isOpen } = useSidebar();

    return (
        <div className="flex min-h-screen bg-gray-100 w-full">
            <Sidebar />
            <div
                className="flex-1 transition-all duration-300 ease-in-out overflow-hidden"
                style={{ marginLeft: isOpen ? "16rem" : "5rem" }}
            >
                <Navbar />
                <main className="p-6 pt-24">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProtectedLayout;
