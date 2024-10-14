import React, { useEffect, useState } from "react";
import { fetchedDoctors, addNewDoctors } from "../../../../firebase/firebase";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function ManageDoctorsVets() {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [img, setImg] = useState(null);

  const openModal = (index = null) => {
    if (index !== null) {
      setNewDoctor(doctors[index]);
      setEditIndex(index);
    } else {
      setNewDoctor({ name: "", specialty: "", email: "", phone: "" });
      setEditIndex(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewDoctor({ name: "", specialty: "", email: "", phone: "" });
    setImg(null); // Reset image
  };

  const handleAddDoctor = async () => {
    console.log("handleAddDoctor called");
    if (
      !newDoctor.name ||
      !newDoctor.specialty ||
      !newDoctor.email ||
      !newDoctor.phone ||
      !img
    ) {
      console.error("All fields and image must be filled");
      return;
    }

    if (editIndex === null) {
      // Add new doctor
      try {
        console.log("Adding new doctor with image: ", img);
        await addNewDoctors(newDoctor, img);
        closeModal();
      } catch (error) {
        console.error("Error adding new doctor:", error);
      }
    } else {
      console.error("Edit functionality is not implemented yet");
    }
  };

  const handleDeleteDoctor = (index) => {
    const updatedDoctors = doctors.filter((_, i) => i !== index);
    setDoctors(updatedDoctors);
  };

  useEffect(() => {
    const loadDoctors = async () => {
      const fetchedDoctor = await fetchedDoctors();
      setDoctors(fetchedDoctor);
    };
    loadDoctors();
  }, [setDoctors]);
  return (
    <>
      <div className="w-full h-screen p-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-center mb-10 text-yellow-800">
          Manage Doctors
        </h1>

        {/* Add New Doctor Button */}
        <div className="flex justify-end mb-8 w-full max-w-3xl">
          <button
            className="bg-yellow-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-yellow-600 transition-transform transform hover:scale-105"
            onClick={() => openModal()}
          >
            + Add New Doctor
          </button>
        </div>

        {/* Table to Display Doctors */}
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-yellow-700 text-white">
              <tr>
                <th className="py-4 px-6 font-semibold text-left">ชื่อหมอ</th>
                <th className="py-4 px-6 font-semibold text-left">
                  สายการแพทย์
                </th>
                <th className="py-4 px-6 font-semibold text-left">อีเมลล์</th>
                <th className="py-4 px-6 font-semibold text-left">
                  เบอร์โทรศัพท์
                </th>
                <th className="py-4 px-6 font-semibold text-left">
                  ประกาศศนียบัตรการแพทย์
                </th>
                <th className="py-4 px-6 font-semibold text-left">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-yellow-50 transition-colors duration-200"
                >
                  <td className="py-4 px-6">{doctor.DoctorName}</td>
                  <td className="py-4 px-6">{doctor.Specialty}</td>
                  <td className="py-4 px-6">{doctor.EmailDoctor}</td>
                  <td className="py-4 px-6">{doctor.PhoneDoctor}</td>
                  <td className="py-4 px-6">
                    {/* ตรวจสอบว่ามี Medical_license ก่อนแสดงผล */}
                    {doctor.Medical_license ? (
                      <img
                        src={doctor.Medical_license}
                        alt="Doctor License"
                        style={{ width: "300px" }}
                      />
                    ) : (
                      <span>No Image Available</span> // กรณีที่ไม่มีรูป
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      className="text-yellow-500 hover:text-yellow-600 mr-4 font-medium"
                      onClick={() => openModal(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600 font-medium"
                      onClick={() => handleDeleteDoctor(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white w-full max-w-lg p-8 rounded-lg shadow-2xl relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-6 text-yellow-700">
              {editIndex !== null ? "Edit Doctor" : "เพิ่มหมอ "}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="ชื่อคุณหมอ"
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={newDoctor.name}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="สายการแพทย์"
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={newDoctor.specialty}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, specialty: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="อีเมลล์"
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={newDoctor.email}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="เบอร์โทรศัพท์"
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={newDoctor.phone}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, phone: e.target.value })
                }
              />
              <div className="mt-5">
                <Upload
                  beforeUpload={(file) => {
                    // ตรวจสอบว่าเป็นไฟล์รูปภาพเท่านั้น
                    const isJpgOrPng =
                      file.type === "image/jpeg" || file.type === "image/png";
                    if (!isJpgOrPng) {
                      alert("You can only upload JPG/PNG file!");
                      return false;
                    }
                    setImg(file); // เก็บไฟล์ที่ถูกเลือกใน state
                    return false; // ป้องกันการอัปโหลดอัตโนมัติ
                  }}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600 transition-all"
                onClick={handleAddDoctor}
              >
                Add Doctor
              </button>
              <button
                className="ml-4 bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition-all"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
