import React, { useEffect, useState } from "react";
import {
  fetchedDoctors,
  addNewDoctors,
  updateDoctorInFirebase,
  deleteDoctor,
} from "../../../../firebase/firebase";
import { Upload, Button, message, Select, Modal, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function ManageDoctorsVets() {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    Prefix: "",
    name: "",
    specialty: "",
    email: "",
    password: "",
    phone: "",
  });
  const [editDoctorId, setEditDoctorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [img, setImg] = useState(null);

  const openModal = (doctor = null) => {
    if (doctor) {
      setNewDoctor({
        Prefix: doctor.Prefix,
        name: doctor.DoctorName,
        specialty: doctor.Specialty,
        email: doctor.contact,
        password: "",
        phone: doctor.PhoneDoctor,
      });
      setEditDoctorId(doctor.id);
    } else {
      setNewDoctor({
        Prefix: "",
        name: "",
        specialty: "",
        email: "",
        password: "",
        phone: "",
      });
      setEditDoctorId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewDoctor({
      Prefix: "",
      name: "",
      specialty: "",
      email: "",
      password: "",
      phone: "",
    });
    setImg(null);
  };

  const handleSaveDoctor = async () => {
    if (
      !newDoctor.Prefix ||
      !newDoctor.name ||
      !newDoctor.specialty ||
      !newDoctor.email ||
      !newDoctor.phone
    ) {
      message.error("All fields are required");
      return;
    }
    try {
      if (editDoctorId) {
        // Update doctor
        await updateDoctorInFirebase(editDoctorId, newDoctor, img);
        message.success("Doctor updated successfully");
      } else {
        // Add new doctor
        await addNewDoctors(newDoctor, img);
        message.success("Doctor added successfully");
      }
      closeModal();
      loadDoctors();
    } catch (error) {
      message.error("Error saving doctor");
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      await deleteDoctor(doctorId);
      message.success("Doctor deleted successfully");
      loadDoctors();
    } catch (error) {
      message.error("Error deleting doctor");
    }
  };

  const loadDoctors = async () => {
    const fetchedDoctorList = await fetchedDoctors();
    setDoctors(fetchedDoctorList);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const options = [
    { value: "สัตวแพทย์ชาย", label: "สัตวแพทย์ชาย" },
    { value: "สัตวแพทย์หญิง", label: "สัตวแพทย์หญิง" },
  ];

  return (
    <div className="w-full min-h-screen p-10 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-12 text-yellow-800">
        Manage Doctors
      </h1>

      <div className="flex justify-end mb-8 w-full max-w-4xl">
        <Button
          type="primary"
          onClick={() => openModal()}
          style={{ backgroundColor: "#FFB02E", borderColor: "#FFB02E" }}
          className="rounded-lg"
        >
          + Add New Doctor
        </Button>
      </div>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full bg-white rounded-lg">
          <thead className="bg-yellow-700 text-white">
            <tr>
              <th className="py-4 px-6 text-left">ชื่อหมอ</th>
              <th className="py-4 px-6 text-left">สายการแพทย์</th>
              <th className="py-4 px-6 text-left">อีเมลล์</th>
              <th className="py-4 px-6 text-left">เบอร์โทรศัพท์</th>
              <th className="py-4 px-6 text-left">ประกาศนียบัตรการแพทย์</th>
              <th className="py-4 px-6 text-left">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr
                key={doctor.id}
                className="hover:bg-yellow-50 transition-colors duration-200 border-b"
              >
                <td className="py-4 px-6">{doctor.DoctorName}</td>
                <td className="py-4 px-6">{doctor.Specialty}</td>
                <td className="py-4 px-6">{doctor.contact}</td>
                <td className="py-4 px-6">{doctor.PhoneDoctor}</td>
                <td className="py-4 px-6">
                  {doctor.Medical_license ? (
                    <img
                      src={doctor.Medical_license}
                      alt="Doctor License"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <Button
                    type="link"
                    onClick={() => openModal(doctor)}
                    className="text-yellow-600"
                  >
                    Edit
                  </Button>
                  <Button
                    type="link"
                    onClick={() => handleDeleteDoctor(doctor.id)}
                    className="text-red-600"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title={editDoctorId ? "Edit Doctor" : "Add Doctor"}
        visible={isModalOpen}
        onCancel={closeModal}
        onOk={handleSaveDoctor}
        okText="Save"
        cancelText="Cancel"
      >
        <Select
          placeholder="เลือกคำนำหน้า"
          className="w-full mb-4"
          value={newDoctor.Prefix}
          onChange={(value) => setNewDoctor({ ...newDoctor, Prefix: value })}
        >
          {options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <Input
          placeholder="ชื่อคุณหมอ"
          className="mb-4"
          value={newDoctor.name}
          onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
        />
        <Input
          placeholder="สายการแพทย์"
          className="mb-4"
          value={newDoctor.specialty}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, specialty: e.target.value })
          }
        />
        <Input
          placeholder="อีเมลล์"
          className="mb-4"
          type="email"
          value={newDoctor.email}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, email: e.target.value })
          }
        />
        <Input
          placeholder="รหัสผ่าน"
          className="mb-4"
          type="password"
          value={newDoctor.password}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, password: e.target.value })
          }
        />
        <Input
          placeholder="เบอร์โทรศัพท์"
          className="mb-4"
          value={newDoctor.phone}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, phone: e.target.value })
          }
        />
        <Upload
          beforeUpload={(file) => {
            const isJpgOrPng =
              file.type === "image/jpeg" || file.type === "image/jpeg";
            if (!isJpgOrPng) {
              message.error("You can only upload JPG/PNG files!");
              return false;
            }
            setImg(file);
            return false;
          }}
          className="w-full"
        >
          <Button icon={<UploadOutlined />}>Upload Medical License</Button>
        </Upload>
      </Modal>
    </div>
  );
}
