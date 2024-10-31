import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchedAddPointMent,
  GetAddPointMentByfalse,
  GetAddPointMentBytrue,
} from "../../../firebase/firebase";
import { Table, Button, Input, Card, Statistic } from "antd";

// ฟังก์ชันจัดเรียงตามวันที่

// หน้าจัดการ Admin Dashboard
export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [appointmentTrue, setappointmentTrue] = useState([]);
  const [appointmentfalse, setappointmentfalse] = useState([]);
  const [AppointmentsType, setAppointmentsType] = useState("ดูการนัดทั้งหมด");

  // ฟังก์ชันสำหรับยกเลิกการนัดหมาย
  const handleCancelAppointment = (id) => {
    console.log("ยกเลิกการนัดหมาย ID:", id);
  };

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const fetchedAppointments = await fetchedAddPointMent(); // เรียก API หรือฟังก์ชันที่ดึงข้อมูล
        setAppointments(fetchedAppointments);
        const showTableTrue = await GetAddPointMentBytrue();
        setappointmentTrue(showTableTrue);
        const showTablefalse = await GetAddPointMentByfalse();
        setappointmentfalse(showTablefalse); // ตั้งค่า state หลังจากดึงข้อมูลสำเร็จ
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointment(); // เรียกฟังก์ชันเพื่อดึงข้อมูลเมื่อ component โหลด
  }, []); // ไม่มี dependency array เพื่อให้ทำงานเพียงครั้งเดียว

  // กำหนดคอลัมน์สำหรับตาราง
  const columns = [
    {
      title: "ชื่อสัตว์เลี้ยง",
      dataIndex: ["pet", "0", "name"], // ตรวจสอบว่า pet[0] มี name จริงหรือไม่
      key: "petName",
    },
    {
      title: "เจ้าของ",
      dataIndex: ["owner", "0", "name"], // ตรวจสอบว่า owner มีข้อมูลหรือไม่
      key: "owner",
    },
    {
      title: "วันที่",
      dataIndex: "nextAppointmentDate", // ตรวจสอบว่ามีฟิลด์ nextAppointmentDate หรือไม่
      key: "date",
    },
    {
      title: "เวลา",
      dataIndex: "TimeAppoinMentDate", // ตรวจสอบว่ามีฟิลด์ time หรือไม่
      key: "time",
    },
    {
      title: "เบอร์โทร",
      dataIndex: ["owner", "0", "phone"], // ตรวจสอบว่ามีฟิลด์ time หรือไม่
      key: "time",
    },
    {
      title: "สถานะ",
      dataIndex: "status", // ตรวจสอบว่ามีฟิลด์ status หรือไม่
      key: "status",
      render: (status) => (status ? "มาตามนัด" : "กำลังมา"),
    },
    {
      title: "การจัดการ",
      key: "actions",
      render: (appointment) => (
        <Button
          color="danger"
          variant="outlined"
          onClick={() => handleCancelAppointment(appointment.id)}
          disabled={appointment.status}
        >
          ยกเลิกนัด
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* Section 1: ข้อมูลสถิติ */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          onClick={() => setAppointmentsType("ดูการนัดทั้งหมด")}
          className="cursor-pointer"
        >
          <Statistic
            title="การนัดหมายทั้งหมด"
            className="cursor-pointer"
            value={appointments.length}
          />
        </Card>
        <Card
          onClick={() => setAppointmentsType("กำลังมา")}
          className="cursor-pointer"
        >
          <Statistic
            title="การนัดหมายที่จะมาถึง"
            value={appointmentfalse.length}
          />
        </Card>
        <Card
          onClick={() => setAppointmentsType("มาตามนัด")}
          className="cursor-pointer"
        >
          <Statistic
            title="การนัดหมายที่เสร็จสิ้น"
            value={appointmentTrue.length}
          />
        </Card>
        <Card>
          <Statistic title="การนัดหมายที่ถูกยกเลิก" value={0} />
        </Card>
      </div>

      {/* Section 2: ตารางการนัดหมายล่าสุด */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">การนัดหมายล่าสุด</h2>

          {/* ปุ่มสำหรับเพิ่มการนัดหมาย */}
          <Link to="/pageAdmin/Appointment">
            <Button type="primary" shape="round" size="large">
              + เพิ่มการนัดหมาย
            </Button>
          </Link>
        </div>

        {/* ช่องค้นหา */}
        <Input
          placeholder="ค้นหาชื่อสัตว์เลี้ยงหรือเจ้าของ"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        {/* ตารางการนัดหมาย */}
        <Table
          columns={columns}
          dataSource={
            AppointmentsType === "ดูการนัดทั้งหมด"
              ? appointments
              : AppointmentsType === "มาตามนัด"
              ? appointmentTrue
              : AppointmentsType === "กำลังมา"
              ? appointmentfalse
              : ""
          }
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </>
  );
}
