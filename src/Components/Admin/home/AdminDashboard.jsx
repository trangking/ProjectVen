import React, { useEffect, useState } from "react";
import {
  fetchedAddPointMent,
  GetAddPointMentByfalse,
  GetAddPointMentBytrue,
  confirmAppointment,
  GetAddPointMentByCannel,
  fetchedAddPointMentTimeandDate,
  upDateAppointmentDate,
} from "../../../firebase/firebase";
import {
  Table,
  Button,
  Input,
  Card,
  Statistic,
  message,
  Spin,
  Modal,
  Form,
  DatePicker,
  TimePicker,
} from "antd";
import moment from "moment";

export default function AdminDashboard() {
  const [searchTermPet, setSearchTermPet] = useState("");
  const [searchTermOwner, setSearchTermOwner] = useState("");
  const [searchTermNubmerPet, setSearchTermNubmerPet] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [appointmentTrue, setappointmentTrue] = useState([]);
  const [appointmentfalse, setappointmentfalse] = useState([]);
  const [appointmentCanel, setappointmentCanel] = useState([]);
  const [AppointmentsType, setAppointmentsType] = useState("ดูการนัดทั้งหมด");
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [form] = Form.useForm();
  const [edittime, setEdittime] = useState(null);
  const [editDateAp, seteditDateAp] = useState(null);

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

  const openEditModal = async (apID) => {
    setEditModalVisible(true);
    try {
      const res = await fetchedAddPointMentTimeandDate(apID);
      setCurrentAppointment(res); // ใช้รายการแรกที่พบ
      form.setFieldsValue({
        date: moment(res[0].nextAppointmentDate),
        time: moment(res[0].timeNextAppointment, "HH:mm"),
      });
      // เปิด Modal
    } catch (err) {
      console.error("Error opening modal:", err);
    }
  };

  const columns = [
    {
      title: "รหัสสัตว์เลี้ยง",
      dataIndex: ["pet", "0", "NumberPet"],
      key: "NumberPet",
    },
    {
      title: "ชื่อสัตว์เลี้ยง",
      dataIndex: ["pet", "0", "name"],
      key: "petName",
    },
    {
      title: "สายพันธุ์",
      dataIndex: ["pet", "0", "subType"],
      key: "subType",
    },
    {
      title: "เจ้าของ",
      render: (text, record) =>
        `${record.owner[0].name}  ${record.owner[0].lastname}`,
      key: "owner",
    },
    {
      title: "สัตว์แพทย์",
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
      title: "เบอร์โทรศัพท์",
      dataIndex: ["owner", "0", "phone"],
      key: "phone",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? "มาตามนัด" : "รอการยืนยันจากเจ้าของ"),
    },
    {
      title: "การจัดการ",
      key: "actions",
      render: (appointment) => (
        <Spin spinning={loading}>
          <div
            className="flex flex-row"
            style={{
              pointerEvents: appointment.status ? "none" : "auto",
              opacity: appointment.status ? 0.5 : 1,
            }}
          >
            <Button
              color="primary"
              variant="outlined"
              onClick={() => confirmAddponitment(appointment.id, "ยืนยัน")} // ส่งค่า true สำหรับการยืนยัน
              style={{ marginRight: "8px" }}
              disabled={loading} // ปิดการใช้งานปุ่มระหว่างโหลด
            >
              ยันนัดหมาย
            </Button>
            <Button
              color="default"
              variant="solid"
              onClick={() => openEditModal(appointment.id)} // ส่งค่า true สำหรับการยืนยัน
              style={{ marginRight: "8px" }}
              disabled={loading} // ปิดการใช้งานปุ่มระหว่างโหลด
            >
              เลื่อนการยันนัดหมาย
            </Button>

            {/* <Button
              color="danger"
              variant="outlined"
              onClick={() => confirmAddponitment(appointment.id, "ยกเลิก")} // ส่งค่า false สำหรับการยกเลิก
              disabled={loading} 
            >
              ยกเลิกนัด
            </Button> */}
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

  const handleSave = async () => {
    console.log(editDateAp);
    console.log(edittime);
    console.log(currentAppointment.id);
    try {
      if (!editDateAp || !edittime) {
        return message.error("กรุณาเลือกวันที่และเวลา");
      }
      const nextAppointmentDate = editDateAp; // ใช้ค่า `editDateAp` ที่ตั้งไว้
      const selectedTime = edittime; // ใช้ค่า `edittime` ที่ตั้งไว้
      if (currentAppointment?.id) {
        // อัปเดตข้อมูลการนัดหมาย
        await upDateAppointmentDate(
          currentAppointment.id,
          nextAppointmentDate,
          selectedTime
        );

        const isConfirmed = "แก้ไขการนัดหมาย";
        await confirmAppointment(currentAppointment.id, isConfirmed);

        message.success("แก้ไขวันและเวลาการนัดหมายสำเร็จ");

        // ปิด Modal และรีเฟรชข้อมูล
        setEditModalVisible(false);
        setCurrentAppointment(null);
        seteditDateAp(null);
        setEdittime(null);

        // รีเฟรชข้อมูลตาราง
        const fetchedAppointments = await fetchedAddPointMent();
        setAppointments(fetchedAppointments);
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      message.error("เกิดข้อผิดพลาดในการแก้ไขการนัดหมาย");
    }
  };

  const handleCancel = () => {
    // ปิด Modal และรีเซ็ตตัวแปร
    setEditModalVisible(false);
    setCurrentAppointment(null);
    seteditDateAp(null);
    setEdittime(null);
  };

  const handleTimeChange = (time) => {
    if (time) {
      setEdittime(time);
    } else {
      setEdittime(null);
    }
  };

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

      <Modal visible={editModalVisible} title="แก้ไขการนัดหมาย" footer={false}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="date"
            label="วันที่"
            rules={[{ required: true, message: "กรุณาเลือกวันที่" }]}
          >
            <DatePicker
              onChange={(date, dateString) => seteditDateAp(dateString)}
            />
          </Form.Item>
          <Form.Item
            name="time"
            label="เวลา"
            rules={[{ required: true, message: "กรุณาเลือกเวลา" }]}
          >
            <TimePicker format="HH:mm" onChange={handleTimeChange} />
          </Form.Item>
          <Button onClick={handleSave}>ยืนการแก้ไข</Button>
          <Button onClick={handleCancel}>ยกเลิก</Button>
        </Form>
      </Modal>
    </>
  );
}
