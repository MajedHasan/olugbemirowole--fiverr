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

const Organisation = () => {
  const [organisation, setOrganisation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // 'add', 'edit', or 'bulk'
  const [editOrganisation, setEditOrganisation] = useState(null);
  const [fileList, setFileList] = useState([]);

  const router = useRouter(); // Initialize the router

  useEffect(() => {
    loadOrganisations();
  }, [currentPage]);

  const loadOrganisations = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/organisation?page=${currentPage}&limit=${pageSize}`
      );
      const data = await res.json();
      setOrganisation(data.organisations);
      setTotal(data.total);
    } catch (error) {
      message.error("Failed to load organisations.");
    }
    setLoading(false);
  };

  const handleAddOrganisation = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("/api/organisation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values }),
      });
      if (res.ok) {
        message.success("Organisation added successfully!");
        loadOrganisations();
        resetModal();
      } else {
        message.error("Failed to add organisation.");
      }
    } catch (error) {
      message.error("Failed to add organisation.");
    }
    setLoading(false);
  };

  const handleEdit = (record) => {
    setEditOrganisation(record);
    setModalType("edit");
    setIsModalVisible(true);
  };

  const handleUpdateOrganisation = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/organisation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, id: editOrganisation.id }),
      });
      if (res.ok) {
        message.success("Organisation updated successfully!");
        loadOrganisations();
        resetModal();
      } else {
        message.error("Failed to update organisation.");
      }
    } catch (error) {
      message.error("Failed to update organisation.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    Modal.confirm({
      title: "Are you sure you want to delete this organisation?",
      onOk: async () => {
        try {
          const res = await fetch(`/api/organisation`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
            }),
          });
          if (res.ok) {
            message.success("Organisation deleted successfully!");
            loadOrganisations();
          } else {
            message.error("Failed to delete organisation.");
          }
        } catch (error) {
          message.error("Failed to delete organisation.");
        }
      },
    });
    setLoading(false);
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
    { title: "Company Name", dataIndex: "companyName", key: "companyName" },
    { title: "Company ID", dataIndex: "companyID", key: "companyID" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Client Service Officer",
      dataIndex: "clientServiceOfficer",
      key: "clientServiceOfficer",
    },
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
    setEditOrganisation(null); // Reset edit hospital
    if (type === "bulk") {
      setFileList([]); // Reset file list for bulk upload
    }
  };

  const resetModal = () => {
    setIsModalVisible(false);
    setEditOrganisation(null);
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
        loadOrganisations();
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
          Add Organisation
        </Button>
        <Button type="default" onClick={() => handleModalOpen("bulk")}>
          Bulk Upload
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={organisation}
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
            ? "Bulk Upload Organisations"
            : modalType === "edit"
            ? "Edit Organisation"
            : "Add Organisation"
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
            initialValues={editOrganisation || {}}
            onFinish={(values) => {
              modalType === "edit"
                ? handleUpdateOrganisation(values)
                : handleAddOrganisation(values);
            }}
          >
            <Form.Item
              label="Company Name"
              name="companyName"
              rules={[
                { required: true, message: "Please input the company name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Company ID"
              name="companyID"
              rules={[
                {
                  required: true,
                  message: "Please input the company id!",
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
            <Form.Item
              label="Client Service Officer"
              name="clientServiceOfficer"
              rules={[
                {
                  required: true,
                  message: "Please input the Client Service Officer!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item className="text-right">
              <Button
                type="primary"
                htmlType="submit"
                className="!bg-primary"
                disabled={loading}
              >
                {loading ? "Submit..." : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Organisation;
