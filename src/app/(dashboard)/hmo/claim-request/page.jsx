// pages/ClaimRequestPage.js
"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Badge, Form } from "antd";
import EditClaimRequestModal from "./_components/EditClaimRequestModal";

const ClaimRequestPage = () => {
  const [claimRequests, setClaimRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentClaim, setCurrentClaim] = useState(null);
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [hmo, setHmo] = useState(null);

  useEffect(() => {
    const response = JSON.parse(localStorage.getItem("dcPortal-user"));
    if (response) {
      setUser(response);
    }
  }, []);

  useEffect(() => {
    const fetchHmo = async () => {
      const response = await fetch(`/api/hmo/single?id=${user?.id}`);
      if (response.ok) {
        setHmo(await response.json());
      }
    };
    if (user) fetchHmo();
  }, [user]);

  useEffect(() => {
    const fetchClaimRequests = async () => {
      try {
        const response = await fetch("/api/claim-request");
        const data = await response.json();
        setClaimRequests(data.claimRequests || []);
      } catch (error) {
        console.error("Error fetching claim requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaimRequests();
  }, []);

  const handleEdit = (row) => {
    setCurrentClaim(row);
    form.setFieldsValue(row);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentClaim(null);
  };

  const handleFinish = async (values) => {
    const updatedClaimRequest = {
      ...currentClaim,
      ...values,
      responsedBy: hmo?.id,
    };

    try {
      const response = await fetch(`/api/claim-request`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedClaimRequest),
      });

      if (response.ok) {
        const updatedClaim = await response.json();
        setClaimRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === updatedClaim.id ? updatedClaim : request
          )
        );
        handleCancel();
      } else {
        console.error("Failed to update the claim request");
      }
    } catch (error) {
      console.error("Error updating claim request:", error);
    }
  };

  const columns = [
    // Define table columns
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
    {
      name: "Actions",
      cell: (row) => (
        <Button type="primary" onClick={() => handleEdit(row)}>
          Edit
        </Button>
      ),
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "default";
      case "ACCEPTED":
        return "processing";
      case "COMPLETED":
        return "success";
      default:
        return "default";
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

      {/* Use the separated modal component */}
      {currentClaim && (
        <EditClaimRequestModal
          isVisible={isModalVisible}
          handleCancel={handleCancel}
          currentClaim={currentClaim}
          form={form}
          hmo={hmo}
          handleFinish={handleFinish}
        />
      )}
    </div>
  );
};

export default ClaimRequestPage;
