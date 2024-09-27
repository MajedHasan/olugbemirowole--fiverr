"use client";
// src/app/enrollees-dashboard/page.jsx

import { Bar } from "react-chartjs-2"; // Chart.js for charts

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function EnrolleesDashboard() {
  const data = {
    labels: ["Hospital A", "Hospital B", "Hospital C"],
    datasets: [
      {
        label: "Visits",
        data: [12, 19, 3],
        backgroundColor: "#ec3138",
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white shadow-lg rounded p-4">
        <h2 className="text-xl font-semibold">Your Profile</h2>
        {/* Profile info */}
      </div>
      <div className="bg-white shadow-lg rounded p-4">
        <h2 className="text-xl font-semibold">Hospital Visits</h2>
        <Bar data={data} />
      </div>
    </div>
  );
}
