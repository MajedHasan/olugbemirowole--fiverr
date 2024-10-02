"use client";
import { useEffect, useState } from "react";
import { message, Pagination, Table, Tag } from "antd";

const Claims = () => {
  const [treatmentRequests, setTreatmentRequests] = useState([]);
  const [totalTreatmentRequests, setTotalTreatmentRequests] = useState(0);
  const [treatmentRequestPage, setTreatmentRequestPage] = useState(1);
  const limit = 10; // Adjust as needed

  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("dcPortal-user"));
    setUser(user);
  }, []);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "pending":
        return "orange";
      case "resolved":
        return "blue";
      case "paid":
        return "green";
      case "failed":
        return "red";
      default:
        return "gray"; // Default color for unknown status
    }
  };

  // Fetch treatment requests
  const fetchTreatmentRequests = async () => {
    try {
      const response = await fetch(
        `/api/treatment-request?page=${treatmentRequestPage}&limit=${limit}&status=ACCEPTED&userId=${user.id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTreatmentRequests(data.treatmentRequests);
      setTotalTreatmentRequests(data.total);
      console.log(data);
    } catch (error) {
      console.error("Error fetching treatment requests:", error);
      message.error("Failed to fetch treatment requests. Showing demo data.");
    }
  };

  useEffect(() => {
    fetchTreatmentRequests();
  }, [treatmentRequestPage, user]);

  const treatmentRequestColumns = [
    {
      title: "Enrollee",
      dataIndex: "enrollee",
      key: "enrollee",
    },
    {
      title: "Policy Number",
      dataIndex: "policyNo",
      key: "policyNo",
    },
    {
      title: "Health Plan",
      dataIndex: "healthPlan",
      key: "healthPlan",
    },
    {
      title: "Treatment Cost",
      dataIndex: "treatmentCost",
      key: "treatmentCost",
      render: (cost) => `$${cost}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "PENDING" ? "orange" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Hospital Name",
      dataIndex: "hospitalName",
      key: "hospitalName",
    },
    {
      title: "Hospital Email",
      dataIndex: "hospitalEmail",
      key: "hospitalEmail",
    },
    {
      title: "Hospital Phone",
      dataIndex: "hospitalPhone",
      key: "hospitalPhone",
    },
    {
      title: "Diagnoses",
      dataIndex: "diagnoses",
      key: "diagnoses",
      render: (diagnoses) => (
        <div
          style={{
            maxHeight: "80px",
            overflowY: "auto",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            padding: "8px",
            marginBottom: "8px",
            backgroundColor: "#f0f0f0", // Light background for better visibility
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {diagnoses.length === 0 ? (
            <div>No Diagnoses Available</div>
          ) : (
            <ul
              style={{
                padding: "0",
                margin: "0",
                listStyleType: "disc",
                paddingLeft: "20px",
              }}
            >
              {diagnoses.map((diagnosis) => (
                <li key={diagnosis.id} style={{ marginBottom: "4px" }}>
                  {diagnosis.description}
                </li>
              ))}
            </ul>
          )}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              color: "#888",
              fontSize: "12px",
            }}
          >
            Scroll for more...
          </div>
        </div>
      ),
    },
    {
      title: "Treatments",
      dataIndex: "treatments",
      key: "treatments",
      render: (treatments) => (
        <div
          style={{
            maxHeight: "80px",
            overflowY: "auto",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            padding: "8px",
            backgroundColor: "#f0f0f0", // Light background for better visibility
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {treatments.length === 0 ? (
            <div>No Treatments Available</div>
          ) : (
            <ul
              style={{
                padding: "0",
                margin: "0",
                listStyleType: "disc",
                paddingLeft: "20px",
              }}
            >
              {treatments.map((treatment) => (
                <li key={treatment.id} style={{ marginBottom: "4px" }}>
                  {treatment.serviceName}
                </li>
              ))}
            </ul>
          )}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              color: "#888",
              fontSize: "12px",
            }}
          >
            Scroll for more...
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={treatmentRequests}
        columns={treatmentRequestColumns}
        pagination={false}
      />
      <Pagination
        current={treatmentRequestPage}
        total={totalTreatmentRequests}
        pageSize={limit}
        onChange={(page) => setTreatmentRequestPage(page)}
      />
    </>
  );
};

export default Claims;
