import React, { useState } from "react";

// ข้อมูลการนัดหมายตัวอย่าง
const appointments = [
  {
    id: 1,
    petName: "บัดดี้",
    owner: "จอห์น โด",
    date: "2024-09-18",
    time: "10:00 น.",
    status: "มาตามนัด",
  },
  {
    id: 2,
    petName: "มิทเทนส์",
    owner: "เจน สมิธ",
    date: "2024-09-19",
    time: "14:00 น.",
    status: "มาตามนัด",
  },
  {
    id: 3,
    petName: "โกลดี้",
    owner: "คริส อีแวนส์",
    date: "2024-09-20",
    time: "13:00 น.",
    status: "กำลังมา",
  },
];

// ฟังก์ชันจัดเรียงตามวันที่
const sortAppointmentsByDate = (appointments) => {
  return appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// หน้าจัดการ Admin Dashboard
export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  // ฟิลเตอร์การนัดหมายตามคำค้นหา
  const filteredAppointments = sortAppointmentsByDate(
    appointments.filter(
      (appointment) =>
        appointment.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.owner.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      {/* Section 1: ข้อมูลสถิติ */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow-md rounded-md p-4 text-center">
          <h3 className="text-sm font-semibold text-gray-700">
            การนัดหมายทั้งหมด
          </h3>
          <p className="mt-2 text-xl font-bold text-blue-600">12</p>
        </div>

        <div className="bg-white shadow-md rounded-md p-4 text-center">
          <h3 className="text-sm font-semibold text-gray-700">
            การนัดหมายที่จะมาถึง
          </h3>
          <p className="mt-2 text-xl font-bold text-green-600">8</p>
        </div>

        <div className="bg-white shadow-md rounded-md p-4 text-center">
          <h3 className="text-sm font-semibold text-gray-700">
            การนัดหมายที่เสร็จสิ้น
          </h3>
          <p className="mt-2 text-xl font-bold text-purple-600">4</p>
        </div>

        <div className="bg-white shadow-md rounded-md p-4 text-center">
          <h3 className="text-sm font-semibold text-gray-700">
            การนัดหมายที่ถูกยกเลิก
          </h3>
          <p className="mt-2 text-xl font-bold text-red-600">0</p>
        </div>
      </div>

      {/* Section 2: ตารางการนัดหมายล่าสุด */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            การนัดหมายล่าสุด
          </h2>

          {/* ปุ่มสำหรับเพิ่มการนัดหมาย */}
          <button
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-600 transition-transform transform hover:scale-105"
            onClick={() => alert("เพิ่มการนัดหมายใหม่")}
          >
            + เพิ่มการนัดหมาย
          </button>
        </div>

        {/* ช่องค้นหา */}
        <input
          type="text"
          placeholder="ค้นหาชื่อสัตว์เลี้ยงหรือเจ้าของ"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border rounded-md w-full max-w-sm"
        />

        <div className="bg-white shadow-md rounded-md p-4 overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1 text-left">ชื่อสัตว์เลี้ยง</th>
                <th className="px-2 py-1 text-left">เจ้าของ</th>
                <th className="px-2 py-1 text-left">วันที่</th>
                <th className="px-2 py-1 text-left">เวลา</th>
                <th className="px-2 py-1 text-left">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-t">
                    <td className="px-2 py-1">{appointment.petName}</td>
                    <td className="px-2 py-1">{appointment.owner}</td>
                    <td className="px-2 py-1">{appointment.date}</td>
                    <td className="px-2 py-1">{appointment.time}</td>
                    <td
                      className={`px-2 py-1 ${
                        appointment.status === "มาตามนัด"
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {appointment.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    ไม่พบการนัดหมาย
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
