"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Modal, Button } from "antd"; // Assuming you have Ant Design for UI

const TreatmentRequestPage = () => {
  const [treatmentRequests, setTreatmentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTreatment, setCurrentTreatment] = useState(null);

  // Fetch treatment requests data
  useEffect(() => {
    const fetchTreatmentRequests = async () => {
      try {
        const response = await fetch("/api/treatment-request");
        const data = await response.json();
        if (Array.isArray(data)) {
          setTreatmentRequests(data);
        } else if (
          data.treatmentRequests &&
          Array.isArray(data.treatmentRequests)
        ) {
          setTreatmentRequests(data.treatmentRequests);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching treatment requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatmentRequests();
  }, []);

  // Open modal for editing
  const handleEdit = (row) => {
    setCurrentTreatment(row); // Store the row data for editing
    setIsModalVisible(true); // Open the modal
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentTreatment(null);
  };

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
      name: "Health Plan",
      selector: (row) => row?.healthPlan || "N/A",
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
      selector: (row) => row?.status || "N/A",
      sortable: true,
    },
    {
      name: "Created At",
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Treatment Requests</h1>
      {loading ? (
        <p>Loading...</p>
      ) : treatmentRequests.length > 0 ? (
        <DataTable columns={columns} data={treatmentRequests} pagination />
      ) : (
        <p>No records found</p>
      )}

      {/* Modal for Editing */}
      {currentTreatment && (
        <Modal
          title="Edit Treatment Request"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          style={{ top: 20 }} // Adjust modal position if needed
        >
          <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
            <p>
              <strong>ID:</strong> {currentTreatment.id}
            </p>
            <p>
              <strong>Enrollee:</strong> {currentTreatment.enrollee}
            </p>
            <p>
              <strong>Policy Number:</strong> {currentTreatment.policyNo}
            </p>
            <p>
              <strong>Treatment Cost:</strong> {currentTreatment.treatmentCost}
            </p>
            <p>
              <strong>Diagnoses:</strong>
            </p>
            <ul>
              {currentTreatment.diagnoses.map((diagnosis) => (
                <li key={diagnosis.id}>
                  <strong>{diagnosis.code}</strong>
                </li>
              ))}
            </ul>
            <p>
              <strong>Treatments:</strong>
            </p>
            <ul>
              {currentTreatment.treatments.map((treatment) => (
                <li key={treatment.id}>
                  <strong>{treatment.serviceName}</strong>
                </li>
              ))}
            </ul>
            <Button onClick={handleCancel}>Close</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TreatmentRequestPage;
