"use client";

import Link from "next/link";
import {
  FaHospital,
  FaUser,
  FaClipboardList,
  FaSignOutAlt,
  FaChartLine,
  FaMoneyCheck,
} from "react-icons/fa";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DashboardSidebar = ({ role, closeSidebar }) => {
  const router = useRouter();

  const links = {
    ENROLLEES: [
      { href: "/enrollees", label: "Dashboard", icon: <FaUser /> },
      {
        href: "/enrollees/profile",
        label: "Profile",
        icon: <FaClipboardList />,
      },
    ],
    HOSPITAL: [
      { href: "/hospital", label: "Dashboard", icon: <FaHospital /> },
      { href: "/hospital/enrollees", label: "Enrollees", icon: <FaUser /> },
      {
        href: "/hospital/authorization-request",
        label: "Authorization Request",
        icon: <FaClipboardList />,
      },
      {
        href: "/hospital/claim-request",
        label: "Claim Management",
        icon: <FaClipboardList />,
      },
      {
        href: "/hospital/payouts",
        label: "Payouts",
        icon: <FaClipboardList />,
      },
    ],
    HMO: [
      { href: "/hmo", label: "Dashboard", icon: <FaChartLine /> },
      { href: "/hmo/enrollees", label: "Manage Enrollees", icon: <FaUser /> },
      {
        href: "/hmo/organisation",
        label: "Manage Organisation",
        icon: <FaClipboardList />,
      },
      {
        href: "/hmo/hospital",
        label: "Manage Providers",
        icon: <FaClipboardList />,
      },
      {
        href: "/hmo/authorization-request",
        label: "Authorization Request",
        icon: <FaClipboardList />,
      },
      {
        href: "/hmo/claim-request",
        label: "Claim Management",
        icon: <FaClipboardList />,
      },
      {
        href: "/hmo/tariff-management",
        label: "Tariff Management",
        icon: <FaClipboardList />,
      },
      { href: "/hmo/payouts", label: "Payouts", icon: <FaMoneyCheck /> },
    ],
    ORGANISATION: [
      { href: "/organisation", label: "Dashboard", icon: <FaChartLine /> },
      {
        href: "/organisation/enrollees",
        label: "Manage Enrollees",
        icon: <FaUser />,
      },
      {
        href: "/organisation/benefits",
        label: "Benefits Management",
        icon: <FaClipboardList />,
      },
    ],
  };

  const logoutHandler = () => {
    localStorage.removeItem("dcPortal-user");
    router.push("/sign-in");
  };

  return (
    <div className="bg-fourth text-white w-64 h-full shadow-lg flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <div className="p-4 text-2xl font-bold">
          <Image
            src={"/img/favicon.png"}
            alt="Logo"
            width={500}
            height={500}
            className="w-full h-fit max-w-[60px] mx-auto rounded-full"
          />
        </div>
        <nav>
          <ul className="mt-4">
            {links[role].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="flex items-center p-4 hover:bg-gray-700"
                  onClick={closeSidebar}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="p-4">
        <Button
          className="flex items-center p-4 bg-primary hover:bg-gray-700 justify-start w-full"
          onClick={logoutHandler}
        >
          <span className="mr-3">
            <FaSignOutAlt />
          </span>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
