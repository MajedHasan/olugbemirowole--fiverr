// src/app/(dashboard)/hmo/tariff-management/_components/treatment.jsx

"use client"; // Declare this as a client component

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  notification,
  Popover,
  Badge,
  Checkbox,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";

const Treatment = () => {
  const [treatments, setTreatments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5); // State for the number of items per page

  const [form] = Form.useForm(); // Create a form instance

  // Fetch treatments with pagination
  const fetchTreatments = async (page = 1, limit = pageSize) => {
    try {
      const response = await fetch(
        `/api/treatments?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      if (response.ok) {
        setTreatments(data.treatments);
        setTotalCount(data.totalCount);
      } else {
        notification.error({ message: data.error });
      }
    } catch (error) {
      console.error("Error fetching treatments:", error);
      notification.error({ message: "Error fetching treatments" });
    }
  };

  useEffect(() => {
    fetchTreatments(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const showModal = (treatment = null) => {
    setEditingTreatment(treatment);
    setIsEditing(!!treatment);
    setIsModalVisible(true);

    if (!treatment) {
      form.resetFields(); // Clear the form fields for new treatment
    } else {
      form.setFieldsValue(treatment); // Set fields for editing
    }
  };

  const handleOk = async (values) => {
    try {
      const id = isEditing ? editingTreatment.id : undefined; // Get the ID for updating
      const method = isEditing ? "PUT" : "POST"; // Determine the method

      const response = await fetch(`/api/treatments`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, id }), // Include ID for update
      });

      const data = await response.json();

      if (response.ok) {
        notification.success({
          message: isEditing
            ? "Treatment updated successfully!"
            : "Treatment added successfully!",
        });
        fetchTreatments(currentPage, pageSize); // Refresh treatment list
      } else {
        notification.error({ message: data.error });
      }

      setIsModalVisible(false);
      setEditingTreatment(null);
    } catch (error) {
      console.error("Error saving treatment:", error);
      notification.error({ message: "Error saving treatment" });
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this treatment?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await fetch(`/api/treatments?id=${id}`, {
            method: "DELETE",
          });
          const data = await response.json();
          if (response.ok) {
            notification.success({
              message: "Treatment deleted successfully!",
            });
            fetchTreatments(currentPage, pageSize); // Refresh treatment list
          } else {
            notification.error({ message: data.error });
          }
        } catch (error) {
          console.error("Error deleting treatment:", error);
          notification.error({ message: "Error deleting treatment" });
        }
      },
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Is Approval Required",
      dataIndex: "isApprovalRequired",
      key: "isApprovalRequired",
      render: (isApprovalRequired) => (
        <Badge
          color={isApprovalRequired ? "green" : "red"}
          text={isApprovalRequired ? "Yes" : "No"}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, treatment) => (
        <Popover
          content={
            <div>
              <Button
                onClick={() => showModal(treatment)}
                style={{ display: "block", marginBottom: 8 }}
              >
                Edit
              </Button>
              <Button type="danger" onClick={() => handleDelete(treatment.id)}>
                Delete
              </Button>
            </div>
          }
          trigger="click"
        >
          <Button icon={<MoreOutlined />} />
        </Popover>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => showModal()}>
        Add Treatment
      </Button>
      <Table
        dataSource={treatments}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalCount,
          onChange: (page, size) => {
            setCurrentPage(page); // Handle page change
            setPageSize(size); // Handle page size change
          },
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"], // Allow users to select page size
        }}
      />

      <Modal
        title={isEditing ? "Edit Treatment" : "Add Treatment"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields(); // Reset form when modal is closed
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleOk}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="isApprovalRequired"
            label="Is Approval Required"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Treatment;
