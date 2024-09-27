"use client";
// src/app/hmo-dashboard/page.jsx

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
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

// Register the components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function HMOCashboard() {
  const data = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#ec3138", "#878787", "#424242"],
      },
    ],
  };

  return (
    <div>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
        <Card className="bg-primary text-white">
          <CardHeader>
            <div className="w-full flex items-center justify-between gap-2">
              <h2 className="text-xl font-semibold">Enrollees</h2>
              <FaUserAlt />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle>21,321</CardTitle>
          </CardContent>
          <CardFooter>
            <CardDescription className="text-slate-200">+333</CardDescription>
          </CardFooter>
        </Card>
        <Card className="bg-secondary text-white">
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
          <h2 className="text-xl font-semibold">Claims Overview</h2>
          <Pie data={data} />
        </div>
        <div className="bg-white shadow-lg rounded p-4">
          <h2 className="text-xl font-semibold">Enrollees Management</h2>
          {/* Card for managing enrollees */}
        </div>
      </div>
    </div>
  );
}
