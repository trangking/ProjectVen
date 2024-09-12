import React from "react";
import { BellIcon } from "@heroicons/react/outline"; // นำเข้าไอคอนหลังจากติดตั้ง

// Navbar Component
export default function Navbar() {
  return (
    <nav className="bg-white p-4 shadow-sm">
      <div className="mx-7 flex justify-between items-center">
        {/* Logo or Application Name */}
        <div className="text-xl font-semibold text-gray-800">
          <h1>Maejo App</h1>
        </div>

        {/* Notification Icon */}
        <div className="relative">
          <BellIcon className="h-6 w-6 text-gray-800 cursor-pointer hover:text-green-500 transition duration-300" />
          {/* แสดงจำนวนแจ้งเตือน */}
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </div>
      </div>
    </nav>
  );
}
