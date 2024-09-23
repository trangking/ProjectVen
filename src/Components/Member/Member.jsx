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

const petVaccineData = [
  {
    disease: "Kennal Cough Syndrome",
    batchNo: "/path/to/sticker1.png", // URL ของรูปสติกเกอร์
    dateOfVaccination: "28/06/59",
    nextVaccination: "28/06/60",
    stickerImage: "/path/to/sticker1.png", // URL รูปใบวัคซีน
  },
  {
    disease: "Canine Parvovirus",
    batchNo: "/path/to/sticker2.png",
    dateOfVaccination: "23/03/60",
    nextVaccination: "23/03/61",
    stickerImage: "/path/to/sticker2.png",
  },
  {
    disease: "Canine Distemper, Infectious Hepatitis, Parvovirus",
    batchNo: "/path/to/sticker3.png",
    dateOfVaccination: "21/03/60",
    nextVaccination: "21/03/61",
    stickerImage: "/path/to/sticker3.png",
  },
  // เพิ่มข้อมูลอื่นๆ ตามต้องการ
];

// การ์ดแสดงข้อมูลสัตว์เลี้ยง
export default function PetCards() {
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

      {/* ตารางแสดงรายการสัตว์เลี้ยง */}
      <table className="min-w-full table-auto bg-gray-100 rounded-lg">
        <thead>
          <tr className="bg-gray-300">
            <th className="px-4 py-2 text-left">ชื่อสัตว์เลี้ยง</th>
            <th className="px-4 py-2 text-left">ประเภท</th>
            <th className="px-4 py-2 text-left">อายุ</th>
            <th className="px-4 py-2 text-left">การนัดฉีดวัคซีนครั้งถัดไป</th>
            <th className="px-4 py-2 text-left">ดูประวัติ</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr key={pet.id} className="border-t">
              <td className="px-4 py-2">{pet.name}</td>
              <td className="px-4 py-2">{pet.type}</td>
              <td className="px-4 py-2">{pet.age} ปี</td>
              <td className="px-4 py-2">
                {pet.nextVaccine !== "None"
                  ? `วันที่: ${pet.nextVaccine}`
                  : "ไม่มีการนัดครั้งถัดไป"}
              </td>
              <td className="px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  onClick={() => handleViewHistory(pet)}
                >
                  ดูประวัติ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
          <div className="bg-white p-6 rounded-lg max-w-5xl w-full">
            <h2 className="text-2xl font-bold mb-4">
              Vaccination Record for {selectedPet.name}
            </h2>

            {/* ตารางแสดงข้อมูลการฉีดวัคซีน */}
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
                    <th className="px-4 py-2 border border-pink-300">
                      Sticker
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {petVaccineData.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border border-pink-300">
                        {entry.disease}
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        <img
                          src={entry.batchNo}
                          alt={`Batch No. ${index + 1}`}
                          className="w-12 h-12 object-contain"
                        />
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        {entry.dateOfVaccination}
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        {entry.nextVaccination}
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        <img
                          src={entry.stickerImage}
                          alt={`Sticker for ${entry.disease}`}
                          className="w-12 h-12 object-contain"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ตารางนัดครั้งถัดไป */}
            <div className="mt-6 bg-pink-100 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Appointment (นัดครั้งถัดไป)
              </h3>
              <table className="min-w-full table-auto border-collapse border border-pink-200">
                <thead>
                  <tr className="bg-pink-200">
                    <th className="px-4 py-2 border border-pink-300">Date</th>
                    <th className="px-4 py-2 border border-pink-300">
                      Next Appointment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {petVaccineData.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border border-pink-300">
                        {entry.dateOfVaccination}
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        {entry.nextVaccination}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
