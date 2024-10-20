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
  Select,
  message,
} from "antd";
import { MoreOutlined, UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const { Option } = Select;

const Enrollees = () => {
  const [enrollees, setEnrollees] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10000);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // 'add', 'edit', or 'bulk'
  const [editEnrollee, setEditEnrollee] = useState(null);
  const [dependents, setDependents] = useState([]);
  const [fileList, setFileList] = useState([]);

  const router = useRouter(); // Initialize the router

  useEffect(() => {
    loadEnrollees();
    loadHospitals();
  }, [currentPage]);

  const loadEnrollees = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/enrollees?page=${currentPage}&limit=${pageSize}`
      );
      const data = await res.json();
      setEnrollees(data.enrollees);
      setTotal(data.total);
    } catch (error) {
      message.error("Failed to load enrollees.");
    }
    setLoading(false);
  };

  const loadHospitals = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/hospital?page=${currentPage}&limit=${pageSize}`
      );
      const data = await res.json();
      setHospitals(data.hospitals);
      // setTotal(data.total);
    } catch (error) {
      message.error("Failed to load hospitals.");
    }
    setLoading(false);
  };

  const handleAddEnrollee = async (values) => {
    // return console.log({ ...values });

    try {
      const res = await fetch("/api/enrollees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, dependents }),
      });
      if (res.ok) {
        message.success("Enrollee added successfully!");
        loadEnrollees();
        resetModal();
      } else {
        message.error("Message Failed to add enrollee.");
      }
    } catch (error) {
      message.error("Failed to add enrollee.");
    }
  };

  const handleEdit = (record) => {
    setEditEnrollee(record);
    // Ensure dependents are extracted correctly
    setDependents(
      record.dependents ? record.dependents.map((dep) => dep.name || "") : []
    );
    setModalType("edit");
    setIsModalVisible(true);
  };

  const handleUpdateEnrollee = async (values) => {
    console.log(enrollees, editEnrollee);
    try {
      const res = await fetch(`/api/enrollees`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, dependents, id: editEnrollee.id }),
      });
      if (res.ok) {
        message.success("Enrollee updated successfully!");
        loadEnrollees();
        resetModal();
      } else {
        message.error("Failed to update enrollee.");
      }
    } catch (error) {
      message.error("Failed to update enrollee.");
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this enrollee?",
      onOk: async () => {
        try {
          const res = await fetch(`/api/enrollees`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
            }),
          });
          if (res.ok) {
            message.success("Enrollee deleted successfully!");
            loadEnrollees();
          } else {
            message.error("Failed to delete enrollee.");
          }
        } catch (error) {
          message.error("Failed to delete enrollee.");
        }
      },
    });
  };

  const handleNavigate = (id) => {
    router.push(`/hmo/enrollees/${id}`); // Navigate to enrollee page
  };

  const menu = (record) => (
    <Menu>
      <Menu.Item key="1" onClick={() => handleNavigate(record.id)}>
        View
      </Menu.Item>
      <Menu.Item key="1" onClick={() => handleEdit(record)}>
        Edit
      </Menu.Item>
      <Menu.Item key="2" onClick={() => handleDelete(record.id)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Policy No", dataIndex: "policyNo", key: "policyNo" },
    { title: "Company", dataIndex: "company", key: "company" },
    { title: "Plan Type", dataIndex: "planType", key: "planType" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
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
    setEditEnrollee(null); // Reset edit enrollee
    setDependents([]); // Reset dependents for new enrollee
    if (type === "bulk") {
      setFileList([]); // Reset file list for bulk upload
    }
  };

  const resetModal = () => {
    setIsModalVisible(false);
    setEditEnrollee(null);
    setDependents([]);
  };

  const handleBulkUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    fileList.forEach((file) => formData.append("file", file));
    try {
      const res = await fetch("/api/enrollees/bulk", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        message.success("Bulk upload successful!");
        loadEnrollees();
        resetModal();
      } else {
        message.error("Bulk upload failed.");
      }
    } catch (error) {
      message.error("Bulk upload failed.");
    }
    setLoading(false);
  };

  const addDependent = () => {
    setDependents([...dependents, ""]);
  };

  const removeDependent = (index) => {
    setDependents(dependents.filter((_, i) => i !== index));
  };

  const handleDependentChange = (index, value) => {
    const newDependents = [...dependents];
    newDependents[index] = value;
    setDependents(newDependents);
  };

  return (
    <div>
      <div className="actions mb-4">
        <Button
          type="primary"
          onClick={() => handleModalOpen("add")}
          className="!bg-primary"
        >
          Add Enrollee
        </Button>
        <Button
          type="default"
          onClick={() => handleModalOpen("bulk")}
          className="!bg-third"
        >
          Bulk Upload
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={enrollees}
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
            ? "Bulk Upload Enrollees"
            : modalType === "edit"
            ? "Edit Enrollee"
            : "Add Enrollee"
        }
        visible={isModalVisible}
        onCancel={resetModal}
        footer={null}
        onOk={
          modalType === "bulk"
            ? handleBulkUpload
            : modalType === "edit"
            ? handleUpdateEnrollee
            : handleAddEnrollee
        }
      >
        {modalType === "bulk" ? (
          <Form
            onFinish={handleBulkUpload} // The function to handle bulk upload
            layout="vertical"
          >
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

            {/* Add a submit button inside the form */}
            <Form.Item className="text-right">
              <Button
                type="primary"
                htmlType="submit"
                className="!bg-primary"
                disabled={loading ? true : false}
              >
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form
            initialValues={editEnrollee || {}}
            onFinish={(values) => {
              console.log("Form submitted with values:", values);
              modalType === "edit"
                ? handleUpdateEnrollee(values)
                : handleAddEnrollee(values);
            }}
          >
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[
                { required: true, message: "Please input the full name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Policy No"
              name="policyNo"
              // rules={[
              //   { required: true, message: "Please input the policy number!" },
              // ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Company"
              name="company"
              rules={[{ required: true, message: "Please input the company!" }]}
            >
              <Input />
            </Form.Item>
            {/* <Form.Item
              label="Plan Type"
              name="planType"
              rules={[
                { required: true, message: "Please input the plan type!" },
              ]}
            >
              <Input />
            </Form.Item> */}

            <Form.Item
              label="Plan Type"
              name="planType"
              rules={[{ required: true, message: "Please select a planType!" }]}
            >
              <Select
                id="hospital"
                className="w-full"
                placeholder="Select a Plan Type" // Placeholder for better UX
              >
                <Select.Option value={"bronze"}>Bronze</Select.Option>
                <Select.Option value={"silver"}>Silver</Select.Option>
                <Select.Option value={"gold"}>Gold</Select.Option>
              </Select>
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
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select the status!" }]}
            >
              <Select>
                <Option value="ACTIVE">Active</Option>
                <Option value="INACTIVE">Inactive</Option>
              </Select>
            </Form.Item>

            {/* Hospital */}
            {/* <Form.Item label="Hospital" name="hospital">
              <Input />
            </Form.Item> */}
            <Form.Item
              label="Hospital"
              name="hospital"
              rules={[{ required: true, message: "Please select a hospital!" }]}
            >
              <Select
                id="hospital"
                // onChange={(value) => handleSelectChange("hospital", value)} // Corrected name for value
                className="w-full"
                placeholder="Select a hospital" // Placeholder for better UX
              >
                {hospitals?.map((hospital) => (
                  <Select.Option
                    key={hospital.id}
                    value={hospital.hospitalName}
                  >
                    {hospital.hospitalName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="No. of Dependents" name="noOfDependents">
              <Input type="number" />
            </Form.Item>

            {/* Dependents Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Dependents</h3>
              {dependents.map((dep, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    defaultValue={dep}
                    placeholder={`Dependent ${index + 1}`}
                    onBlur={(e) => handleDependentChange(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={() => removeDependent(index)}
                    danger
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={addDependent}
                className="bg-primary text-white"
              >
                Add Dependent
              </Button>
            </div>

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

export default Enrollees;
