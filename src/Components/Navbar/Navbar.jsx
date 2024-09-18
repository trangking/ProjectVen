import React, { useState } from "react";
import { BellIcon } from "@heroicons/react/outline";

// ข้อมูลการแจ้งเตือนตัวอย่าง
const notifications = [
  {
    id: 1,
    title: "นัดหมายปรึกษาแพทย์",
    date: "2024-09-18",
    description: "คุณมีนัดหมายกับแพทย์เวลา 10:00 น.",
  },
  {
    id: 2,
    title: "นัดหมายฉีดวัคซีน",
    date: "2024-09-20",
    description: "คุณมีนัดหมายฉีดวัคซีนในวันที่ 20 กันยายน 2567",
  },
  {
    id: 3,
    title: "การแจ้งเตือนรับยา",
    date: "2024-09-22",
    description: "รับยาต่อเนื่องจากคลินิกภายในวันที่ 22 กันยายน 2567",
  },
];

// Navbar Component
export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false); // ควบคุมการเปิด/ปิดเมนูแจ้งเตือน

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications); // เปิด/ปิดการแสดงผลแจ้งเตือน
  };

  return (
    <nav className="bg-white p-4 shadow-sm relative">
      <div className="mx-7 flex justify-between items-center">
        {/* Logo or Application Name */}
        <div className="text-xl font-semibold text-gray-800">
          <h1>Maejo App</h1>
        </div>

        {/* Notification Icon */}
        <div className="relative">
          <BellIcon
            className="h-6 w-6 text-gray-800 cursor-pointer hover:text-green-500 transition duration-300"
            onClick={handleToggleNotifications} // เพิ่มฟังก์ชันคลิกที่ไอคอน
          />
          {/* แสดงจำนวนแจ้งเตือน */}
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>

          {/* เมนูแจ้งเตือน */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
              <h3 className="text-lg font-bold mb-2">การแจ้งเตือน</h3>
              <ul>
                {notifications.map((notification) => (
                  <li key={notification.id} className="mb-2">
                    <div className="font-semibold text-gray-700">
                      {notification.title}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {notification.date}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {notification.description}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
