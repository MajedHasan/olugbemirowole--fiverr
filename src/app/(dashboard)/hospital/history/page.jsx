"use client";

import { useEffect, useState } from "react";
import { Table, Pagination, message, Tag, Tabs } from "antd";
import TreatmentRequest from "./_components/treatmentRequest";
import Payout from "./_components/payout";

const HistoryPage = () => {
  return (
    <div>
      <h1>History</h1>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Treatment Requests" key="1">
          <TreatmentRequest />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Payout History" key="2">
          <Payout />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default HistoryPage;
