"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Modal, Button, Form, Input, Select, Badge } from "antd"; // Import Badge and Form components

const { Option } = Select;

const TreatmentRequestPage = () => {
  const [treatmentRequests, setTreatmentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTreatment, setCurrentTreatment] = useState(null);
  const [form] = Form.useForm(); // Create a form instance

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
    console.log(row);
    setCurrentTreatment(row); // Store the row data for editing
    form.setFieldsValue(row); // Populate form fields with current treatment data
    setIsModalVisible(true); // Open the modal
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentTreatment(null);
  };

  const handleFinish = async (values) => {
    const udpatedTreatmentRequest = {
      ...currentTreatment,
      status: values.status,
      policyNo: values.policyNo,
      enrollee: values.enrollee,
      treatmentCost: values.treatmentCost,
    };

    try {
      const response = await fetch(`/api/treatment-request`, {
        method: "PUT", // or PATCH depending on your API design
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(udpatedTreatmentRequest), // Send the edited values to your API
      });

      if (response.ok) {
        const updatedTreatment = await response.json();
        // Update the treatmentRequests state with the updated treatment
        setTreatmentRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === updatedTreatment.id ? updatedTreatment : request
          )
        );
        handleCancel(); // Close the modal after successful update
      } else {
        console.error("Failed to update the treatment request");
      }
    } catch (error) {
      console.error("Error updating treatment request:", error);
    }
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
      selector: (row) => (
        <Badge status={getStatusBadge(row.status)} text={row.status} />
      ),
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
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          style={{ top: 20 }} // Adjust modal position if needed
        >
          <Form form={form} onFinish={handleFinish}>
            <Form.Item name="id" label="ID">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="enrollee"
              label="Enrollee"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="policyNo"
              label="Policy Number"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="treatmentCost"
              label="Treatment Cost"
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select>
                <Option
                  value="PENDING"
                  disabled={
                    currentTreatment.status === "PENDING"
                      ? false
                      : currentTreatment.status === "ACCEPTED"
                      ? true
                      : true
                  }
                >
                  Pending
                </Option>
                <Option
                  value="ACCEPTED"
                  disabled={
                    currentTreatment.status === "COMPLETED" ? true : false
                  }
                >
                  Accepted
                </Option>
                <Option value="COMPLETED">Completed</Option>
              </Select>
            </Form.Item>
            <div className="border rounded p-2 shadow mb-4">
              <label
                htmlFor=""
                className="font-semibold underline underline-offset-4 mb-2 block"
              >
                Diagnosis
              </label>
              <ul className="list-disc pl-5">
                {currentTreatment?.diagnoses?.map((diagnos) => (
                  <li key={diagnos.id}>{diagnos?.description}</li>
                ))}
              </ul>
            </div>
            <div className="border rounded p-2 shadow mb-4">
              <label
                htmlFor=""
                className="font-semibold underline underline-offset-4 mb-2 block"
              >
                Treatments
              </label>
              <ul className="list-disc pl-5">
                {currentTreatment?.treatments?.map((treatment) => (
                  <li key={treatment.id}>{treatment?.serviceName}</li>
                ))}
              </ul>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
              <Button style={{ marginLeft: "10px" }} onClick={handleCancel}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default TreatmentRequestPage;
