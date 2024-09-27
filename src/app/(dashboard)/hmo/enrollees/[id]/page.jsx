"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Pagination,
  message,
} from "antd";

const { Option } = Select;

const EnrolleeDetails = ({ id }) => {
  const [enrollee, setEnrollee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [benefits, setBenefits] = useState([]);
  const [hospitalHistory, setHospitalHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    loadEnrolleeDetails();
  }, [id]);

  const loadEnrolleeDetails = async () => {
    setLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      const demoEnrollee = {
        fullName: "John Doe",
        policyNo: "POL123456",
        company: "HealthCorp",
        benefits: [
          { id: 1, name: "Basic Coverage", amount: 1000, status: "ACTIVE" },
          { id: 2, name: "Dental Coverage", amount: 500, status: "ACTIVE" },
        ],
        hospitalHistory: [
          {
            id: 1,
            hospitalName: "General Hospital",
            visitDate: "2023-09-01",
            reason: "Routine Checkup",
          },
          {
            id: 2,
            hospitalName: "City Clinic",
            visitDate: "2023-08-15",
            reason: "Flu Symptoms",
          },
        ],
      };
      setEnrollee(demoEnrollee);
      setBenefits(demoEnrollee.benefits);
      setHospitalHistory(demoEnrollee.hospitalHistory);
      setLoading(false);
    }, 1000);
  };

  const handleEditBenefits = async (values) => {
    try {
      // Simulate a successful update
      const updatedBenefits = [
        ...benefits,
        { id: benefits.length + 1, ...values },
      ];
      setBenefits(updatedBenefits);
      message.success("Benefits updated successfully!");
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update benefits.");
    }
  };

  const handleTableChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Enrollee Details</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Enrollee Information</h2>
            <p>
              <strong>Name:</strong> {enrollee.fullName}
            </p>
            <p>
              <strong>Policy No:</strong> {enrollee.policyNo}
            </p>
            <p>
              <strong>Company:</strong> {enrollee.company}
            </p>
            <Button onClick={() => setIsModalVisible(true)}>
              Edit Benefits
            </Button>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold">Enrollee Benefits</h2>
            <Table
              dataSource={benefits}
              pagination={false}
              rowKey={(record) => record.id}
            >
              <Table.Column title="Benefit Name" dataIndex="name" key="name" />
              <Table.Column title="Amount" dataIndex="amount" key="amount" />
              <Table.Column title="Status" dataIndex="status" key="status" />
            </Table>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold">Hospital Usage History</h2>
            <Table
              dataSource={hospitalHistory}
              pagination={false}
              rowKey={(record) => record.id}
            >
              <Table.Column
                title="Hospital Name"
                dataIndex="hospitalName"
                key="hospitalName"
              />
              <Table.Column
                title="Date of Visit"
                dataIndex="visitDate"
                key="visitDate"
              />
              <Table.Column
                title="Reason for Visit"
                dataIndex="reason"
                key="reason"
              />
            </Table>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={hospitalHistory.length}
              onChange={handleTableChange}
              className="mt-4"
            />
          </div>
        </>
      )}

      <Modal
        title="Edit Benefits"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleEditBenefits}>
          <Form.Item
            label="Benefit Name"
            name="name"
            rules={[
              { required: true, message: "Please input the benefit name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please input the amount!" }]}
          >
            <Input type="number" />
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
          <Form.Item>
            <Button type="primary" htmlType="submit" className="!bg-primary">
              Update Benefits
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EnrolleeDetails;
