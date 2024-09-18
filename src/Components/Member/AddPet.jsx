import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPet() {
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petImage, setPetImage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("สัตว์เลี้ยงของคุณถูกเพิ่มแล้ว!");
    navigate("/member");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          เพิ่มสัตว์เลี้ยงใหม่
        </h2>

        <form onSubmit={handleSubmit}>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="กรอกชื่อสัตว์เลี้ยง"
              required
            />
          </div>

          {/* ประเภทของสัตว์เลี้ยง */}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            >
              <option value="">เลือกประเภทของสัตว์เลี้ยง</option>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="กรอกอายุสัตว์เลี้ยง"
              required
            />
          </div>

          {/* รูปภาพสัตว์เลี้ยง */}
          <div className="mb-6">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="petImage"
            >
              รูปภาพสัตว์เลี้ยง (URL)
            </label>
            <input
              type="text"
              id="petImage"
              value={petImage}
              onChange={(e) => setPetImage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="กรอก URL ของรูปภาพสัตว์เลี้ยง"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            เพิ่มสัตว์เลี้ยง
          </button>
        </form>
      </div>
    </div>
  );
}
