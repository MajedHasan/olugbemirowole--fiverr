"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaDollarSign, FaUserAlt } from "react-icons/fa";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthorizationRequestForm from "./_components/AuthorizationRequestForm";
import ClaimRequestForm from "./_components/ClaimRequestForm";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HospitalDashboard = () => {
  const [isAuthorizationPopupVisible, setIsAuthorizationPopupVisible] =
    useState(false);
  const [isClaimPopupVisible, setIsClaimPopupVisible] = useState(false);

  const data = {
    labels: ["January", "February", "March", "April"],
    datasets: [
      {
        label: "Claims Submitted",
        data: [65, 59, 80, 81],
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 1)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-end gap-4">
          <ClaimRequestForm
            visible={isClaimPopupVisible}
            onClose={() => setIsClaimPopupVisible(false)}
          />
          <Button
            type="primary"
            onClick={() => setIsClaimPopupVisible(true)}
            style={{ marginBottom: "16px" }}
          >
            Submit Claim
          </Button>
          <AuthorizationRequestForm
            visible={isAuthorizationPopupVisible}
            onClose={() => setIsAuthorizationPopupVisible(false)}
          />
          <Button
            type="primary"
            onClick={() => setIsAuthorizationPopupVisible(true)}
            style={{ marginBottom: "16px" }}
          >
            Request Authorization
          </Button>
        </div>
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
          <Card className="bg-primary text-white">
            <CardHeader>
              <div className="w-full flex items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">Claims</h2>
                <FaDollarSign />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle>N 221,324.50</CardTitle>
            </CardContent>
            <CardFooter>
              <CardDescription className="text-slate-200">+333</CardDescription>
            </CardFooter>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded p-4">
            <h2 className="text-xl font-semibold">Claims Status</h2>
            <Line data={data} />
          </div>
          <div className="bg-white shadow-lg rounded p-4">
            <h2 className="text-xl font-semibold">Enrollees Overview</h2>
            {/* Table or Card showing enrollees data */}
          </div>
        </div>
      </div>
    </>
  );
};

export default HospitalDashboard;
