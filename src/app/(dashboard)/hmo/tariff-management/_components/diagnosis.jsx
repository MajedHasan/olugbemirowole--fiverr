// src/app/(dashboard)/hmo/tariff-management/_components/diagnosis.jsx

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
} from "antd";
import { MoreOutlined } from "@ant-design/icons";

const Diagnosis = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDiagnosis, setEditingDiagnosis] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5); // State for the number of items per page

  const [form] = Form.useForm(); // Create a form instance

  // Fetch diagnoses with pagination
  const fetchDiagnoses = async (page = 1, limit = pageSize) => {
    try {
      const response = await fetch(
        `/api/diagnosis?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      if (response.ok) {
        setDiagnoses(data.diagnoses);
        setTotalCount(data.totalCount);
      } else {
        notification.error({ message: data.error });
      }
    } catch (error) {
      console.error("Error fetching diagnoses:", error);
      notification.error({ message: "Error fetching diagnoses" });
    }
  };

  useEffect(() => {
    fetchDiagnoses(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const showModal = (diagnosis = null) => {
    setEditingDiagnosis(diagnosis);
    setIsEditing(!!diagnosis);
    setIsModalVisible(true);

    if (!diagnosis) {
      form.resetFields(); // Clear the form fields for new diagnosis
    } else {
      form.setFieldsValue(diagnosis); // Set fields for editing
    }
  };

  const handleOk = async (values) => {
    try {
      const id = isEditing ? editingDiagnosis.id : undefined; // Get the ID for updating
      const method = isEditing ? "PUT" : "POST"; // Determine the method

      const response = await fetch(`/api/diagnosis`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, id }), // Include ID for update
      });

      const data = await response.json();

      if (response.ok) {
        notification.success({
          message: isEditing
            ? "Diagnosis updated successfully!"
            : "Diagnosis added successfully!",
        });
        fetchDiagnoses(currentPage, pageSize); // Refresh diagnosis list
      } else {
        notification.error({ message: data.error });
      }

      setIsModalVisible(false);
      setEditingDiagnosis(null);
    } catch (error) {
      console.error("Error saving diagnosis:", error);
      notification.error({ message: "Error saving diagnosis" });
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this diagnosis?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await fetch(`/api/diagnosis?id=${id}`, {
            method: "DELETE",
          });
          const data = await response.json();
          if (response.ok) {
            notification.success({
              message: "Diagnosis deleted successfully!",
            });
            fetchDiagnoses(currentPage, pageSize); // Refresh diagnosis list
          } else {
            notification.error({ message: data.error });
          }
        } catch (error) {
          console.error("Error deleting diagnosis:", error);
          notification.error({ message: "Error deleting diagnosis" });
        }
      },
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Code", dataIndex: "code", key: "code" },
    {
      title: "Actions",
      key: "actions",
      render: (_, diagnosis) => (
        <Popover
          content={
            <div>
              <Button
                onClick={() => showModal(diagnosis)}
                style={{ display: "block", marginBottom: 8 }}
              >
                Edit
              </Button>
              <Button type="danger" onClick={() => handleDelete(diagnosis.id)}>
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
        Add Diagnosis
      </Button>
      <Table
        dataSource={diagnoses}
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
        title={isEditing ? "Edit Diagnosis" : "Add Diagnosis"}
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
          <Form.Item name="code" label="Code" rules={[{ required: true }]}>
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

export default Diagnosis;
