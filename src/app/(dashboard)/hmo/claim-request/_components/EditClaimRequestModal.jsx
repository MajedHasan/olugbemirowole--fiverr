import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Badge,
  Collapse,
  Table,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";

const { Option } = Select;
const { Panel } = Collapse;
const { Title } = Typography;

const EditClaimRequestModal = ({
  isVisible,
  handleCancel,
  currentClaim,
  form,
  handleFinish,
}) => {
  const [claimRequestTreatments, setClaimRequestTreatments] = useState([]);
  const [claimRequestDrugs, setClaimRequestDrugs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentClaim) {
      setClaimRequestTreatments(currentClaim.claimRequestTreatments);
      setClaimRequestDrugs(currentClaim.claimRequestDrugs);
    }
  }, [currentClaim]);

  // Update the status of all treatments and drugs based on the main claim status
  const updateAllStatus = (newStatus) => {
    if (
      currentClaim.status === "ACCEPTED" ||
      currentClaim.status === "REJECTED"
    )
      return; // Prevent changes if main status is already accepted or rejected

    setClaimRequestTreatments((prev) =>
      prev.map((treatment) => ({
        ...treatment,
        status:
          treatment.status === "ACCEPTED" || treatment.status === "REJECTED"
            ? treatment.status
            : newStatus,
      }))
    );
    setClaimRequestDrugs((prev) =>
      prev.map((drug) => ({
        ...drug,
        status:
          drug.status === "ACCEPTED" || drug.status === "REJECTED"
            ? drug.status
            : newStatus,
        acceptedQuantity:
          newStatus === "ACCEPTED" || newStatus === "REJECTED"
            ? drug.quantity
            : drug.acceptedQuantity,
      }))
    );
  };

  const handleMainStatusChange = (value) => {
    form.setFieldsValue({ status: value });
    updateAllStatus(value);
  };

  const handleDrugStatusChange = (id, value) => {
    const updatedDrugs = claimRequestDrugs.map((drug) => {
      if (drug.id === id) {
        return {
          ...drug,
          status:
            drug.status === "ACCEPTED" || drug.status === "REJECTED"
              ? drug.status
              : value,
        };
      }
      return drug;
    });
    setClaimRequestDrugs(updatedDrugs);
  };

  const handleDrugQuantityChange = (id, value) => {
    const updatedDrugs = claimRequestDrugs.map((drug) => {
      if (drug.id === id) {
        return { ...drug, acceptedQuantity: value };
      }
      return drug;
    });
    setClaimRequestDrugs(updatedDrugs);
  };

  const handleTreatmentStatusChange = (id, value) => {
    const updatedTreatments = claimRequestTreatments.map((treatment) => {
      if (treatment.id === id) {
        return {
          ...treatment,
          status:
            treatment.status === "ACCEPTED" || treatment.status === "REJECTED"
              ? treatment.status
              : value,
        };
      }
      return treatment;
    });
    setClaimRequestTreatments(updatedTreatments);
  };

  const treatmentsColumns = [
    {
      title: "Treatment Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => record.treatment.name,
    },
    {
      title: "Unit Price",
      dataIndex: "price",
      key: "price",
      render: (_, record) => `$${record.treatment.price}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleTreatmentStatusChange(record.id, value)}
          disabled={
            currentClaim.status === "ACCEPTED" ||
            currentClaim.status === "REJECTED" ||
            status === "ACCEPTED" ||
            status === "REJECTED"
          }
        >
          <Option value="PENDING">Pending</Option>
          <Option value="ACCEPTED">Accepted</Option>
          <Option value="REJECTED">Rejected</Option>
        </Select>
      ),
    },
  ];

  const drugsColumns = [
    {
      title: "Drug Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => record.drugs.name,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Accepted Quantity",
      dataIndex: "acceptedQuantity",
      key: "acceptedQuantity",
      render: (acceptedQuantity, record) => (
        <Input
          type="number"
          value={acceptedQuantity}
          onChange={(e) => handleDrugQuantityChange(record.id, e.target.value)}
          disabled={
            record.status === "ACCEPTED" || record.status === "REJECTED"
          }
        />
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "price",
      key: "price",
      render: (_, record) => `$${record.drugs.price}`,
    },
    {
      title: "Total Price",
      dataIndex: "total",
      key: "total",
      render: (_, record) => `$${record.drugs.price * record.quantity}`,
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
      render: (_, record) => record.drugs.group,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleDrugStatusChange(record.id, value)}
          disabled={
            currentClaim.status === "ACCEPTED" ||
            currentClaim.status === "REJECTED" ||
            status === "ACCEPTED" ||
            status === "REJECTED"
          }
        >
          <Option value="PENDING">Pending</Option>
          <Option value="ACCEPTED">Accepted</Option>
          <Option value="REJECTED">Rejected</Option>
        </Select>
      ),
    },
  ];

  const handleFormSubmit = async (values) => {
    try {
      await setLoading(true);
      const updatedClaimRequest = await {
        ...values,
        claimRequestTreatments,
        claimRequestDrugs,
      };
      await handleFinish(updatedClaimRequest);
    } catch (error) {
      console.log(error);
    } finally {
      await setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Title level={4} style={{ color: "#4a90e2", margin: 0 }}>
          Edit Claim Request
        </Title>
      }
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      width={900}
      style={{ top: 20 }}
      bodyStyle={{
        backgroundColor: "#f9fafb",
        padding: "30px 50px",
        borderRadius: "12px",
        boxShadow: "0 15px 50px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Form
        form={form}
        onFinish={handleFormSubmit}
        layout="vertical"
        style={{ gap: "24px" }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <Form.Item name="id" label="Claim ID" style={{ flex: "1 1 30%" }}>
            <Input
              disabled
              value={currentClaim.id}
              prefix={<InfoCircleOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="policyNo"
            label="Policy Number"
            style={{ flex: "1 1 30%" }}
          >
            <Input
              disabled
              value={currentClaim.policyNo}
              prefix={<InfoCircleOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="healthPlan"
            label="Health Plan"
            style={{ flex: "1 1 30%" }}
          >
            <Input
              disabled
              value={currentClaim.healthPlan}
              prefix={<InfoCircleOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="hospitalName"
            label="Hospital Name"
            style={{ flex: "1 1 30%" }}
          >
            <Input
              disabled
              value={currentClaim.hospitalName}
              prefix={<InfoCircleOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="hospitalEmail"
            label="Hospital Email"
            style={{ flex: "1 1 30%" }}
          >
            <Input
              disabled
              value={currentClaim.hospitalEmail || "N/A"}
              prefix={<InfoCircleOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="hospitalPhone"
            label="Hospital Phone"
            style={{ flex: "1 1 30%" }}
          >
            <Input
              disabled
              value={currentClaim.hospitalPhone}
              prefix={<InfoCircleOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="enrollee"
            label="Enrollee"
            style={{ flex: "1 1 30%" }}
          >
            <Input
              disabled
              value={currentClaim.enrollee}
              prefix={<InfoCircleOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="submitedBy"
            label="Submitted By"
            style={{ flex: "1 1 30%" }}
          >
            <Input
              disabled
              value={currentClaim.submitedBy}
              prefix={<InfoCircleOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="createdAt"
            label="Created At"
            style={{ flex: "1 1 30%" }}
          >
            <Input
              disabled
              value={new Date(currentClaim.createdAt).toLocaleString()}
              prefix={<InfoCircleOutlined />}
            />
          </Form.Item>

          <Form.Item name="status" label="Status" style={{ flex: "1 1 30%" }}>
            <Select
              defaultValue={currentClaim.status}
              onChange={handleMainStatusChange}
              prefix={<InfoCircleOutlined />}
              disabled={
                currentClaim.status === "ACCEPTED" ||
                currentClaim.status === "REJECTED"
              }
            >
              <Option value="PENDING">
                <Badge color="orange" text="Pending" />
              </Option>
              <Option value="ACCEPTED">
                <Badge color="green" text="Accepted" />
              </Option>
              <Option value="REJECTED">
                <Badge color="red" text="Rejected" />
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dob"
            label="Date of Birth"
            style={{ flex: "1 1 30%" }}
          >
            <Input
              disabled
              value={currentClaim.dob || "N/A"}
              prefix={<InfoCircleOutlined />}
            />
          </Form.Item>

          <Form.Item name="gender" label="Gender" style={{ flex: "1 1 30%" }}>
            <Input
              disabled
              value={currentClaim.gender || "N/A"}
              prefix={<InfoCircleOutlined />}
            />
          </Form.Item>

          <Form.Item name="company" label="Company" style={{ flex: "1 1 30%" }}>
            <Input
              disabled
              value={currentClaim.company || "N/A"}
              prefix={<InfoCircleOutlined />}
            />
          </Form.Item>

          <Form.Item name="comment" label="Comment" style={{ flex: "1 1 30%" }}>
            <TextArea
              value={currentClaim.comment || "N/A"}
              prefix={<InfoCircleOutlined />}
            />
          </Form.Item>
        </div>

        {/* Diagnosis Section */}
        <div style={{ marginBottom: "20px" }}>
          <h3>Diagnosis</h3>
          <Collapse>
            <Panel header="View Diagnosis" key="1">
              {currentClaim.diagnosis.map((diag) => (
                <div key={diag.id}>
                  <strong>{diag.name}</strong> - Code: {diag.code}
                </div>
              ))}
            </Panel>
          </Collapse>
        </div>

        {/* Claim Request Treatments Table */}
        <Collapse style={{ marginBottom: "20px" }}>
          <Panel header="Claim Request Treatments" key="1">
            <Table
              dataSource={claimRequestTreatments}
              columns={treatmentsColumns}
              pagination={false}
              rowKey="id"
            />
          </Panel>
        </Collapse>

        {/* Claim Request Drugs Table */}
        <Collapse>
          <Panel header="Claim Request Drugs" key="1">
            <Table
              dataSource={claimRequestDrugs}
              columns={drugsColumns}
              pagination={false}
              rowKey="id"
            />
          </Panel>
        </Collapse>

        {/* Cost Summary */}
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f0f2f5",
            borderRadius: "8px",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>
            Treatment Cost: <span>${currentClaim.treatmentCost}</span>
          </div>
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>
            Accepted Cost: <span>${currentClaim.acceptedCost}</span>
          </div>
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>
            Rejected Cost: <span>${currentClaim.rejectedCost}</span>
          </div>
        </div>

        {/* Footer Buttons */}
        <Form.Item style={{ marginTop: "24px", textAlign: "right" }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<CheckCircleOutlined />}
            style={{
              backgroundColor: "#4CAF50",
              borderColor: "#4CAF50",
              color: "#fff",
              fontWeight: "600",
              padding: "8px 20px",
              borderRadius: "8px",
              transition: "background 0.3s ease",
            }}
            disabled={loading}
          >
            {loading ? "Updating" : "Save"}
          </Button>
          <Button
            style={{
              marginLeft: "10px",
              backgroundColor: "#ff4d4f",
              borderColor: "#ff4d4f",
              color: "#fff",
              fontWeight: "600",
              padding: "8px 20px",
              borderRadius: "8px",
              transition: "background 0.3s ease",
            }}
            onClick={handleCancel}
            icon={<CloseCircleOutlined />}
            disabled={loading}
          >
            {loading ? "Updating" : "Cancel"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditClaimRequestModal;
