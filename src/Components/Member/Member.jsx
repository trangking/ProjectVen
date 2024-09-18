import React, { useState } from "react";
import { Link } from "react-router-dom";

// ข้อมูลตัวอย่างของสัตว์เลี้ยง
const pets = [
  {
    id: 1,
    name: "Buddy",
    type: "Dog",
    age: 5,
    history: [
      { date: "2023-01-15", vaccine: "Rabies", status: "Completed" },
      { date: "2022-07-10", vaccine: "Parvovirus", status: "Completed" },
    ],
    nextVaccine: "2024-01-15", // เพิ่มการนัดครั้งถัดไป
    imgSrc: "",
  },
  {
    id: 2,
    name: "Mittens",
    type: "Cat",
    age: 3,
    history: [
      { date: "2023-03-05", vaccine: "Feline Leukemia", status: "Completed" },
      { date: "2022-10-22", vaccine: "FVRCP", status: "Completed" },
    ],
    nextVaccine: "2024-03-05", // เพิ่มการนัดครั้งถัดไป
    imgSrc: "",
  },
  {
    id: 3,
    name: "Goldie",
    type: "Fish",
    age: 1,
    history: [{ date: "2022-09-01", vaccine: "None", status: "N/A" }],
    nextVaccine: "None", // ไม่มีการนัดครั้งถัดไป
    imgSrc: "",
  },
  {
    id: 4,
    name: "Chirpy",
    type: "Bird",
    age: 2,
    history: [
      { date: "2023-02-20", vaccine: "Avian Flu", status: "Completed" },
      { date: "2022-08-13", vaccine: "Newcastle Disease", status: "Completed" },
    ],
    nextVaccine: "2024-02-20", // เพิ่มการนัดครั้งถัดไป
    imgSrc: "",
  },
];

// การ์ดแสดงข้อมูลสัตว์เลี้ยง
export default function PetCards() {
  const defaultImg = "/image/default.png"; // รูปภาพ default ที่ใช้เมื่อไม่มีรูปสัตว์เลี้ยง
  const [selectedPet, setSelectedPet] = useState(null); // เก็บข้อมูลสัตว์เลี้ยงที่เลือก
  const [showModal, setShowModal] = useState(false); // ควบคุมการเปิดปิด modal
  const [showMenuModal, setShowMenuModal] = useState(false); // ควบคุม modal ของเมนูเพิ่ม/แก้ไข

  const handleViewHistory = (pet) => {
    setSelectedPet(pet); // กำหนดสัตว์เลี้ยงที่ถูกเลือก
    setShowModal(true); // เปิด modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // ปิด modal
    setSelectedPet(null); // ล้างข้อมูลสัตว์เลี้ยงที่เลือก
  };

  const handleOpenMenuModal = () => {
    setShowMenuModal(true); // เปิด modal ของเมนูเพิ่ม/แก้ไข
  };

  const handleCloseMenuModal = () => {
    setShowMenuModal(false); // ปิด modal ของเมนูเพิ่ม/แก้ไข
  };

  return (
    <div className="container mx-auto mt-8">
      {/* หัวข้อของหน้า */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">รายการสัตว์เลี้ยง</h2>
        <div>
          <button
            onClick={handleOpenMenuModal}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300 mr-4"
          >
            เพิ่ม/แก้ไขสัตว์เลี้ยง +
          </button>
          <Link to="/login">
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300">
              ออกจากระบบ
            </button>
          </Link>
        </div>
      </div>

      {/* การ์ดสัตว์เลี้ยง */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {pets.map((pet) => (
          <button key={pet.id} onClick={() => handleViewHistory(pet)}>
            <div
              className="bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${pet.imgSrc ? pet.imgSrc : defaultImg})`,
                backgroundSize: "60% 90%",
                backgroundPosition: "center",
                height: "250px", // ความสูงของการ์ด
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="bg-black bg-opacity-50 p-6 h-full flex flex-col justify-end">
                <h3 className="text-2xl font-semibold mb-2">{pet.name}</h3>
                <p className="text-gray-300">ประเภท: {pet.type}</p>
                <p className="text-gray-300">อายุ: {pet.age} ปี</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal เมนูเพิ่ม/แก้ไขสัตว์เลี้ยง */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
              Menu
            </h2>
            <div className="flex flex-col gap-4">
              <Link to="/addpet">
                <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 w-full">
                  เพิ่มสัตว์เลี้ยง
                </button>
              </Link>
              <Link to="/editpet">
                <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 w-full">
                  แก้ไขสัตว์เลี้ยง
                </button>
              </Link>
            </div>
            <button
              onClick={handleCloseMenuModal}
              className="bg-gray-200 text-gray-700 px-4 py-3 rounded-full mt-6 w-full hover:bg-gray-300 transition-transform transform hover:scale-105"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* Modal แสดงประวัติสัตว์เลี้ยงในรูปแบบตาราง */}
      {showModal && selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">
              {selectedPet.name}'s History
            </h2>
            <p className="mb-2">ประเภท: {selectedPet.type}</p>
            <p className="mb-2">อายุ: {selectedPet.age} ปี</p>

            {/* ตารางแสดงประวัติการฉีดวัคซีน */}
            <table className="min-w-full table-auto bg-gray-100 rounded-lg">
              <thead>
                <tr className="bg-gray-300">
                  <th className="px-4 py-2 text-left">วันที่</th>
                  <th className="px-4 py-2 text-left">วัคซีน</th>
                  <th className="px-4 py-2 text-left">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {selectedPet.history.map((entry, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{entry.date}</td>
                    <td className="px-4 py-2">{entry.vaccine}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          entry.status === "Completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* เพิ่มการนัดฉีดวัคซีนครั้งถัดไป */}
            <div className="mt-6">
              <h3 className="text-xl font-bold">การนัดฉีดวัคซีนครั้งถัดไป</h3>
              <p className="text-gray-600">
                {selectedPet.nextVaccine !== "None"
                  ? `วันที่: ${selectedPet.nextVaccine}`
                  : "ไม่มีการนัดครั้งถัดไป"}
              </p>
            </div>

            <button
              onClick={handleCloseModal}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
