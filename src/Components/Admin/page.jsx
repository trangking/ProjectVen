import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  CalendarIcon,
  UserGroupIcon,
  CogIcon,
  BellIcon,
  MenuIcon,
} from "@heroicons/react/outline";
import { Outlet } from "react-router-dom";
import { FaMedkit, FaSignOutAlt } from "react-icons/fa";
// ลิงก์ของ Sidebar
const sidebarLinks = [
  {
    name: "การนัดหมาย",
    path: "Dashboard",
    icon: <CalendarIcon className="h-6 w-6" />,
  },
  {
    name: "จัดการข้อมูล",
    path: "PageManage",
    icon: <UserGroupIcon className="h-6 w-6" />,
  },
  {
    name: "วัคซีน",
    path: "DrugManage",
    icon: <FaMedkit className="h-6 w-6" />,
  },
  {
    name: "ออกจากระบบ",
    path: "/",
    icon: <FaSignOutAlt className="h-6 w-6" />,
  },
];

export default function Page() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/pageAdmin") {
      navigate("/pageAdmin/Dashboard");
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* แถบด้านบน */}
      <header className="bg-white shadow-md p-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* ปุ่มเมนูสำหรับหน้าจอมือถือ */}
          <button
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MenuIcon className="h-6 w-6 text-gray-800" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            แผงควบคุมผู้ดูแล
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <img
            src="https://i.etsystatic.com/12346156/r/il/4ada00/4392713417/il_570xN.4392713417_z7v3.jpg"
            alt="โปรไฟล์"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </header>

      {/* ส่วนเนื้อหาหลัก */}
      <div className="flex flex-1">
        {/* แถบด้านข้าง */}
        <aside
          className={`fixed inset-y-0 left-0 bg-white shadow-md w-64 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
        >
          <div className="p-6 text-center block sm:hidden">
            <h2 className="text-2xl font-bold text-gray-800">
              แผงควบคุมผู้ดูแล
            </h2>
          </div>
          <nav className="mt-6">
            <ul>
              {sidebarLinks.map((link) => (
                <li key={link.name} className="mb-4">
                  <Link
                    to={link.path}
                    className="flex items-center px-6 py-2 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition duration-300"
                  >
                    {link.icon}
                    <span className="ml-3">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* การแสดง Sidebar สำหรับหน้าจอมือถือ */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* เนื้อหาหลัก */}
        <div className="flex-1 p-6 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
