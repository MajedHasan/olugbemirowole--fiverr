"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Row,
  Col,
  Modal,
  Button,
  Form,
  Input,
  Select,
  Card,
  Badge,
  Divider,
  Tooltip,
  Tag,
} from "antd";
import {
  MedicineBoxOutlined,
  MoneyCollectOutlined,
  BarcodeOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  UserOutlined,
  FileDoneOutlined,
  SolutionOutlined,
  InfoCircleOutlined,
  HeartOutlined,
  EditOutlined,
} from "@ant-design/icons";
import AuthorizationRequestForm from "../../hospital/_components/AuthorizationRequestForm";

const { Option } = Select;

const AuthorizationRequestPage = () => {
  const [authorizationRequests, setAuthorizationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAuthorization, setCurrentAuthorization] = useState(null);
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [hmo, setHmo] = useState(null);
  const [isAuthorizationPopupVisible, setIsAuthorizationPopupVisible] =
    useState(false);

  const isStatusEditable =
    currentAuthorization?.status !== "ACCEPTED" &&
    currentAuthorization?.status !== "REJECTED";

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
    const updatedAuthorizationRequest = {
      ...currentAuthorization,
      status: values.status,
      responsedBy: hmo?.id,
    };

    try {
      const response = await fetch(`/api/authorization-request`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAuthorizationRequest),
      });

      if (response.ok) {
        const updatedAuthorization = await response.json();
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
      name: "Authorization Code",
      selector: (row) => row?.authorizationCode || "N/A",
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
      name: "Submitted At",
      selector: (row) =>
        row?.createdAt ? new Date(row.createdAt).toLocaleString() : "N/A",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(row)}
        >
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
          title={<h2 style={{ color: "#1890ff" }}>Authorization Request</h2>}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={900}
          centered
          bodyStyle={{ padding: "20px", backgroundColor: "#f0f2f5" }}
        >
          <Form
            form={form}
            onFinish={handleFinish}
            layout="vertical"
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            {/* Primary Information */}
            <Divider orientation="left">
              <Tag color="blue" icon={<FileDoneOutlined />}>
                Basic Information
              </Tag>
            </Divider>
            <Row gutter={[16, 16]} align="middle">
              <Col span={8}>
                <Card>
                  <p>
                    <strong>Authorization ID:</strong> {currentAuthorization.id}
                  </p>
                  <p>
                    <strong>Policy Number:</strong>{" "}
                    {currentAuthorization.policyNo}
                  </p>
                  <p>
                    <strong>Health Plan:</strong>{" "}
                    <Tag color="gold">{currentAuthorization.healthPlan}</Tag>
                  </p>
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Form.Item name="status" label="Status">
                    <Select>
                      <Option
                        value="PENDING"
                        disabled={currentAuthorization.status !== "PENDING"}
                      >
                        Pending
                      </Option>
                      <Option
                        value="ACCEPTED"
                        disabled={currentAuthorization.status !== "PENDING"}
                      >
                        Accepted
                      </Option>
                      <Option
                        value="REJECTED"
                        disabled={currentAuthorization.status !== "PENDING"}
                      >
                        Rejected
                      </Option>
                      <Option
                        value="COMPLETED"
                        disabled={currentAuthorization.status !== "ACCEPTED"}
                      >
                        Completed
                      </Option>
                    </Select>
                  </Form.Item>
                  <p>
                    <strong>Submitted By:</strong>{" "}
                    {currentAuthorization.submitedBy}
                  </p>
                  <p>
                    <strong>Responded By:</strong>{" "}
                    {currentAuthorization.responsedBy}
                  </p>
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(currentAuthorization.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Updated At:</strong>{" "}
                    {new Date(currentAuthorization.updatedAt).toLocaleString()}
                  </p>
                </Card>
              </Col>
            </Row>

            {/* Hospital & HMO Information */}
            <Divider orientation="left">
              <Tag color="green" icon={<SolutionOutlined />}>
                Hospital & HMO Information
              </Tag>
            </Divider>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card
                  title={
                    <span>
                      <HomeOutlined /> Hospital Information
                    </span>
                  }
                  bordered={false}
                  style={{
                    borderRadius: "10px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <p>
                    <strong>Name:</strong> {currentAuthorization.hospitalName}
                  </p>
                  <p>
                    <MailOutlined /> {currentAuthorization.hospitalEmail}
                  </p>
                  <p>
                    <PhoneOutlined /> {currentAuthorization.hospitalPhone}
                  </p>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title={
                    <span>
                      <UserOutlined /> HMO Information
                    </span>
                  }
                  bordered={false}
                  style={{
                    borderRadius: "10px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <p>
                    <strong>Email:</strong> {currentAuthorization.hmo?.email}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {currentAuthorization.hmo?.phoneNumber}
                  </p>
                  <p>
                    <strong>Permissions:</strong>{" "}
                    <Tag color="blue">
                      {currentAuthorization.hmo?.permissions}
                    </Tag>
                  </p>
                </Card>
              </Col>
            </Row>

            {/* Cost and Authorization */}
            <Divider orientation="left">
              <Tag color="volcano" icon={<BarcodeOutlined />}>
                Cost & Authorization
              </Tag>
            </Divider>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card
                  style={{ borderRadius: "10px", backgroundColor: "#fff7e6" }}
                  bordered={false}
                >
                  <MoneyCollectOutlined
                    style={{ fontSize: "18px", color: "#fa8c16" }}
                  />
                  <span style={{ marginLeft: "8px" }}>
                    <strong>Treatment Cost:</strong> $
                    {currentAuthorization.treatmentCost}
                  </span>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  style={{ borderRadius: "10px", backgroundColor: "#f9f0ff" }}
                  bordered={false}
                >
                  <BarcodeOutlined
                    style={{ fontSize: "18px", color: "#722ed1" }}
                  />
                  <span style={{ marginLeft: "8px" }}>
                    <strong>Authorization Code:</strong>{" "}
                    {currentAuthorization.authorizationCode}
                  </span>
                </Card>
              </Col>
            </Row>

            {/* Diagnosis */}
            <Divider orientation="left">
              <Tag color="purple" icon={<HeartOutlined />}>
                Diagnosis
              </Tag>
            </Divider>
            <Card
              bordered={false}
              style={{
                backgroundColor: "#fafafa",
                borderRadius: 10,
                padding: "16px",
              }}
            >
              <ul>
                {currentAuthorization?.diagnosis?.map((diagnosis, idx) => (
                  <li key={idx}>
                    <Tooltip title={diagnosis.description}>
                      <MedicineBoxOutlined /> {diagnosis.name} ({diagnosis.code}
                      )
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Treatments */}
            <Divider orientation="left">
              <Tag color="magenta" icon={<InfoCircleOutlined />}>
                Treatments
              </Tag>
            </Divider>
            <Card
              bordered={false}
              style={{ backgroundColor: "#fff0f6", borderRadius: 10 }}
            >
              <ul>
                {currentAuthorization?.treatments?.map((treatment, idx) => (
                  <li key={idx}>
                    <strong>{treatment.name}</strong> - ${treatment.price}{" "}
                    {treatment.isApprovalRequired && (
                      <Badge color="red" text="Approval Required" />
                    )}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Drugs */}
            <Divider orientation="left">
              <Tag color="red" icon={<MedicineBoxOutlined />}>
                Drugs
              </Tag>
            </Divider>
            <Card
              bordered={false}
              style={{ backgroundColor: "#fff0f6", borderRadius: 10 }}
            >
              <ul>
                {currentAuthorization?.authorizationRequestDrugs?.map(
                  (drug, idx) => (
                    <li key={idx}>
                      <strong>{drug.drugs.name}</strong> - ${drug.drugs.price}{" "}
                      (Quantity: {drug.quantity}) -{" "}
                      <Tag color="blue">{drug.drugs.group}</Tag>
                    </li>
                  )
                )}
              </ul>
            </Card>

            {/* Action Buttons */}
            <Row justify="end" style={{ marginTop: "20px" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 10 }}
              >
                Update
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Row>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default AuthorizationRequestPage;
