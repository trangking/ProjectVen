import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditPet() {
  // กำหนดค่าเริ่มต้นของสัตว์เลี้ยง
  const [petName, setPetName] = useState("Buddy");
  const [petType, setPetType] = useState("Dog");
  const [petAge, setPetAge] = useState(5);
  const [petImage, setPetImage] = useState("/image/pet.jpg");
  const navigate = useNavigate();

  const handleSaveChanges = (e) => {
    e.preventDefault();
    alert("บันทึกการแก้ไขสำเร็จ!");
    navigate("/member");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 to-blue-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          แก้ไขข้อมูลสัตว์เลี้ยง
        </h2>

        <form onSubmit={handleSaveChanges}>
          {/* รูปสัตว์เลี้ยง */}
          <div className="mb-6 text-center">
            <img
              src={petImage}
              alt={petName}
              className="w-32 h-32 object-cover rounded-full mx-auto shadow-md mb-4"
            />
            <label className="block text-sm text-gray-500">
              เปลี่ยนรูปภาพ (URL)
            </label>
            <input
              type="text"
              value={petImage}
              onChange={(e) => setPetImage(e.target.value)}
              className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="กรอก URL ของรูปภาพ"
            />
          </div>

          {/* ชื่อสัตว์เลี้ยง */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="petName"
            >
              ชื่อสัตว์เลี้ยง
            </label>
            <input
              type="text"
              id="petName"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="กรอกชื่อสัตว์เลี้ยง"
              required
            />
          </div>

          {/* ประเภทสัตว์เลี้ยง */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="petType"
            >
              ประเภทของสัตว์เลี้ยง
            </label>
            <select
              id="petType"
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="Dog">สุนัข</option>
              <option value="Cat">แมว</option>
              <option value="Bird">นก</option>
              <option value="Fish">ปลา</option>
            </select>
          </div>

          {/* อายุของสัตว์เลี้ยง */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="petAge"
            >
              อายุของสัตว์เลี้ยง (ปี)
            </label>
            <input
              type="number"
              id="petAge"
              value={petAge}
              onChange={(e) => setPetAge(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="กรอกอายุสัตว์เลี้ยง"
              required
            />
          </div>

          {/* ปุ่มบันทึก */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            บันทึกการแก้ไข
          </button>
        </form>
      </div>
    </div>
  );
}
