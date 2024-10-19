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
  Tag,
  List,
} from "antd";
import {
  DollarCircleOutlined,
  MailOutlined,
  IdcardOutlined,
  PhoneOutlined,
  UserOutlined,
  CalendarOutlined,
  ProfileOutlined,
  UsergroupAddOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const ClaimRequestPage = () => {
  const [claimRequests, setClaimRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    const response = JSON.parse(localStorage.getItem("dcPortal-user"));
    if (response) {
      setUser(response);
    }
  }, []);

  useEffect(() => {
    const fetchClaimRequests = async () => {
      try {
        const response = await fetch(`/api/claim-request?userId=${user?.id}`);
        const data = await response.json();
        if (Array.isArray(data.claimRequests)) {
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

  const handleViewClick = (row) => {
    setSelectedClaim(row);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedClaim(null);
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
        <Button onClick={() => handleViewClick(row)} type="primary">
          View
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

      {/* Modal */}
      <Modal
        title={<Title level={3}>Claim Details</Title>}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose} type="primary">
            Close
          </Button>,
        ]}
        width={1000}
      >
        {selectedClaim && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col span={12}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Title level={5} style={{ color: "#555", marginBottom: 10 }}>
                    <UserOutlined /> Claim Information
                  </Title>
                  <Divider />
                  <Space direction="vertical" size="small">
                    <Row justify="space-between">
                      <Text strong>Enrollee:</Text>
                      <Text>{selectedClaim.enrollee}</Text>
                    </Row>
                    <Row justify="space-between">
                      <Text strong>Policy No:</Text>
                      <Text>{selectedClaim.policyNo}</Text>
                    </Row>
                    <Row justify="space-between">
                      <Text strong>Health Plan:</Text>
                      <Text>{selectedClaim.healthPlan}</Text>
                    </Row>
                    <Row justify="space-between">
                      <Text strong>Treatment Cost:</Text>
                      <Text
                        style={{ color: "green", fontWeight: "bold" }}
                      >{`$${selectedClaim.treatmentCost}`}</Text>
                    </Row>
                    {/* New Rows for Accepted and Rejected Costs */}
                    <Row justify="space-between">
                      <Text strong>Accepted Cost:</Text>
                      <Text style={{ color: "green", fontWeight: "bold" }}>
                        ${selectedClaim.acceptedCost}
                      </Text>
                    </Row>
                    <Row justify="space-between">
                      <Text strong>Rejected Cost:</Text>
                      <Text style={{ color: "red", fontWeight: "bold" }}>
                        ${selectedClaim.rejectedCost}
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
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Title level={5} style={{ color: "#555", marginBottom: 10 }}>
                    <IdcardOutlined /> Hospital Information
                  </Title>
                  <Divider />
                  <Space direction="vertical" size="small">
                    <Row justify="space-between">
                      <Text strong>Hospital Name:</Text>
                      <Text>{selectedClaim.hospitalName}</Text>
                    </Row>
                    <Row justify="space-between">
                      <Text strong>Email:</Text>
                      <Text>{selectedClaim.hospitalEmail}</Text>
                    </Row>
                    <Row justify="space-between">
                      <Text strong>Phone:</Text>
                      <Text>{selectedClaim.hospitalPhone}</Text>
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
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Title level={5} style={{ color: "#555", marginBottom: 10 }}>
                    <DollarCircleOutlined /> Status
                  </Title>
                  <Divider />
                  <Row justify="space-between" align="middle">
                    <Text strong>Status:</Text>
                    <Text>
                      {selectedClaim.status === "PENDING" ? (
                        <ExclamationCircleOutlined
                          style={{ color: "orange", marginRight: 8 }}
                        />
                      ) : (
                        <CheckCircleOutlined
                          style={{ color: "green", marginRight: 8 }}
                        />
                      )}
                      {selectedClaim.status}
                    </Text>
                  </Row>
                  {selectedClaim.comment && (
                    <>
                      <Divider />
                      <Text strong>Comment:</Text>{" "}
                      <Text>{selectedClaim.comment}</Text>
                    </>
                  )}
                </Card>
              </Col>

              <Col span={12}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Title level={5} style={{ color: "#555", marginBottom: 10 }}>
                    <UsergroupAddOutlined /> Responded By
                  </Title>
                  <Divider />
                  <Space direction="vertical" size="small">
                    <Row justify="space-between">
                      <Text strong>Responded By: </Text>
                      <Text> {selectedClaim?.hmo?.email || "N/A"}</Text>
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
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Title level={5} style={{ color: "#555", marginBottom: 10 }}>
                    <CalendarOutlined /> DOB & Gender
                  </Title>
                  <Divider />
                  <Space direction="vertical" size="small">
                    <Row justify="space-between">
                      <Text strong>Date of Birth:</Text>
                      <Text>{selectedClaim.dob || "N/A"}</Text>
                    </Row>
                    <Row justify="space-between">
                      <Text strong>Gender:</Text>
                      <Text>{selectedClaim.gender || "N/A"}</Text>
                    </Row>
                    <Row justify="space-between">
                      <Text strong>Company:</Text>
                      <Text>{selectedClaim.company || "N/A"}</Text>
                    </Row>
                  </Space>
                </Card>
              </Col>

              <Col span={12}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Title level={5} style={{ color: "#555", marginBottom: 10 }}>
                    <ProfileOutlined /> Treatments
                  </Title>
                  <Divider />
                  <List
                    dataSource={selectedClaim.claimRequestTreatments}
                    renderItem={(item) => (
                      <List.Item>
                        <Text>
                          {item.treatment.name} - ${item.treatment.price} &nbsp;
                          <Tag color={getStatusTagColor(item.status)}>
                            {item.status}
                          </Tag>
                          {item.status === "ACCEPTED" && (
                            <Text>
                              {" "}
                              (Accepted Quantity: {item.acceptedQuantity})
                            </Text>
                          )}
                        </Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col span={12}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Title level={5} style={{ color: "#555", marginBottom: 10 }}>
                    <MedicineBoxOutlined /> Claim Request Drugs
                  </Title>
                  <Divider />
                  <List
                    dataSource={selectedClaim.claimRequestDrugs}
                    renderItem={(item) => (
                      <List.Item>
                        <Text>
                          {item.drugs.name} (Qty: {item.quantity}) - $
                          {item.drugs.price} &nbsp;
                          <Tag color={getStatusTagColor(item.status)}>
                            {item.status}
                          </Tag>
                          {item.status === "ACCEPTED" && (
                            <Text>
                              {" "}
                              (Accepted Quantity: {item.acceptedQuantity})
                            </Text>
                          )}
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

const getStatusTagColor = (status) => {
  switch (status) {
    case "PENDING":
      return "yellow";
    case "ACCEPTED":
      return "green";
    case "COMPLETED":
      return "blue";
    default:
      return "default";
  }
};

export default ClaimRequestPage;
