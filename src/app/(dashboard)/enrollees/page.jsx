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
        backgroundColor: "#ec3138", // Brand color
      },
    ],
  };

  // Example profile data
  const profile = {
    picture: "https://via.placeholder.com/100", // Placeholder image
    name: "John Doe",
    policyNumber: "XYZ123456",
    healthPlan: "Premium Health Plan",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Profile Section */}
      <div className="bg-gradient-to-r from-red-400 to-pink-500 shadow-2xl rounded-lg p-6 flex items-center transition-transform transform hover:scale-105">
        <img
          src={profile.picture}
          alt="Profile Picture"
          className="rounded-full w-32 h-32 border-4 border-white shadow-lg"
        />
        <div className="ml-4">
          <h2 className="text-3xl font-extrabold text-white">{profile.name}</h2>
          <p className="text-lg text-gray-100">
            Policy Number: {profile.policyNumber}
          </p>
          <p className="text-lg text-gray-100">
            Health Plan: {profile.healthPlan}
          </p>
          <button className="mt-4 bg-white text-red-600 font-semibold px-4 py-2 rounded-full shadow hover:bg-gray-200 transition duration-200">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Hospital Visits Chart */}
      <div className="bg-white shadow-2xl rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Hospital Visits</h2>
        <Bar
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: {
                labels: {
                  color: "#333",
                  font: {
                    size: 14,
                  },
                },
              },
              tooltip: {
                backgroundColor: "#333",
                titleColor: "#fff",
                bodyColor: "#fff",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
