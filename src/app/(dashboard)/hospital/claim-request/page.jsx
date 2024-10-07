"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Badge } from "antd"; // Import Badge and Form components

const ClaimRequestPage = () => {
  const [claimRequests, setClaimRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const response = JSON.parse(localStorage.getItem("dcPortal-user"));
    if (response) {
      setUser(response);
    }
  }, []);

  // Fetch claim requests data
  useEffect(() => {
    const fetchClaimRequests = async () => {
      try {
        const response = await fetch(`/api/claim-request?userId=${user?.id}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setClaimRequests(data);
        } else if (data.claimRequests && Array.isArray(data.claimRequests)) {
          setClaimRequests(data.claimRequests);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching claim requests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchClaimRequests();
  }, [user]);

  const columns = [
    {
      name: "ID",
      selector: (row) => row?.id || "N/A",
      sortable: true,
    },
    {
      name: "Enrollee",
      selector: (row) => row?.enrollee || "N/A",
      sortable: true,
    },
    {
      name: "Policy Number",
      selector: (row) => row?.policyNo || "N/A",
      sortable: true,
    },
    {
      name: "Treatment Cost",
      selector: (row) => (row?.treatmentCost ? `$${row.treatmentCost}` : "N/A"),
      sortable: true,
    },
    {
      name: "Hospital Name",
      selector: (row) => row?.hospitalName || "N/A",
      sortable: true,
    },
    {
      name: "Hospital Email",
      selector: (row) => row?.hospitalEmail || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <Badge status={getStatusBadge(row.status)} text={row.status} />
      ),
      sortable: true,
    },
    {
      name: "Approved By",
      selector: (row) => row?.hmo?.email || "N/A",
      sortable: true,
    },
    {
      name: "Submited At",
      selector: (row) =>
        row?.createdAt ? new Date(row.createdAt).toLocaleString() : "N/A",
      sortable: true,
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "default"; // Grey
      case "ACCEPTED":
        return "processing"; // Green
      case "COMPLETED":
        return "success"; // Blue
      default:
        return "default"; // Fallback
    }
  };

  return (
    <div className="p-6">
      <div className="flex lg:flex-row flex-col-reverse gap-4 items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Claim Requests</h1>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : claimRequests.length > 0 ? (
        <DataTable columns={columns} data={claimRequests} pagination />
      ) : (
        <p>No records found</p>
      )}
    </div>
  );
};

export default ClaimRequestPage;
