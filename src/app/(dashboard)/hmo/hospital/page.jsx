"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Menu,
  Dropdown,
  Button,
  Modal,
  Input,
  Pagination,
  Upload,
  Form,
  message,
} from "antd";
import { MoreOutlined, UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // 'add', 'edit', or 'bulk'
  const [editHospital, setEditHospital] = useState(null);
  const [fileList, setFileList] = useState([]);

  const router = useRouter(); // Initialize the router

  useEffect(() => {
    loadHospitals();
  }, [currentPage]);

  const loadHospitals = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/hospital?page=${currentPage}&limit=${pageSize}`
      );
      const data = await res.json();
      setHospitals(data.hospitals);
      setTotal(data.total);
    } catch (error) {
      message.error("Failed to load hospitals.");
    }
    setLoading(false);
  };

  const handleAddHospital = async (values) => {
    try {
      const res = await fetch("/api/hospital", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values }),
      });
      if (res.ok) {
        message.success("Hospital added successfully!");
        loadHospitals();
        resetModal();
      } else {
        message.error("Failed to add hospital.");
      }
    } catch (error) {
      message.error("Failed to add hospital.");
    }
  };

  const handleEdit = (record) => {
    setEditHospital(record);
    setModalType("edit");
    setIsModalVisible(true);
  };

  const handleUpdateHospital = async (values) => {
    try {
      const res = await fetch(`/api/hospital`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, id: editHospital.id }),
      });
      if (res.ok) {
        message.success("Hospital updated successfully!");
        loadHospitals();
        resetModal();
      } else {
        message.error("Failed to update hospital.");
      }
    } catch (error) {
      message.error("Failed to update hospital.");
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this hospital?",
      onOk: async () => {
        try {
          const res = await fetch(`/api/hospital`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
            }),
          });
          if (res.ok) {
            message.success("Hospital deleted successfully!");
            loadHospitals();
          } else {
            message.error("Failed to delete hospital.");
          }
        } catch (error) {
          message.error("Failed to delete hospital.");
        }
      },
    });
  };

  const menu = (record) => (
    <Menu>
      <Menu.Item key="1" onClick={() => handleEdit(record)}>
        Edit
      </Menu.Item>
      <Menu.Item key="2" onClick={() => handleDelete(record.id)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    { title: "Hospital Name", dataIndex: "hospitalName", key: "hospitalName" },
    { title: "Address", dataIndex: "hospitalAddress", key: "hospitalAddress" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleTableChange = (page) => {
    setCurrentPage(page);
  };

  const handleModalOpen = (type) => {
    setModalType(type);
    setIsModalVisible(true);
    setEditHospital(null); // Reset edit hospital
    if (type === "bulk") {
      setFileList([]); // Reset file list for bulk upload
    }
  };

  const resetModal = () => {
    setIsModalVisible(false);
    setEditHospital(null);
  };

  const handleBulkUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    fileList.forEach((file) => formData.append("file", file));
    try {
      const res = await fetch("/api/hospital/bulk", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        message.success("Bulk upload successful!");
        loadHospitals();
        resetModal();
      } else {
        message.error("Bulk upload failed.");
      }
    } catch (error) {
      message.error("Bulk upload failed.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="actions mb-4">
        <Button
          type="primary"
          onClick={() => handleModalOpen("add")}
          className="!bg-primary"
        >
          Add Hospital
        </Button>
        <Button type="default" onClick={() => handleModalOpen("bulk")}>
          Bulk Upload
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={hospitals}
        loading={loading}
        pagination={false}
        rowKey={(record) => record.id}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={handleTableChange}
        className="mt-4"
      />

      <Modal
        title={
          modalType === "bulk"
            ? "Bulk Upload Hospitals"
            : modalType === "edit"
            ? "Edit Hospital"
            : "Add Hospital"
        }
        visible={isModalVisible}
        onCancel={resetModal}
        footer={null}
      >
        {modalType === "bulk" ? (
          <Form layout="vertical">
            <Form.Item>
              <Upload
                multiple
                fileList={fileList}
                beforeUpload={(file) => {
                  setFileList([...fileList, file]);
                  return false;
                }}
                onRemove={(file) => {
                  setFileList(fileList.filter((item) => item.uid !== file.uid));
                }}
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>

            <Form.Item className="text-right">
              <Button
                type="primary"
                onClick={handleBulkUpload}
                className="!bg-primary"
                disabled={loading ? true : false}
              >
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form
            initialValues={editHospital || {}}
            onFinish={(values) => {
              modalType === "edit"
                ? handleUpdateHospital(values)
                : handleAddHospital(values);
            }}
          >
            <Form.Item
              label="Hospital Name"
              name="hospitalName"
              rules={[
                { required: true, message: "Please input the hospital name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Hospital Address"
              name="hospitalAddress"
              rules={[
                {
                  required: true,
                  message: "Please input the hospital address!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input the phone number!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input the email!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item className="text-right">
              <Button type="primary" htmlType="submit" className="!bg-primary">
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Hospitals;
