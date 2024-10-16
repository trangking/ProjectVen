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
} from "antd";
import { Link } from "react-router-dom";
import { fetchedPets, fetchedVaccine } from "../../firebase/firebase";

const { TabPane } = Tabs;
const { Option } = Select;

const Doctorpage = () => {
  const [treatments, setTreatments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [vaccine, setVaccine] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [form] = Form.useForm(); // Create form instance for Modal

  useEffect(() => {
    const loadData = async () => {
      const fetchedPet = await fetchedPets();
      setPets(fetchedPet);
      const fetchVaccine = await fetchedVaccine();
      setVaccine(fetchVaccine);
    };
    loadData();
  }, [setPets]);

  const handleAddTreatment = (values) => {
    const newTreatment = { ...values, date: new Date().toLocaleDateString() };
    setTreatments([...treatments, newTreatment]);
  };

  const handleAddAppointment = (values) => {
    setAppointments([...appointments, values]);
  };

  const showModal = (record) => {
    setSelectedPet(record); // Set selected pet for treatment
    setIsModalVisible(true); // Show modal
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newTreatment = {
        ...values,
        petName: selectedPet.name,
        date: new Date().toLocaleDateString(),
      };
      setTreatments([...treatments, newTreatment]);
      setIsModalVisible(false); // Close modal after submission
      form.resetFields(); // Reset the form after submission
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close modal
    form.resetFields(); // Reset the form
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

            <Form layout="inline" onFinish={handleAddAppointment}>
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
                  title: "เพิ่มการรักษา",
                  key: "addTreatment",
                  render: (text, record) => (
                    <Button type="primary" onClick={() => showModal(record)}>
                      เพิ่มการรักษา
                    </Button>
                  ),
                },
              ]}
              rowKey="name"
              className="mt-4"
            />
          </TabPane>
        </Tabs>

        {/* Modal for adding treatment */}
        <Modal
          title={`เพิ่มการรักษาสำหรับ ${selectedPet?.name}`}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="vaccine"
              label="วัคซีนที่ใส่"
              rules={[{ required: true, message: "กรุณาเลือกวัคซีน" }]}
              // value = {}
            >
              <Select placeholder="เลือกวัคซีน">
                {vaccine.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.vaccineName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="notes" label="หมายเหตุ">
              <Input.TextArea placeholder="รายละเอียดเพิ่มเติม" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Doctorpage;
