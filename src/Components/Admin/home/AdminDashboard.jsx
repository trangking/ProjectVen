import React, { useState } from "react";

// ข้อมูลการนัดหมายตัวอย่าง
const appointments = [
  {
    id: 1,
    petName: "Buddy",
    owner: "John Doe",
    date: "2024-09-18",
    time: "10:00 AM",
    status: "Upcoming",
  },
  {
    id: 2,
    petName: "Mittens",
    owner: "Jane Smith",
    date: "2024-09-19",
    time: "2:00 PM",
    status: "Upcoming",
  },
  {
    id: 3,
    petName: "Goldie",
    owner: "Chris Evans",
    date: "2024-09-20",
    time: "1:00 PM",
    status: "Completed",
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
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Appointments
          </h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">12</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Upcoming Appointments
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">8</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Completed Appointments
          </h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">4</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Cancelled Appointments
          </h3>
          <p className="mt-2 text-3xl font-bold text-red-600">0</p>
        </div>
      </div>

      {/* Section 2: ตารางการนัดหมายล่าสุด */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Appointments
        </h2>

        {/* ช่องค้นหา */}
        <input
          type="text"
          placeholder="Search by pet name or owner"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border rounded-lg w-full max-w-md"
        />

        <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Pet Name</th>
                <th className="px-4 py-2 text-left">Owner</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-t">
                    <td className="px-4 py-2">{appointment.petName}</td>
                    <td className="px-4 py-2">{appointment.owner}</td>
                    <td className="px-4 py-2">{appointment.date}</td>
                    <td className="px-4 py-2">{appointment.time}</td>
                    <td
                      className={`px-4 py-2 ${
                        appointment.status === "Upcoming"
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
                    No appointments found.
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
