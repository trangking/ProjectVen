import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Select,
  Card,
  message,
} from "antd";

import {
  fetchedPets,
  fetchedDoctors,
  getOwnerByIdpet,
  addAppointmentInAdmin,
} from "../../../firebase/firebase";

const { Option } = Select;

export default function AppointmentForm() {
  const [pets, setPets] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form] = Form.useForm();
  const [AddAppointment, setAddAppointment] = useState({
    petId: "",
    ownerId: "",
    nextAppointmentDate: "",
    selectedTime: "",
    doctorID: "",
  });

  useEffect(() => {
    const loadData = async () => {
      const fetchedPet = await fetchedPets();
      setPets(fetchedPet);
      const fetchedDoctor = await fetchedDoctors();
      setDoctors(fetchedDoctor);
    };
    loadData();
  }, []);

  const handleFormSubmit = async () => {
    try {
      const result = await addAppointmentInAdmin(AddAppointment);
      if (result.success) {
        message.success("เพิ่มการนัดหมายเสร็จสิ้น");
      } else {
        message.error(
          result.message || "An error occurred while adding the appointment."
        );
      }
    } catch (err) {
      message.error("Error: " + err.message);
    }
  };

  const onchangePets = async ({ id, ownerId }) => {
    setAddAppointment((prevAppointments) => ({
      ...prevAppointments,
      petId: id,
      ownerId: ownerId,
    }));

    try {
      const response = await getOwnerByIdpet(ownerId); // Await the Promise to resolve
      form.setFieldsValue({
        ownerName: response.name,
        phoneNumber: response.phone,
      });
    } catch (err) {
      console.log(err, "ไม่พบข้อมูล");
    }
  };

  const onchangeDoctor = (value) => {
    setAddAppointment((prevAppointments) => ({
      ...prevAppointments,
      doctorID: value,
    }));
  };

  // Handle date change
  const onDateChange = (date) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : "";
    setAddAppointment((prevAppointments) => ({
      ...prevAppointments,
      nextAppointmentDate: formattedDate,
    }));
  };

  // Handle time change
  const onTimeChange = (time) => {
    const formattedTime = time ? time.format("HH:mm") : "";
    setAddAppointment((prevAppointments) => ({
      ...prevAppointments,
      selectedTime: formattedTime,
    }));
  };

  return (
    <div className="flex flex-row w-full h-[80vh] bg-gray-100">
      {/* Form Section */}
      <Card className="min-h-auto flex w-1/2 bg-white p-8 rounded-l-2xl justify-center">
        <div className="w-full max-w-lg mx-auto flex flex-col">
          <h1 className="text-5xl font-bold text-center mb-8 text-teal-600">
            นัดหมายสัตว์เลี้ยง
          </h1>

          {/* Form */}
          <Form
            form={form}
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
              <Select
                placeholder="เลือกชื่อสัตว์เลี้ยง"
                onChange={(value) => {
                  const [id, ownerId] = value.split(",");
                  onchangePets({ id, ownerId });
                }}
              >
                {pets.map((pet, index) => (
                  <Option key={index} value={`${pet.id},${pet.ownerId}`}>
                    {pet.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Owner Name */}
            <Form.Item
              name="ownerName"
              label="ลูกค้า"
              rules={[{ required: true, message: "กรุณากรอกชื่อลูกค้า" }]}
            >
              <Input placeholder="กรอกชื่อเจ้าของ" disabled />
            </Form.Item>

            {/* Doctor Name */}
            <Form.Item
              name="doctorName"
              label="ชื่อแพทย์"
              rules={[{ required: true, message: "กรุณากรอกชื่อแพทย์" }]}
            >
              <Select placeholder="เลือกชื่อแพทย์" onChange={onchangeDoctor}>
                {doctors.map((doctor, index) => (
                  <Option key={index} value={doctor.id}>
                    {doctor.DoctorName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Phone Number */}
            <Form.Item
              name="phoneNumber"
              label="เบอร์โทรศัพท์"
              rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์" }]}
            >
              <Input placeholder="กรอกเบอร์โทรศัพท์" disabled />
            </Form.Item>

            {/* Appointment Date */}
            <Form.Item
              name="appointmentDate"
              label="วันที่นัดหมาย"
              rules={[{ required: true, message: "กรุณาเลือกวันที่นัดหมาย" }]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                className="w-full"
                onChange={onDateChange}
              />
            </Form.Item>

            {/* Appointment Time */}
            <Form.Item
              name="appointmentTime"
              label="เวลานัดหมาย"
              rules={[{ required: true, message: "กรุณาเลือกเวลานัดหมาย" }]}
            >
              <TimePicker
                format="HH:mm"
                className="w-full"
                onChange={onTimeChange}
              />
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
