import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useSidebar } from "@/context/SidebarContext";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";

const ProtectedLayout = () => {
    const { isOpen } = useSidebar();

    const [adminProfile, setAdminProfile] = useState(() => {
        const storedProfile = localStorage.getItem("adminProfile");
        return storedProfile ? JSON.parse(storedProfile) : null;
    });

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const response = await axiosInstance.get("/auth/my-profile");
                if (response.data.success) {
                    setAdminProfile(response.data.data);
                    localStorage.setItem(
                        "adminProfile",
                        JSON.stringify(response.data.data)
                    );
                }
            } catch (error) {
                console.error("Failed to fetch admin profile:", error);
            }
        };
        if (!adminProfile) {
            fetchAdminProfile();
        }
    }, [adminProfile]);


    return (
        <div className="flex min-h-screen bg-gray-100 w-full">
            <Sidebar adminProfile={adminProfile} />
            <div
                className="flex-1 transition-all duration-300 ease-in-out overflow-hidden"
                style={{ marginLeft: isOpen ? "16rem" : "5rem" }}
            >
                <Navbar adminProfile={adminProfile} />
                <main className="p-6 pt-24">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProtectedLayout;
