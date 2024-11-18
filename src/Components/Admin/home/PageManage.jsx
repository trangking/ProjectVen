import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function Manage() {
  const [selectedMenu, setSelectedMenu] = useState("pets");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/pageAdmin/PageManage") {
      navigate("/pageAdmin/PageManage/ManageAnimals");
    }
  }, [location, navigate]);

  const handleMenuChange = (menu) => {
    setSelectedMenu(menu);
    if (menu === "pets") {
      navigate("ManageAnimals");
    } else if (menu === "owners") {
      navigate("ManageOwners");
    } else if (menu === "doctors") {
      navigate("ManageDoctorsVets");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12">
      <h1 className="text-4xl font-extrabold text-green-700 mb-8">การจัดการข้อมูล</h1>

      {/* เมนูการเลือก */}
      <div className="flex space-x-6 mb-12">
        <button
          className={`px-8 py-4 rounded-lg font-medium shadow-md transition-all ${
            selectedMenu === "pets"
              ? "bg-green-500 text-white"
              : "bg-white text-green-500 border border-green-500"
          }`}
          onClick={() => handleMenuChange("pets")}
        >
          สัตว์เลี้ยง
        </button>
        <button
          className={`px-8 py-4 rounded-lg font-medium shadow-md transition-all ${
            selectedMenu === "owners"
              ? "bg-yellow-500 text-white"
              : "bg-white text-yellow-500 border border-yellow-500"
          }`}
          onClick={() => handleMenuChange("owners")}
        >
          เจ้าของ
        </button>
        <button
          className={`px-8 py-4 rounded-lg font-medium shadow-md transition-all ${
            selectedMenu === "doctors"
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border border-blue-500"
          }`}
          onClick={() => handleMenuChange("doctors")}
        >
          สัตว์แพทย์
        </button>
      </div>

      <div className="w-full max-w-6xl bg-white p-10 rounded-xl shadow-xl">
        <Outlet />
      </div>
    </div>
  );
}
