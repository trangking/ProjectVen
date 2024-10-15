import React, { useState } from "react";
import { Tabs } from "antd";
import { Table, Button, Form, Input, DatePicker } from "antd";
import { Link } from "react-router-dom";

const { TabPane } = Tabs;

const Doctorpage = () => {
  const [treatments, setTreatments] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // ฟังก์ชันสำหรับเพิ่มการรักษาที่หมอดูแล
  const handleAddTreatment = (values) => {
    const newTreatment = { ...values, date: new Date().toLocaleDateString() };
    setTreatments([...treatments, newTreatment]);
  };

  // ฟังก์ชันสำหรับเพิ่มวันนัดของหมอ
  const handleAddAppointment = (values) => {
    setAppointments([...appointments, values]);
  };

  return (
    <div className="manage-doctor p-8">
      {/* Header */}
      <div className="header bg-yellow-500 text-white p-4 text-center mb-4">
        <h1 className="text-3xl font-bold">จัดการข้อมูลหมอ: [ชื่อหมอ]</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="1">
        {/* Tab 1: ข้อมูลและการรักษา */}
        <TabPane tab="ข้อมูลและการรักษา" key="1">
          <h2 className="text-2xl font-bold mb-4">ข้อมูลการรักษา</h2>

          {/* แบบฟอร์มเพิ่มการรักษา */}
          <Form layout="inline" onFinish={handleAddTreatment}>
            <Form.Item
              name="treatment"
              label="การรักษา"
              rules={[{ required: true }]}
            >
              <Input placeholder="ชื่อการรักษา" />
            </Form.Item>
            <Form.Item name="description" label="รายละเอียด">
              <Input placeholder="รายละเอียดการรักษา" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                เพิ่มการรักษา
              </Button>
            </Form.Item>
          </Form>

          {/* ตารางแสดงรายการการรักษา */}
          <Table
            dataSource={treatments}
            columns={[
              { title: "การรักษา", dataIndex: "treatment", key: "treatment" },
              {
                title: "รายละเอียด",
                dataIndex: "description",
                key: "description",
              },
              { title: "วันที่", dataIndex: "date", key: "date" },
            ]}
            rowKey="treatment"
            className="mt-4"
          />
        </TabPane>

        {/* Tab 2: ตารางวันนัดของหมอ */}
        <TabPane tab="ตารางวันนัด" key="2">
          <h2 className="text-2xl font-bold mb-4">ตารางวันนัดของหมอ</h2>

          {/* แบบฟอร์มเพิ่มวันนัด */}
          <Form layout="inline" onFinish={handleAddAppointment}>
            <Form.Item name="date" label="วันที่" rules={[{ required: true }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item name="description" label="รายละเอียด">
              <Input placeholder="รายละเอียดการนัด" />
            </Form.Item>
            <Form.Item>
              <Link to={"/pageAdmin/Appointment"}>
                {" "}
                <Button type="primary">เพิ่มการนัดหมาย</Button>
              </Link>
            </Form.Item>
          </Form>

          {/* ตารางแสดงวันนัด */}
          <Table
            dataSource={appointments}
            columns={[
              { title: "วันที่", dataIndex: "date", key: "date" },
              {
                title: "รายละเอียด",
                dataIndex: "description",
                key: "description",
              },
            ]}
            rowKey="date"
            className="mt-4"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Doctorpage;
