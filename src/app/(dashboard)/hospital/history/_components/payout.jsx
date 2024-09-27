import { useEffect, useState } from "react";
import { Table, Pagination, message } from "antd";

const Payout = () => {
  const [payouts, setPayouts] = useState([]);
  const [totalPayouts, setTotalPayouts] = useState(0);
  const [payoutPage, setPayoutPage] = useState(1);
  const limit = 10; // Adjust as needed

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "pending":
        return "orange";
      case "resolved":
        return "blue";
      case "paid":
        return "green";
      case "failed":
        return "red";
      default:
        return "gray"; // Default color for unknown status
    }
  };

  // Fetch payouts
  const fetchPayouts = async () => {
    try {
      const response = await fetch(
        `/api/payouts?page=${payoutPage}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPayouts(data.payouts);
      setTotalPayouts(data.total);
    } catch (error) {
      console.error("Error fetching payouts:", error);
      message.error("Failed to fetch payouts. Showing demo data.");
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [payoutPage]);

  // Columns definition for Ant Design table

  const payoutColumns = [
    {
      title: "Payout ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span style={{ color: getStatusColor(status) }}>{status}</span>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={payouts} columns={payoutColumns} pagination={false} />
      <Pagination
        current={payoutPage}
        total={totalPayouts}
        pageSize={limit}
        onChange={(page) => setPayoutPage(page)}
      />
    </>
  );
};

export default Payout;
