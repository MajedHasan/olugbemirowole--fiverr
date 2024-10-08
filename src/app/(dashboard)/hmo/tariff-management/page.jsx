// src/app/(dashboard)/hmo/tariff-management/page.jsx

"use client"; // Declare this as a client component

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the Tabs component
const Tabs = dynamic(() => import("antd").then((mod) => mod.Tabs), {
  ssr: false,
});
const { TabPane } = Tabs;

import Treatment from "./_components/treatment";
import Diagnosis from "./_components/diagnosis";
import Drugs from "./_components/drugs";

const TariffManagementPage = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Treatments" key="1">
        <Treatment />
      </TabPane>
      <TabPane tab="Diagnoses" key="2">
        <Diagnosis />
      </TabPane>
      <TabPane tab="Drugs" key="3">
        <Drugs />
      </TabPane>
    </Tabs>
  );
};

export default TariffManagementPage;
