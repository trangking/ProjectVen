import React, { useEffect, useState } from "react";
import {
  fetchedDoctors,
  addNewDoctors,
  updateDoctorInFirebase,
  deleteDoctor,
} from "../../../../firebase/firebase";
import {
  Upload,
  Button,
  message,
  Select,
  Modal,
  Input,
  Spin,
  Table,
} from "antd";
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
    Animal_Registration_Number: "",
  });
  const [editDoctorId, setEditDoctorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [pageSize, setPageSize] = useState(5); // Items per page

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
      message.error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    setLoading(true);
    try {
      if (editDoctorId) {
        await updateDoctorInFirebase(editDoctorId, newDoctor, img);
        message.success("อัปเดตข้อมูลสัตว์แพทย์สำเร็จ");
      } else {
        await addNewDoctors(newDoctor, img);
        message.success("เพิ่มสัตว์แพทย์ใหม่สำเร็จ");
      }
      closeModal();
      await loadDoctors(); // Ensure doctors are reloaded after saving
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูลสัตว์แพทย์");
    }
    setLoading(false);
  };

  const handleDeleteDoctor = async (doctorId) => {
    setLoading(true);
    try {
      await deleteDoctor(doctorId);
      message.success("ลบข้อมูลสัตว์แพทย์สำเร็จ");
      await loadDoctors(); // Reload doctors after deletion
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบข้อมูลสัตว์แพทย์");
    }
    setLoading(false);
  };

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const fetchedDoctorList = await fetchedDoctors();
      setDoctors(fetchedDoctorList);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const options = [
    { value: "สพ.ญ.", label: "สพ.ญ.(สัตวแพทย์หญิง)" },
    { value: "น.สพ.", label: "น.สพ.(นายสัตว์แพทย์)" },
  ];

  // Columns for the antd Table
  const columns = [
    {
      title: "คำนำหน้า",
      dataIndex: "Prefix",
      key: "Prefix",
    },
    {
      title: "ชื่อสัตว์แพทย์",
      dataIndex: "DoctorName",
      key: "DoctorName",
    },
    {
      title: "ความเชี่ยวชาญ",
      dataIndex: "Specialty",
      key: "Specialty",
    },
    {
      title: "อีเมลล์",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "PhoneDoctor",
      key: "PhoneDoctor",
    },
    {
      title: "ใบรับรองคุณวุฒิทางการแพทย์",
      dataIndex: "Medical_license",
      key: "Medical_license",
      render: (text, record) =>
        record.Medical_license ? (
          <img
            src={record.Medical_license}
            alt="Doctor License"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        ) : (
          <span>No Image</span>
        ),
    },
    {
      title: "เลขที่ใบอนุญาตประกอบวิชาชีพ",
      dataIndex: "Animal_Registration_Number",
      key: "Animal_Registration_Number",
    },
    {
      title: "การจัดการ",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            type="link"
            onClick={() => openModal(record)}
            style={{ color: "#FFB02E" }}
          >
            แก้ไข
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteDoctor(record.id)}
          >
            ลบ
          </Button>
        </>
      ),
    },
  ];

  // Data for pagination

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div className="w-full min-h-screen p-10 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-12 text-yellow-800">
        จัดการข้อมูลสัตว์แพทย์
      </h1>

      <div className="flex justify-end mb-8 w-full max-w-6xl">
        <Button
          type="primary"
          onClick={() => openModal()}
          style={{ backgroundColor: "#FFB02E", borderColor: "#FFB02E" }}
          className="rounded-lg"
        >
          + เพิ่มสัตว์แพทย์ใหม่
        </Button>
      </div>

      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={doctors}
            rowKey={(record) => record.id}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: doctors.length,
            }}
            onChange={handleTableChange}
          />
        </Spin>
      </div>

      <Modal
        title={editDoctorId ? "แก้ไขข้อมูลสัตว์แพทย์" : "เพิ่มสัตว์แพทย์ใหม่"}
        visible={isModalOpen}
        onCancel={closeModal}
        onOk={handleSaveDoctor}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <Select
          placeholder="เลือกคำนำหน้า"
          className="w-full mb-4"
          value={newDoctor.Prefix || undefined}
          onChange={(value) => setNewDoctor({ ...newDoctor, Prefix: value })}
        >
          {options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <Input
          placeholder="ชื่อคุณสัตว์แพทย์"
          className="mb-4"
          value={newDoctor.name}
          onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
        />
        <Input
          placeholder="ความเชี่ยวชาญ"
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
        {!editDoctorId && (
          <Input
            placeholder="รหัสผ่าน"
            className="mb-4"
            type="password"
            value={newDoctor.password}
            onChange={(e) =>
              setNewDoctor({ ...newDoctor, password: e.target.value })
            }
          />
        )}
        <Input
          placeholder="เบอร์โทรศัพท์"
          className="mb-4"
          value={newDoctor.phone}
          onChange={(e) =>
            setNewDoctor({ ...newDoctor, phone: e.target.value })
          }
        />
        <Input
          placeholder="เลขที่ใบอนุญาตประกอบวิชาชีพ"
          className="mb-4"
          value={newDoctor.Animal_Registration_Number}
          onChange={(e) =>
            setNewDoctor({
              ...newDoctor,
              Animal_Registration_Number: e.target.value,
            })
          }
        />
        <Upload
          beforeUpload={(file) => {
            const isJpgOrPng =
              file.type === "image/jpeg" || file.type === "image/png";
            if (!isJpgOrPng) {
              message.error("คุณสามารถอัปโหลดไฟล์ JPG/PNG เท่านั้น!");
              return false;
            }
            setImg(file);
            return false;
          }}
          className="w-full"
        >
          <Button icon={<UploadOutlined />}>
            อัปโหลดใบรับรองคุณวุฒิทางการแพทย์
          </Button>
        </Upload>
      </Modal>
    </div>
  );
}
