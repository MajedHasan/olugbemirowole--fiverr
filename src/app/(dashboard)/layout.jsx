"use client"; // Ensure this is the very first line in the file

import DashboardSidebar from "@/components/common/dashboardSidebar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import Notifications from "./_components/Notifications";

const Layout = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("dcPortal-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Runs only once after the component mounts

  console.log(user?.role);

  const logoutHandler = () => {
    localStorage.removeItem("dcPortal-user");
    router.push("/sign-in");
  };

  return (
    <main className="flex w-full h-screen">
      <DashboardSidebar role={user?.role ? user?.role : "ENROLLEES"} />
      <div className="flex-1 w-full h-full overflow-y-scroll">
        <header className="flex items-center justify-between mb-6 border-b border-slate-400 lg:py-4 py-2 lg:px-6 px-4">
          <h1 className="text-3xl font-bold">
            Welcome,{" "}
            {user?.role === "ENROLLEES"
              ? "Enrollees"
              : user?.role === "HOSPITAL"
              ? "Provider Hospital"
              : user?.role === "ORGANISATION"
              ? "Organisation"
              : "HMO"}
          </h1>
          <div className="flex items-center justify-between gap-3">
            <Notifications />
            <Button
              className="bg-primary text-white px-4 py-2 h-fit gap-2"
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
