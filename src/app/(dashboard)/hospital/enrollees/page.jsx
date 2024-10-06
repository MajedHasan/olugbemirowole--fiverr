"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Select, message } from "antd";

const Enrollees = () => {
  const [enrollees, setEnrollees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("dcPortal-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (hospital) {
      loadEnrollees();
    }
  }, [currentPage, hospital]);

  useEffect(() => {
    const fetchHospital = async () => {
      const response = await fetch(`/api/hospital/single?id=${user?.id}`);
      if (response.ok) {
        setHospital(await response.json());
      }
    };

    if (user?.role === "HOSPITAL") {
      fetchHospital();
    }
  }, [user]);

  const loadEnrollees = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/enrollees/byHospitalName?hospitalName=${hospital?.hospitalName}&page=${currentPage}&limit=${pageSize}`
      );
      const data = await res.json();
      setEnrollees(data.enrollees);
      setTotal(data.total);
    } catch (error) {
      message.error("Failed to load enrollees.");
    }
    setLoading(false);
  };

  const columns = [
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Policy No", dataIndex: "policyNo", key: "policyNo" },
    { title: "Company", dataIndex: "company", key: "company" },
    { title: "Hospital", dataIndex: "hospital", key: "hospital" },
    { title: "Plan Type", dataIndex: "planType", key: "planType" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
  ];

  const handleTableChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="actions mb-4"></div>

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
    </div>
  );
};

export default Enrollees;
