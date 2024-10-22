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
} from "antd";
import { Link } from "react-router-dom";
import {
  addNEwTreatment,
  fetchedPets,
  fetchedVaccine,
  fetchedAddPointMent,
  upDateAppointment,
} from "../../firebase/firebase";
import moment from "moment";

const { TabPane } = Tabs;
const { Option } = Select;

const Doctorpage = () => {
  const [openHistory, setOpenHistory] = useState(false);
  const [vaccineId, setVaccineId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [vaccine, setVaccine] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState([]);
  const [form] = Form.useForm();
  const [treatmentsdec, setTreatmentsdec] = useState("");
  const [nextAppointmentDate, setNextAppointmentDate] = useState(null);
  const [typeStatus, setTypeStatus] = useState("");
  const [apID, setapId] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const fetchedPet = await fetchedPets();
      setPets(fetchedPet);
      const fetchVaccine = await fetchedVaccine();
      setVaccine(fetchVaccine);
      const fetchappointment = await fetchedAddPointMent();
      setAppointments(fetchappointment);
    };
    loadData();
  }, []);

  const showModal = (record) => {
    setTypeStatus("01");
    setSelectedPet(record);
    setIsModalVisible(true);
  };
  const showModaladdtreatment = (record) => {
    if (record.pet && record.pet.length > 0) {
      setSelectedPet(record.pet[0]);
    } else {
      console.log("No pet data found");
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
    if (!selectedPet.id || !vaccineId) {
      message.error(
        "กรุณากรอกข้อมูลทั้งหมด: สัตว์เลี้ยง, วัคซีน และรายละเอียดการรักษา"
      );
      return;
    }
    if (typeStatus === "02") {
      await upDateAppointment(apID);
    }
    await addNEwTreatment(
      selectedPet.id,
      vaccineId,
      treatmentsdec,
      nextAppointmentDate
    );
    setIsModalVisible(false);
    message.success("เพิ่มการรักษาเรียบร้อยแล้ว");
    setSelectedPet({});
    setVaccineId("");
    setTreatmentsdec("");
    setNextAppointmentDate(null);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setOpenHistory(false);
    setSelectedPet({});
    setVaccineId("");
    setTreatmentsdec("");
    setNextAppointmentDate(null);
    form.resetFields();
  };

  return (
    <div className="manage-doctor">
      <div className="header bg-yellow-500 text-white p-4 text-center mb-4">
        <h1 className="text-3xl font-bold">จัดการข้อมูลหมอ: [ชื่อหมอ]</h1>
      </div>

      <div className="p-8">
        <Tabs defaultActiveKey="1">
          <TabPane tab="ตารางวันนัด" key="1">
            <h2 className="text-2xl font-bold mb-4">ตารางวันนัดของหมอ</h2>

            <Form layout="inline">
              <Form.Item
                name="date"
                label="วันที่"
                rules={[{ required: true }]}
              >
                <DatePicker />
              </Form.Item>
              <Form.Item name="description" label="รายละเอียด">
                <Input placeholder="รายละเอียดการนัด" />
              </Form.Item>
              <Form.Item>
                <Link to={"/pageAdmin/Appointment"}>
                  <Button type="primary">เพิ่มการนัดหมาย</Button>
                </Link>
              </Form.Item>
            </Form>

            <Table
              dataSource={appointments}
              columns={[
                {
                  title: "วันที่นัด",
                  dataIndex: "nextAppointmentDate",
                  key: "nextAppointmentDate",
                },
                {
                  title: "ชื่อสัตว์เลี้ยง",
                  render: (text, record) => {
                    return record.pet && record.pet.length > 0
                      ? record.pet[0].name
                      : "ไม่มีชื่อสัตว์เลี้ยง";
                  },
                  key: "name",
                },
                {
                  title: "รายละเอียด",
                  dataIndex: ["Latesttreatment", "description"],
                  key: "description",
                },
                {
                  title: "สถานะการรักษา",
                  dataIndex: "status",
                  key: "สถานะการรักษา",
                  render: (status) =>
                    status === false ? "รอดำเนินการ" : "มาตามนัด",
                },
                {
                  title: "เพิ่มการรักษา",
                  render: (text, record) => (
                    <Button
                      key={
                        record.id || record.petId || record.nextAppointmentDate
                      }
                      onClick={() => showModaladdtreatment(record)}
                    >
                      เปิด
                    </Button>
                  ),
                  key: "treatment",
                },
              ]}
              rowKey={(record) => record.id || record.petId}
              className="mt-4"
            />
          </TabPane>

          <TabPane tab="สัตว์เลี้ยง" key="2">
            <h2 className="text-2xl font-bold mb-4">ข้อมูลสัตว์เลี้ยง</h2>

            <Table
              dataSource={pets}
              columns={[
                { title: "ชื่อสัตว์", dataIndex: "name", key: "name" },
                { title: "ประเภท", dataIndex: "type", key: "type" },
                { title: "อายุ (ปี)", dataIndex: "years", key: "years" },
                { title: "อายุ (เดือน)", dataIndex: "months", key: "months" },
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
                  title: "เพิ่มการรักษา",
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
          title={`เพิ่มการรักษาสำหรับ ${selectedPet?.name}`}
          visible={isModalVisible}
          onOk={handleAddTreatment}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="vaccine"
              label="วัคซีนที่ใส่"
              rules={[{ required: true, message: "กรุณาเลือกวัคซีน" }]}
            >
              <Select
                placeholder="เลือกวัคซีน"
                onChange={setVaccineId}
                value={vaccineId}
              >
                {vaccine.length === 0 ? (
                  <Option disabled>No vaccines available</Option>
                ) : (
                  vaccine.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.vaccineName}
                    </Option>
                  ))
                )}
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
              label="วันนัดครั้งถัดไป (ถ้าไม่กรอกอะไรลงไป ระบบจะบอกว่าไม่มีนัด)"
              rules={[
                { required: true, message: "กรุณาเลือกวันนัดครั้งถัดไป" },
              ]}
            >
              <DatePicker
                value={nextAppointmentDate ? moment(nextAppointmentDate) : null} // แปลงค่าให้เป็น moment object ถ้ามีค่า
                onChange={(date, dateString) =>
                  setNextAppointmentDate(dateString)
                }
                style={{ width: "100%" }}
                placeholder="เลือกวันนัดครั้งถัดไป"
              />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={`ประวัติการรักษา : ${selectedPet?.name}`}
          visible={openHistory}
          onCancel={handleCancel}
          footer={null}
          width={1000}
        >
          <div className="bg-pink-100 rounded-lg p-6">
            <table className="min-w-full table-auto border-collapse border border-pink-200">
              <thead>
                <tr className="bg-pink-200">
                  <th className="px-4 py-2 border border-pink-300">
                    Vaccination Against
                  </th>
                  <th className="px-4 py-2 border border-pink-300">
                    Batch No.
                  </th>
                  <th className="px-4 py-2 border border-pink-300">
                    Date of Vaccination
                  </th>
                  <th className="px-4 py-2 border border-pink-300">
                    Next Vaccination
                  </th>
                  <th className="px-4 py-2 border border-pink-300">Sticker</th>
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
                        {item.nextAppointmentDate}
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        <img
                          src={item.vaccine.vaccineImage}
                          alt={`Sticker for ${item.vaccine.vaccineImage}`}
                          className="w-12 h-12 object-contain"
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
        </Modal>
      </div>
    </div>
  );
};

export default Doctorpage;
