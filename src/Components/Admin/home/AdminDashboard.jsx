import React, { useEffect, useState } from "react";
import {
  fetchedAddPointMent,
  GetAddPointMentByfalse,
  GetAddPointMentBytrue,
  confirmAppointment,
  GetAddPointMentByCannel,
} from "../../../firebase/firebase";
import { Table, Button, Input, Card, Statistic, message, Select } from "antd";

const { Option } = Select;

export default function AdminDashboard() {
  const [searchTermPet, setSearchTermPet] = useState(""); // คำค้นหาสำหรับชื่อสัตว์เลี้ยง
  const [searchTermOwner, setSearchTermOwner] = useState(""); // คำค้นหาสำหรับชื่อเจ้าของ
  const [appointments, setAppointments] = useState([]);
  const [appointmentTrue, setappointmentTrue] = useState([]);
  const [appointmentfalse, setappointmentfalse] = useState([]);
  const [appointmentCanel, setappointmentCanel] = useState([]);
  const [AppointmentsType, setAppointmentsType] = useState("ดูการนัดทั้งหมด");
  const [confirmStatus, setconfirmStatus] = useState(false);
  const [TypeconfirmStatus, setTypeconfirmStatus] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const fetchedAppointments = await fetchedAddPointMent();
        await setAppointments(fetchedAppointments);
        const showTableTrue = await GetAddPointMentBytrue();
        await setappointmentTrue(showTableTrue);
        const showTablefalse = await GetAddPointMentByfalse();
        await setappointmentfalse(showTablefalse);
        const showTablecannel = await GetAddPointMentByCannel();
        await setappointmentCanel(showTablecannel);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointment();
  }, []);

  const columns = [
    {
      title: "ชื่อสัตว์เลี้ยง",
      dataIndex: ["pet", "0", "name"],
      key: "petName",
    },
    {
      title: "เจ้าของ",
      dataIndex: ["owner", "0", "name"],
      key: "owner",
    },
    {
      title: "วันที่",
      dataIndex: "nextAppointmentDate",
      key: "date",
    },
    {
      title: "เวลา",
      dataIndex: "TimeAppoinMentDate",
      key: "time",
    },
    {
      title: "เบอร์โทร",
      dataIndex: ["owner", "0", "phone"],
      key: "phone",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? "มาตามนัด" : "กำลังมา"),
    },
    {
      title: "การจัดการ",
      key: "actions",
      render: (appointment) => (
        <div
          style={{
            pointerEvents: appointment.status ? "none" : "auto",
            opacity: appointment.status ? 0.5 : 1,
          }}
        >
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              confirmAddponitment(appointment.id);
              setTypeconfirmStatus("ยืนยัน");
            }}
            style={{ marginRight: "8px" }}
          >
            ยันนัดหมาย
          </Button>

          <Button
            color="danger"
            variant="outlined"
            onClick={() => {
              confirmAddponitment(appointment.id);
              setTypeconfirmStatus("ยกเลิก");
            }}
          >
            ยกเลิกนัด
          </Button>
        </div>
      ),
    },
  ];

  // ฟังก์ชันกรองข้อมูลการนัดหมายตามคำค้นหาทั้งสองช่อง
  const filteredAppointments = (
    AppointmentsType === "ดูการนัดทั้งหมด"
      ? appointments
      : AppointmentsType === "มาตามนัด"
      ? appointmentTrue
      : AppointmentsType === "กำลังมา"
      ? appointmentfalse
      : AppointmentsType === "ยกเลิกการนัด"
      ? appointmentCanel
      : []
  ).filter((appointment) => {
    const petName = appointment?.pet?.[0]?.name?.toLowerCase() || "";
    const ownerName = appointment?.owner?.[0]?.name?.toLowerCase() || "";

    return (
      petName.includes(searchTermPet.toLowerCase()) &&
      ownerName.includes(searchTermOwner.toLowerCase())
    );
  });

  const confirmAddponitment = async (appointmentID) => {
    if (TypeconfirmStatus === "ยืนยัน") {
      await setconfirmStatus(true);
    } else {
      await setconfirmStatus(false);
    }
    try {
      const sentdata = await confirmAppointment(appointmentID, confirmStatus);
      message.success(sentdata.message);
    } catch (err) {
      console.error("Error confirming appointment:", err);
      message.error("Failed to confirm the appointment");
    }
  };

  return (
    <>
      {/* Section 1: ข้อมูลสถิติ */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          onClick={() => setAppointmentsType("ดูการนัดทั้งหมด")}
          className="cursor-pointer"
        >
          <Statistic title="การนัดหมายทั้งหมด" value={appointments.length} />
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
        <Card
          onClick={() => setAppointmentsType("ยกเลิกการนัด")}
          className="cursor-pointer"
        >
          <Statistic
            title="การนัดหมายที่ถูกยกเลิก"
            value={appointmentCanel.length}
          />
        </Card>
      </div>

      {/* Section 2: ตารางการนัดหมายล่าสุด */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">การนัดหมายล่าสุด</h2>
        </div>

        {/* ช่องเลือกตัวเลือกการค้นหาและค้นหาข้อมูล */}
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="ค้นหาด้วยชื่อสัตว์เลี้ยง"
            value={searchTermPet}
            onChange={(e) => setSearchTermPet(e.target.value)}
          />

          <Input
            placeholder="ค้นหาด้วยชื่อเจ้าของ"
            value={searchTermOwner}
            onChange={(e) => setSearchTermOwner(e.target.value)}
          />
        </div>

        {/* ตารางการนัดหมาย */}
        <Table
          columns={columns}
          dataSource={filteredAppointments}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </>
  );
}
