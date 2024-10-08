// src/app/(dashboard)/hmo/tariff-management/_components/drugs.jsx

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

const Drugs = () => {
  const [drugs, setDrugs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDrug, setEditingDrug] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5); // State for the number of items per page

  const [form] = Form.useForm(); // Create a form instance

  // Fetch drugs with pagination
  const fetchDrugs = async (page = 1, limit = pageSize) => {
    try {
      const response = await fetch(`/api/drugs?page=${page}&limit=${limit}`);
      const data = await response.json();
      if (response.ok) {
        setDrugs(data.drugs);
        setTotalCount(data.totalCount);
      } else {
        notification.error({ message: data.error });
      }
    } catch (error) {
      console.error("Error fetching drugs:", error);
      notification.error({ message: "Error fetching drugs" });
    }
  };

  useEffect(() => {
    fetchDrugs(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const showModal = (drug = null) => {
    setEditingDrug(drug);
    setIsEditing(!!drug);
    setIsModalVisible(true);

    if (!drug) {
      form.resetFields(); // Clear the form fields for new drug
    } else {
      form.setFieldsValue(drug); // Set fields for editing
    }
  };

  const handleOk = async (values) => {
    try {
      const id = isEditing ? editingDrug.id : undefined; // Get the ID for updating
      const method = isEditing ? "PUT" : "POST"; // Determine the method

      const response = await fetch(`/api/drugs`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, id }), // Send values without id, as it's handled in URL
      });

      const data = await response.json();

      if (response.ok) {
        notification.success({
          message: isEditing
            ? "Drug updated successfully!"
            : "Drug added successfully!",
        });
        fetchDrugs(currentPage, pageSize); // Refresh drugs list
      } else {
        notification.error({ message: data.error });
      }

      setIsModalVisible(false);
      setEditingDrug(null);
    } catch (error) {
      console.error("Error saving drug:", error);
      notification.error({ message: "Error saving drug" });
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this drug?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await fetch(`/api/drugs?id=${id}`, {
            method: "DELETE",
          });
          const data = await response.json();
          if (response.ok) {
            notification.success({ message: "Drug deleted successfully!" });
            fetchDrugs(currentPage, pageSize); // Refresh drugs list
          } else {
            notification.error({ message: data.error });
          }
        } catch (error) {
          console.error("Error deleting drug:", error);
          notification.error({ message: "Error deleting drug" });
        }
      },
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Group", dataIndex: "group", key: "group" },
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
      render: (_, drug) => (
        <Popover
          content={
            <div>
              <Button
                onClick={() => showModal(drug)}
                style={{ display: "block", marginBottom: 8 }}
              >
                Edit
              </Button>
              <Button type="danger" onClick={() => handleDelete(drug.id)}>
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
        Add Drug
      </Button>
      <Table
        dataSource={drugs}
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
        title={isEditing ? "Edit Drug" : "Add Drug"}
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
          <Form.Item name="group" label="Group" rules={[{ required: true }]}>
            <Input />
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

export default Drugs;
