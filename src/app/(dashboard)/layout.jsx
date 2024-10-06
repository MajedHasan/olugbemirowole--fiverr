"use client";

import DashboardSidebar from "@/components/common/dashboardSidebar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import Notifications from "./_components/Notifications";

const Layout = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("dcPortal-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("dcPortal-user");
    router.push("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchHospital = async () => {
      const response = await fetch(`/api/hospital/single?id=${user?.id}`);
      if (response.ok) {
        setHospital(await response.json());
      }
    };

    if (user?.role === "HOSPITAL") {
      fetchHospital();
    }
  }, [user]);

  return (
    <main className="flex w-full h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative z-40 w-64 lg:w-64 h-full transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSidebar
          role={user?.role || "ENROLLEES"}
          closeSidebar={toggleSidebar}
        />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 w-full h-full overflow-y-scroll">
        <header className="flex items-center justify-between mb-6 border-b border-slate-400 lg:py-4 py-2 lg:px-6 px-4">
          {/* Sidebar Toggle for mobile */}
          <Button
            className="lg:hidden bg-primary text-white px-2 py-2"
            onClick={toggleSidebar}
          >
            <FaBars />
          </Button>
          <h1 className="text-xl lg:text-3xl font-bold">
            Welcome,{" "}
            {user?.role === "ENROLLEES"
              ? "Enrollee"
              : user?.role === "HOSPITAL"
              ? hospital?.hospitalName
              : user?.role === "ORGANISATION"
              ? "Organisation"
              : "HMO"}
          </h1>
          <div className="flex items-center gap-3">
            <Notifications />
            <Button
              className="bg-primary text-white px-4 py-2 gap-2"
              onClick={logoutHandler}
            >
              Logout
              <FaSignOutAlt />
            </Button>
          </div>
        </header>
        <div className="p-4">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
