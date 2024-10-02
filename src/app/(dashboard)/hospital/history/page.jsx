"use client";

import { useEffect, useState } from "react";
import { Table, Pagination, message, Tag, Tabs } from "antd";
import TreatmentRequest from "./_components/treatmentRequest";
import Payout from "./_components/payout";
import Claims from "./_components/claims";

const HistoryPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("dcPortal-user"));
    setUser(user);
  }, []);

  return (
    <div>
      <h1>History</h1>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Treatment Requests" key="1">
          <TreatmentRequest />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Claims" key="2">
          <Claims />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Payout History" key="3">
          <Payout />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default HistoryPage;
