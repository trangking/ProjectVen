import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Select,
  Card,
} from "antd";
import {
  fecthOwners,
  fetchedPets,
  fetchedDoctors,
} from "../../../firebase/firebase";

const { Option } = Select;

// ฟอร์มนัดหมายสัตว์เลี้ยง
export default function AppointmentForm() {
  const [pets, setPets] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [owners, setOwners] = useState([]);
  const [phoneOwners, setPhoneOwners] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const fetchedPet = await fetchedPets();
      setPets(fetchedPet);
      const fetchedDoctor = await fetchedDoctors();
      setDoctors(fetchedDoctor);
      const fetchOwner = await fecthOwners();
      setOwners(fetchOwner);
    };
    loadData();
  }, []);

  const handleFormSubmit = (values) => {
    console.log("ข้อมูลที่ถูกส่ง:", values);
  };

  return (
    <div className="flex flex-row w-full h-[80vh] bg-gray-100">
      {/* Form Section */}
      <Card className="min-h-auto flex w-1/2 bg-white p-8 rounded-l-2xl  justify-center">
        <div className="w-full max-w-lg mx-auto flex flex-col  ">
          <h1 className="text-5xl font-bold text-center mb-8 text-teal-600">
            นัดหมายสัตว์เลี้ยง
          </h1>

          {/* Form */}
          <Form
            onFinish={handleFormSubmit}
            layout="vertical"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10"
          >
            {/* Pet Name */}
            <Form.Item
              name="petName"
              label="ชื่อสัตว์เลี้ยง"
              rules={[{ required: true, message: "กรุณากรอกชื่อสัตว์เลี้ยง" }]}
            >
              <Select placeholder="เลือกชื่อสัตว์เลี้ยง">
                {pets.map((pets, index) => (
                  <Option key={index} value={pets.name}>
                    {pets.name}
                  </Option>
                ))}
              </Select>{" "}
            </Form.Item>

            {/* Owner Name */}
            <Form.Item
              name="ownerName"
              label="ลูกค้า"
              rules={[{ required: true, message: "กรุณากรอกชื่อลูกค้า" }]}
            >
              <Select placeholder="เลือกชื่อลูกค้า">
                {owners.map((owner, index) => (
                  <Option key={index} value={owner.name}>
                    {owner.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Doctor Name */}
            <Form.Item
              name="doctorName"
              label="ชื่อแพทย์"
              rules={[{ required: true, message: "กรุณากรอกชื่อแพทย์" }]}
            >
              <Select placeholder="เลือกชื่อแพทย์">
                {doctors.map((doctor, index) => (
                  <Option key={index} value={doctor.name}>
                    {doctor.DoctorName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Phone Number */}
            <Form.Item
              name="phoneNumber"
              label="เบอร์โทร"
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกเบอร์โทร",
                },
              ]}
            >
              <Input placeholder="กรอกเบอร์โทร" disabled value={owners.phone} />
            </Form.Item>

            {/* Appointment Time */}
            <Form.Item
              name="appointmentDate"
              label="วันที่นัดหมาย"
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกวันที่นัดหมาย",
                },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>

            <Form.Item
              name="appointmentTime"
              label="เวลานัดหมาย"
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกเวลานัดหมาย",
                },
              ]}
            >
              <TimePicker format="HH:mm" className="w-full" />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item className="col-span-1 md:col-span-2 flex w-full justify-center mt-6">
              <Button type="primary" htmlType="submit" className="w-full">
                ยืนยันนัดหมาย
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>

      {/* Image Section */}
      <div className="w-1/2 h-auto">
        <img
          src="/image/vet.webp"
          alt="Veterinarian and Pet"
          className="object-cover w-full h-full rounded-r-2xl"
        />
      </div>
    </div>
  );
}
