"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Badge,
  Modal,
  Button,
  Row,
  Col,
  Typography,
  Card,
  Divider,
  Space,
  List,
} from "antd";
import {
  UserOutlined,
  IdcardOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const AuthorizationRequestPage = () => {
  const [authorizationRequests, setAuthorizationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const response = JSON.parse(localStorage.getItem("dcPortal-user"));
    if (response) {
      setUser(response);
    }
  }, []);

  useEffect(() => {
    const fetchAuthorizationRequests = async () => {
      try {
        const response = await fetch(
          `/api/authorization-request?userId=${user?.id}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setAuthorizationRequests(data);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching authorization requests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAuthorizationRequests();
  }, [user]);

  const handleViewClick = (row) => {
    setSelectedRequest(row);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRequest(null);
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
      name: "Status",
      selector: (row) => (
        <Badge status={getStatusBadge(row.status)} text={row.status} />
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Button type="primary" onClick={() => handleViewClick(row)}>
          View
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
    <div className="p-6 bg-light-gray">
      <Title level={2} style={{ color: "#333" }}>
        Authorization Requests
      </Title>
      {loading ? (
        <p>Loading...</p>
      ) : authorizationRequests.length > 0 ? (
        <DataTable
          columns={columns}
          data={authorizationRequests}
          pagination
          striped
          highlightOnHover
          customStyles={{
            headCells: {
              style: {
                backgroundColor: "#f0f2f5",
                fontWeight: "600",
              },
            },
            cells: {
              style: {
                borderBottom: "1px solid #e8e8e8",
              },
            },
          }}
        />
      ) : (
        <p>No records found</p>
      )}

      {/* Modal */}
      <Modal
        title={
          <Title level={3} style={{ color: "#555" }}>
            Authorization Request Details
          </Title>
        }
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose} type="primary">
            Close
          </Button>,
        ]}
        width={1000}
      >
        {selectedRequest && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col span={12}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Title level={5} style={{ color: "#555" }}>
                    <UserOutlined /> Enrollee Information
                  </Title>
                  <Divider />
                  <Space direction="vertical" size="small">
                    <Row justify="space-between">
                      <Text strong>Enrollee:</Text>
                      <Text>{selectedRequest.enrollee}</Text>
                    </Row>
                    <Row justify="space-between">
                      <Text strong>Policy No:</Text>
                      <Text>{selectedRequest.policyNo}</Text>
                    </Row>
                    <Row justify="space-between">
                      <Text strong>Treatment Cost:</Text>
                      <Text style={{ color: "#4CAF50", fontWeight: "bold" }}>
                        ${selectedRequest.treatmentCost}
                      </Text>
                    </Row>
                  </Space>
                </Card>
              </Col>

              <Col span={12}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Title level={5} style={{ color: "#555" }}>
                    <IdcardOutlined /> Hospital Information
                  </Title>
                  <Divider />
                  <Space direction="vertical" size="small">
                    <Row justify="space-between">
                      <Text strong>Hospital Name:</Text>
                      <Text>{selectedRequest.hospitalName}</Text>
                    </Row>
                    <Row justify="space-between">
                      <Text strong>Email:</Text>
                      <Text>{selectedRequest.hospitalEmail}</Text>
                    </Row>
                    <Row justify="space-between">
                      <Text strong>Phone:</Text>
                      <Text>{selectedRequest.hospitalPhone}</Text>
                    </Row>
                  </Space>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col span={12}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Title level={5} style={{ color: "#555" }}>
                    <CalendarOutlined /> Request Date
                  </Title>
                  <Divider />
                  <Text>
                    {new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </Text>
                </Card>
              </Col>

              <Col span={12}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Title level={5} style={{ color: "#555" }}>
                    <CheckCircleOutlined /> Status
                  </Title>
                  <Divider />
                  <Text>
                    {selectedRequest.status === "PENDING" ? (
                      <ExclamationCircleOutlined
                        style={{ color: "orange", marginRight: 8 }}
                      />
                    ) : (
                      <CheckCircleOutlined
                        style={{ color: "green", marginRight: 8 }}
                      />
                    )}
                    {selectedRequest.status}
                  </Text>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Title level={5} style={{ color: "#555" }}>
                    Diagnosis
                  </Title>
                  <Divider />
                  <List
                    dataSource={selectedRequest.diagnosis}
                    renderItem={(item) => (
                      <List.Item>
                        <Text>
                          {item.name} (Code: {item.code})
                        </Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              <Col span={12}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Title level={5} style={{ color: "#555" }}>
                    Treatments
                  </Title>
                  <Divider />
                  <List
                    dataSource={selectedRequest.treatments}
                    renderItem={(item) => (
                      <List.Item>
                        <Text>
                          {item.name} - ${item.price}
                          {item.isApprovalRequired && " (Approval Required)"}
                        </Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Title level={5} style={{ color: "#555" }}>
                    Authorized Drugs
                  </Title>
                  <Divider />
                  <List
                    dataSource={selectedRequest.authorizationRequestDrugs}
                    renderItem={(item) => (
                      <List.Item>
                        <Text>
                          {item.drugs.name} - {item.quantity} x $
                          {item.drugs.price}
                          {item.drugs.isApprovalRequired &&
                            " (Approval Required)"}
                        </Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuthorizationRequestPage;
