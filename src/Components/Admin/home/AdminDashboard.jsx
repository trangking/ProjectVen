import React, { useEffect, useState } from "react";
import {
  fetchedAddPointMent,
  GetAddPointMentByfalse,
  GetAddPointMentBytrue,
  confirmAppointment,
  GetAddPointMentByCannel,
} from "../../../firebase/firebase";
import {
  Table,
  Button,
  Input,
  Card,
  Statistic,
  message,
  Select,
  Spin,
} from "antd";

const { Option } = Select;

export default function AdminDashboard() {
  const [searchTermPet, setSearchTermPet] = useState("");
  const [searchTermOwner, setSearchTermOwner] = useState("");
  const [searchTermNubmerPet, setSearchTermNubmerPet] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [appointmentTrue, setappointmentTrue] = useState([]);
  const [appointmentfalse, setappointmentfalse] = useState([]);
  const [appointmentCanel, setappointmentCanel] = useState([]);
  const [AppointmentsType, setAppointmentsType] = useState("ดูการนัดทั้งหมด");
  const [confirmStatus, setconfirmStatus] = useState(false);
  const [TypeconfirmStatus, setTypeconfirmStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      setLoading(true); // เริ่มแสดง loading
      try {
        const fetchedAppointments = await fetchedAddPointMent();
        setAppointments(fetchedAppointments);
        const showTableTrue = await GetAddPointMentBytrue();
        setappointmentTrue(showTableTrue);
        const showTablefalse = await GetAddPointMentByfalse();
        setappointmentfalse(showTablefalse);
        const showTablecannel = await GetAddPointMentByCannel();
        setappointmentCanel(showTablecannel);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
      setLoading(false); // หยุดแสดง loading เมื่อโหลดเสร็จ
    };

    fetchAppointment();
  }, []);

  const confirmAddponitment = async (appointmentID, isConfirmed) => {
    setLoading(true); // เริ่มแสดง loading
    try {
      const sentdata = await confirmAppointment(appointmentID, isConfirmed);
      message.success(sentdata.message);
      await fetchedAddPointMent(); // โหลดข้อมูลใหม่หลังจากยืนยันการนัดหมาย
    } catch (err) {
      console.error("Error confirming appointment:", err);
      message.error("Failed to confirm the appointment");
    }
    setLoading(false); // หยุดแสดง loading เมื่ออัปเดตเสร็จ
  };

  const columns = [
    {
      title: "ชื่อสัตว์เลี้ยง",
      render: (text, record) =>
        `${record.pet[0].name} / ${record.pet[0].NumberPet}`,
      key: "petName",
    },
    {
      title: "เจ้าของ",
      dataIndex: ["owner", "0", "name"],
      key: "owner",
    },
    {
      title: "คุณหมอ",
      dataIndex: "doctorName",
      key: "doctorName",
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
        <Spin spinning={loading}>
          <div
            style={{
              pointerEvents: appointment.status ? "none" : "auto",
              opacity: appointment.status ? 0.5 : 1,
            }}
          >
            <Button
              color="primary"
              variant="outlined"
              onClick={() => confirmAddponitment(appointment.id, true)} // ส่งค่า true สำหรับการยืนยัน
              style={{ marginRight: "8px" }}
              disabled={loading} // ปิดการใช้งานปุ่มระหว่างโหลด
            >
              ยันนัดหมาย
            </Button>

            <Button
              color="danger"
              variant="outlined"
              onClick={() => confirmAddponitment(appointment.id, false)} // ส่งค่า false สำหรับการยกเลิก
              disabled={loading} // ปิดการใช้งานปุ่มระหว่างโหลด
            >
              ยกเลิกนัด
            </Button>
          </div>
        </Spin>
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
    const numberPet = String(
      appointment?.pet?.[0]?.NumberPet || ""
    ).toLowerCase();

    return (
      petName.includes(searchTermPet.toLowerCase()) &&
      ownerName.includes(searchTermOwner.toLowerCase()) &&
      numberPet.includes(searchTermNubmerPet.toLowerCase())
    );
  });

  return (
    <>
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

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">การนัดหมายล่าสุด</h2>
        </div>

        <div className="flex gap-4 mb-4">
          <Input
            placeholder="ค้นหาด้วยชื่อสัตว์เลี้ยง"
            value={searchTermPet}
            onChange={(e) => setSearchTermPet(e.target.value)}
          />
          <Input
            placeholder="ค้นหาด้วยเลขสัตว์เลี้ยง"
            value={searchTermNubmerPet}
            onChange={(e) => setSearchTermNubmerPet(e.target.value)}
          />
          <Input
            placeholder="ค้นหาด้วยชื่อเจ้าของ"
            value={searchTermOwner}
            onChange={(e) => setSearchTermOwner(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredAppointments}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading} // แสดงสถานะโหลดในตารางเมื่อโหลดข้อมูล
        />
      </div>
    </>
  );
}
