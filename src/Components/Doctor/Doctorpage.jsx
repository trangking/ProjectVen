import React, { useState, useEffect } from "react";
import {
  Tabs,
  Button,
  Form,
  Select,
  DatePicker,
  Modal,
  Table,
  Input,
  message,
  TimePicker,
  Spin,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  addNEwTreatment,
  fetchedPets,
  fetchedVaccine,
  upDateAppointment,
  fetchedDoctorsByID,
  fetchedAddPointMentBydoctorID,
} from "../../firebase/firebase";
import moment from "moment";
import dayjs from "dayjs";
import useStore from "../../store";
import { render } from "@testing-library/react";

const { TabPane } = Tabs;
const { Option } = Select;

const Doctorpage = () => {
  const [openHistory, setOpenHistory] = useState(false);
  const [vaccineId, setVaccineId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [vaccine, setVaccine] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState([]);
  const [form] = Form.useForm();
  const [treatmentsdec, setTreatmentsdec] = useState("");
  const [nextAppointmentDate, setNextAppointmentDate] = useState(null);
  const [typeStatus, setTypeStatus] = useState("");
  const [apID, setapId] = useState("");
  const format = "HH:mm";
  const [selectedTime, setSelectedTime] = useState(dayjs());
  const [ownerId, setOwnerId] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const getID = localStorage.getItem("Id");
  const [doctor, setDoctor] = useState([]);
  const [vaccine_dose, setvaccine_dose] = useState("");
  const logout = useStore((state) => state.logout);
  const [searchText, setSearchText] = useState("");
  const [searchTextap, setSearchTextap] = useState("");
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctor && !doctor.Name && !token) {
      navigate("/");
      message.error("กรุณาล็อคอิน");
      return;
    }
    const timer = setTimeout(() => {
      localStorage.removeItem("token");
      alert("เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่");
      navigate("/");
    }, 3600000);

    return () => clearTimeout(timer);
  }, [token, navigate]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // เริ่มโหลดข้อมูล
      const fetchedPet = await fetchedPets();
      setPets(fetchedPet);
      setFilteredPets(fetchedPet);
      const fetchVaccine = await fetchedVaccine();
      setVaccine(fetchVaccine);
      const fetchappointment = await fetchedAddPointMentBydoctorID(getID);
      setAppointments(fetchappointment);
      setFilteredAppointments(fetchappointment);
      setLoading(false); // หยุดการแสดงโหลดเมื่อข้อมูลถูกโหลดเสร็จ
    };
    loadData();
  }, [getID]);

  useEffect(() => {
    const loadDoctorData = async () => {
      if (getID) {
        const fetchedDoctorByID = await fetchedDoctorsByID(getID);
        setDoctor(fetchedDoctorByID);
      }
    };
    loadDoctorData();
  }, [getID]);

  const showModal = (record) => {
    setTypeStatus("01");
    setSelectedPet(record);
    setIsModalVisible(true);
    setOwnerId(record.ownerId);
  };

  const showModaladdtreatment = (record) => {
    if (record.pet && record.pet.length > 0) {
      setSelectedPet(record.pet[0]);
    } else {
      console.log("ไม่มีข้อมูลสัตว์เลี้ยง");
    }
    if (record.pet && record.owner.length > 0) {
      setOwnerId(record.owner[0].id);
    } else {
      console.log("ไม่มีข้อมูลเจ้าของ");
    }
    setapId(record.id);
    setTypeStatus("02");
    setIsModalVisible(true);
  };

  const showModalHistory = async (record) => {
    setSelectedPet(record);
    setOpenHistory(true);
  };

  const handleAddTreatment = async () => {
    setLoading(true); // เริ่มแสดง loading spinner
    try {
      if (!selectedPet.id || !vaccineId || !vaccine_dose) {
        message.error(
          "กรุณากรอกข้อมูลทั้งหมด: สัตว์เลี้ยง, วัคซีน และรายละเอียดการรักษา"
        );
        setLoading(false); // ปิด loading ถ้าข้อมูลไม่ครบ
        return;
      }
      if (typeStatus === "02") {
        await upDateAppointment(apID);
      }
      await addNEwTreatment(
        selectedPet.id,
        vaccineId,
        treatmentsdec,
        nextAppointmentDate,
        selectedTime,
        ownerId,
        doctor.id,
        vaccine_dose
      );
      setIsModalVisible(false);
      setSelectedPet({});
      setVaccineId("");
      setTreatmentsdec("");
      setNextAppointmentDate(null);
      setSelectedTime(null);
      form.resetFields();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการการจัดการให้วัคซีน");
    }
    setLoading(false); // หยุดแสดง loading spinner เมื่อเสร็จสิ้น
    handleCancel();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setOpenHistory(false);
    setSelectedPet({});
    setVaccineId("");
    setTreatmentsdec("");
    setNextAppointmentDate(null);
    setSelectedTime(null);
    form.resetFields();
  };

  const handleTimeChange = (time) => {
    if (time) {
      setSelectedTime(time);
    } else {
      setSelectedTime(null);
    }
  };

  const handleDateSearch = (date) => {
    if (!date) {
      setFilteredAppointments(appointments);
      return;
    }

    const formattedDate = date.format("YYYY-MM-DD");
    console.log("วันที่ค้นหา:", formattedDate);

    const filtered = appointments.filter((appointment) => {
      console.log("ตรวจสอบการนัดหมาย:", appointment);

      if (appointment.nextAppointmentDate) {
        const appointmentDate = appointment.nextAppointmentDate;
        console.log("วันที่นัดหมาย:", appointmentDate);

        return appointmentDate === formattedDate;
      } else {
        console.log("ไม่มีข้อมูลวันที่นัดหมาย");
        return false;
      }
    });

    setFilteredAppointments(filtered);
    console.log("ผลการค้นหา:", filtered);
  };

  const handleSearchap = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchText(searchValue); // อัปเดตค่าในช่องค้นหา

    if (searchValue) {
      const filteredData = appointments.filter(
        (appointment) =>
          appointment.pet &&
          appointment.pet[0] && // ตรวจสอบว่ามีข้อมูล pet[0] หรือไม่
          ((appointment.pet[0].name &&
            appointment.pet[0].name.toLowerCase().includes(searchValue)) ||
            (appointment.pet[0].NumberPet &&
              String(appointment.pet[0].NumberPet)
                .toLowerCase()
                .includes(searchValue)))
      );
      setFilteredAppointments(filteredData);
    } else {
      setFilteredAppointments(appointments); // ถ้าช่องค้นหาว่าง แสดงข้อมูลทั้งหมด
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchText(searchValue);

    if (searchValue) {
      const filteredData = pets.filter(
        (pet) =>
          (pet.name && pet.name.toLowerCase().includes(searchValue)) ||
          (pet.NumberPet &&
            String(pet.NumberPet).toLowerCase().includes(searchValue))
      );
      setFilteredPets(filteredData);
    } else {
      setFilteredPets(pets); // ถ้าช่องค้นหาว่าง แสดงข้อมูลทั้งหมด
    }
  };

  return (
    <div className="manage-doctor">
      <div className="header bg-yellow-500 text-white p-4 text-center mb-4">
        <h1 className="text-3xl font-bold">
          ตารางนัดของหมอ:{" "}
          {doctor && doctor.DoctorName ? doctor.DoctorName : "ค้นหาชื่อไม่เจอ"}
        </h1>
      </div>

      <div className="p-8">
        <Tabs defaultActiveKey="1">
          <TabPane tab="ตารางนัดหมาย" key="1">
            <h2 className="text-2xl font-bold mb-4">ตารางนัดของหมอ</h2>

            <Form layout="inline">
              <Form.Item name="date" label="เลือกวันที่">
                <DatePicker onChange={handleDateSearch} />
              </Form.Item>

              <Form.Item name="seachpet" label="ค้นหาสัตว์เลี้ยง">
                <Input
                  placeholder="ค้นหาชื่อสัตว์ / เลขสัตว์เลี้ยง"
                  value={searchText}
                  onChange={handleSearchap}
                  style={{ width: "200px" }} // ปรับขนาดช่องค้นหาให้เหมาะสม
                />
              </Form.Item>

              <Form.Item>
                <Link to={"/pageAdmin/Appointment"} target="blank">
                  <Button type="primary">เพิ่มการนัดหมาย</Button>
                </Link>
                <Link to={"/"} className=" ml-4">
                  <Button className=" bg-[#f50] text-white" onClick={logout}>
                    ออกจากระบบ
                  </Button>
                </Link>
              </Form.Item>
            </Form>
            <Spin spinning={loading}>
              <Table
                dataSource={filteredAppointments}
                columns={[
                  {
                    title: "วันที่นัด",
                    dataIndex: "nextAppointmentDate",
                    key: "nextAppointmentDate",
                  },
                  {
                    title: "เวลา",
                    dataIndex: "TimeAppoinMentDate",
                    key: "time",
                  },
                  {
                    title: "ชื่อสัตว์",
                    key: "name",
                    render: (text, record) =>
                      `${record.pet[0].name} / ${record.pet[0].NumberPet}`, // รวม name และ NumberPet
                  },
                  {
                    title: "ประเภทสัตว์เลี้ยง",
                    dataIndex: ["pet", "0", "type"],
                    key: "petType",
                  },
                  {
                    title: "สายพันธุ์สัตว์",
                    dataIndex: ["pet", "0", "subType"],
                    key: "petsubType",
                  },
                  {
                    title: "นํ้าหนักสัตว์เลี้ยง",
                    dataIndex: ["pet", "0", "weight"],
                    key: "petweight",
                  },
                  {
                    title: "ชื่อเจ้าของ",
                    render: (text, record) =>
                      `${record.owner[0].name}  ${record.owner[0].lastname}`,
                    key: "ownerName",
                  },
                  {
                    title: "รายละเอียด",
                    dataIndex: ["Latesttreatment", "description"],
                    key: "description",
                  },
                  {
                    title: "สถานะการนัดหมาย",
                    dataIndex: "confirmStats",
                    key: "confirmStats",
                    render: (confirmStats) =>
                      confirmStats === null
                        ? "รอยืนยันการนัด"
                        : confirmStats
                        ? "ยืนยันแล้ว"
                        : "ยกเลิก",
                  },
                  {
                    title: "สถานะการรักษา",
                    dataIndex: "status",
                    key: "treatmentStatus",
                    render: (status) => (status ? "เสร็จสิ้น" : "รอดำเนินการ"),
                  },
                  {
                    title: "การจัดการให้วัคซีน",
                    render: (text, record) => (
                      <div
                        style={{
                          pointerEvents: !record.confirmStats ? "none" : "auto",
                          opacity: !record.confirmStats ? 0.5 : 1,
                        }}
                      >
                        <Button
                          disabled={record.status}
                          key={record.id}
                          onClick={() => showModaladdtreatment(record)}
                        >
                          เปิด
                        </Button>
                      </div>
                    ),
                    key: "addTreatment",
                  },
                ]}
                rowKey={(record) => record.id || record.petId}
                className="mt-4"
              />
            </Spin>
          </TabPane>

          <TabPane tab="สัตว์เลี้ยง" key="2">
            <h2 className="text-2xl font-bold mb-4">ข้อมูลสัตว์เลี้ยง</h2>

            {/* ช่องค้นหาชื่อสัตว์ */}
            <Input
              placeholder="ค้นหาชื่อสัตว์ / เลขสัตว์เลี้ยง"
              value={searchText}
              onChange={handleSearch}
              className="mb-4"
              style={{
                width: "10%",
              }}
            />

            <Table
              dataSource={filteredPets}
              columns={[
                {
                  title: "ชื่อสัตว์",
                  key: "name",
                  render: (text, record) =>
                    `${record.name} / ${record.NumberPet}`, // รวม name และ NumberPet
                },
                { title: "ประเภท", dataIndex: "type", key: "type" },
                { title: "สายพันธุ์", dataIndex: "subType", key: "subType" },
                { title: "เจ้าของ", dataIndex: "ownerName", key: "ownerName" },
                { title: "อายุ (ปี)", dataIndex: "years", key: "years" },
                { title: "อายุ (เดือน)", dataIndex: "months", key: "months" },
                { title: "นํ้าหนัก", dataIndex: "weight", key: "weight" },
                {
                  title: "ดูประวัติการรักษา",
                  key: "GetTreatment",
                  render: (text, record) => (
                    <Button onClick={() => showModalHistory(record)}>
                      เปิด
                    </Button>
                  ),
                },
                {
                  title: "การจัดการให้วัคซีน",
                  key: "addTreatment",
                  render: (text, record) => (
                    <Button type="primary" onClick={() => showModal(record)}>
                      เพิ่ม
                    </Button>
                  ),
                },
              ]}
              rowKey="name"
              className="mt-4"
            />
          </TabPane>
        </Tabs>

        <Modal
          title={`การจัดการให้วัคซีนสำหรับ ${selectedPet?.name}`}
          visible={isModalVisible}
          onOk={handleAddTreatment}
          onCancel={handleCancel}
        >
          <Spin spinning={loading}>
            <Form form={form} layout="vertical">
              <Form.Item
                name="vaccine"
                label="วัคซีน"
                rules={[{ required: true, message: "กรุณาเลือกวัคซีน" }]}
              >
                <Select
                  placeholder="เลือกวัคซีน"
                  onChange={setVaccineId}
                  value={vaccineId}
                >
                  {vaccine.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.vaccineName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="notes" label="หมายเหตุ">
                <Input.TextArea
                  onChange={(event) => setTreatmentsdec(event.target.value)}
                  placeholder="รายละเอียดเพิ่มเติม"
                  value={treatmentsdec}
                />
              </Form.Item>

              <Form.Item
                name="vaccine_dose"
                label="ปริมาณ(โดส)"
                rules={[{ required: true, message: "กรุณากรอกปริมาณ" }]}
              >
                <Input
                  onChange={(event) => setvaccine_dose(event.target.value)}
                  placeholder="กรอกปริมาณ"
                  value={vaccine_dose}
                  addonAfter="โดส"
                />
              </Form.Item>

              <Form.Item label="วันนัดครั้งถัดไป">
                <DatePicker
                  defaultValue={
                    nextAppointmentDate ? moment(nextAppointmentDate) : null
                  }
                  onChange={(date, dateString) =>
                    setNextAppointmentDate(dateString)
                  }
                  style={{ width: "100%" }}
                  placeholder="เลือกวันนัดครั้งถัดไป"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex flex-col">
                  <label>เวลานัดครั้งถัดไป</label>
                  <TimePicker
                    className="mt-2"
                    format={format}
                    onChange={handleTimeChange}
                  />
                </div>
              </Form.Item>
            </Form>
          </Spin>
        </Modal>

        <Modal
          title={`ประวัติการรักษา : ${selectedPet?.name}`}
          visible={openHistory}
          onCancel={handleCancel}
          footer={null}
          width={1000}
        >
          <Spin spinning={loading}>
            <div className="bg-pink-100 rounded-lg p-6">
              <table className="min-w-full table-auto border-collapse border border-pink-200">
                <thead>
                  <tr className="bg-pink-200">
                    <th className="px-4 py-2 border border-pink-300">
                      การฉีดวัคซีน
                    </th>
                    <th className="px-4 py-2 border border-pink-300">
                      หมายเลขชุด
                    </th>
                    <th className="px-4 py-2 border border-pink-300">
                      วันที่ฉีดวัคซีน
                    </th>
                    <th className="px-4 py-2 border border-pink-300">
                      ปริมาณการฉีดวัคซีน
                    </th>
                    <th className="px-4 py-2 border border-pink-300">
                      นัดครั้งถัดไป
                    </th>
                    <th className="px-4 py-2 border border-pink-300">
                      ฉลากวัดคซีน
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(selectedPet.historytreatments) &&
                  selectedPet.historytreatments.length > 0 ? (
                    selectedPet.historytreatments.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border border-pink-300">
                          {item.vaccine.vaccineName}
                        </td>
                        <td className="px-4 py-2 border border-pink-300">
                          <img
                            src={item.batchNo}
                            alt={`Batch No. ${index + 1}`}
                            className="w-12 h-12 object-contain"
                          />
                        </td>
                        <td className="px-4 py-2 border border-pink-300">
                          {item.DateVaccination}
                        </td>
                        <td className="px-4 py-2 border border-pink-300">
                          {item.vaccine_dose}
                        </td>
                        <td className="px-4 py-2 border border-pink-300">
                          {item.nextAppointmentDate}
                        </td>
                        <td className="px-4 py-2 border border-pink-300 flex justify-center">
                          <img
                            src={item.vaccine.vaccineImage}
                            alt={`Sticker for ${item.vaccine.vaccineImage}`}
                            className="w-20 h-20 object-contain"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        ไม่มีข้อมูลการรักษา
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Spin>
        </Modal>
      </div>
    </div>
  );
};

export default Doctorpage;
