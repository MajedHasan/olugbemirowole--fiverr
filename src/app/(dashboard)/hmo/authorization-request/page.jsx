"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Modal, Button, Form, Input, Select, Badge } from "antd"; // Import Badge and Form components
import AuthorizationRequestForm from "../../hospital/_components/AuthorizationRequestForm";

const { Option } = Select;

const AuthorizationRequestPage = () => {
  const [authorizationRequests, setAuthorizationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAuthorization, setCurrentAuthorization] = useState(null);
  const [form] = Form.useForm(); // Create a form instance
  const [user, setUser] = useState(null);
  const [hmo, setHmo] = useState(null);
  const [isAuthorizationPopupVisible, setIsAuthorizationPopupVisible] =
    useState(false);

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

  // Fetch treatment requests data
  useEffect(() => {
    const fetchAuthorizationRequests = async () => {
      try {
        const response = await fetch("/api/authorization-request");
        const data = await response.json();
        if (Array.isArray(data)) {
          setAuthorizationRequests(data);
        } else if (
          data.authorizationRequests &&
          Array.isArray(data.authorizationRequests)
        ) {
          setAuthorizationRequests(data.authorizationRequests);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching authorization requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorizationRequests();
  }, []);

  // Open modal for editing
  const handleEdit = (row) => {
    console.log(row);
    setCurrentAuthorization(row); // Store the row data for editing
    form.setFieldsValue(row); // Populate form fields with current treatment data
    setIsModalVisible(true); // Open the modal
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentAuthorization(null);
  };

  const handleFinish = async (values) => {
    const udpatedAuthorizationRequest = {
      ...currentAuthorization,
      status: values.status,
      policyNo: values.policyNo,
      enrollee: values.enrollee,
      treatmentCost: values.treatmentCost,
      responsedBy: hmo?.id,
    };

    // return console.log(udpatedAuthorizationRequest);

    try {
      const response = await fetch(`/api/authorization-request`, {
        method: "PUT", // or PATCH depending on your API design
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(udpatedAuthorizationRequest), // Send the edited values to your API
      });

      if (response.ok) {
        const updatedAuthorization = await response.json();
        // Update the treatmentRequests state with the updated treatment
        setAuthorizationRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === updatedAuthorization.id
              ? updatedAuthorization
              : request
          )
        );
        handleCancel(); // Close the modal after successful update
      } else {
        console.error("Failed to update the authorization request");
      }
    } catch (error) {
      console.error("Error updating authorization request:", error);
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
    // {
    //   name: "Health Plan",
    //   selector: (row) => row?.healthPlan || "N/A",
    //   sortable: true,
    // },
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
        <h1 className="text-2xl font-bold mb-4">Authorization Requests</h1>
        <Button
          type="primary"
          className="!bg-primary"
          onClick={() => setIsAuthorizationPopupVisible(true)}
        >
          Create Request
        </Button>
        <AuthorizationRequestForm
          visible={isAuthorizationPopupVisible}
          onClose={() => setIsAuthorizationPopupVisible(false)}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : authorizationRequests.length > 0 ? (
        <DataTable columns={columns} data={authorizationRequests} pagination />
      ) : (
        <p>No records found</p>
      )}

      {/* Modal for Editing */}
      {currentAuthorization && (
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
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="policyNo"
              label="Policy Number"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="treatmentCost"
              label="Treatment Cost"
              rules={[{ required: true }]}
            >
              <Input type="number" disabled />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select>
                <Option
                  value="PENDING"
                  disabled={
                    currentAuthorization.status === "PENDING"
                      ? false
                      : currentAuthorization.status === "ACCEPTED"
                      ? true
                      : true
                  }
                >
                  Pending
                </Option>
                <Option
                  value="ACCEPTED"
                  disabled={
                    currentAuthorization.status === "COMPLETED" ? true : false
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
                {currentAuthorization?.diagnosis?.map((diagnos) => (
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
                {currentAuthorization?.treatments?.map((treatment) => (
                  <li key={treatment.id}>{treatment?.name}</li>
                ))}
              </ul>
            </div>
            <div className="border rounded p-2 shadow mb-4">
              <label
                htmlFor=""
                className="font-semibold underline underline-offset-4 mb-2 block"
              >
                Drugs
              </label>
              <ul className="list-disc pl-5">
                {currentAuthorization?.authorizationRequestDrugs?.map(
                  (drug) => (
                    <li key={drug?.drugs?.id}>
                      {drug?.drugs?.name} || QTY ( {drug?.quantity} )
                    </li>
                  )
                )}
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

export default AuthorizationRequestPage;
