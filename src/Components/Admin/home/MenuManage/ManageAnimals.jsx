import React, { useState } from "react";
import { Select, Input, Button } from "antd";

const { Option } = Select;

// ข้อมูลพันธุ์ของสัตว์
const dogBreeds = ["Golden Retriever", "Labrador", "Poodle", "Bulldog"];
const catBreeds = ["Siamese", "Persian", "Maine Coon", "Bengal"];
const exoticBreeds = ["Snake", "Lizard", "Tortoise", "Parrot"];

export default function ManageAnimals() {
  const [pets, setPets] = useState([
    { name: "Buddy", type: "Dog", age: 2 },
    { name: "Whiskers", type: "Cat", age: 3 },
  ]);

  const [newPet, setNewPet] = useState({
    name: "",
    type: "",
    subType: "",
    years: "",
    months: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index = null) => {
    if (index !== null) {
      setNewPet(pets[index]);
      setEditIndex(index);
    } else {
      setNewPet({ name: "", type: "", subType: "", years: "", months: "" });
      setEditIndex(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewPet({ name: "", type: "", subType: "", years: "", months: "" });
  };

  const handleAddOrUpdatePet = () => {
    if (!newPet.name || !newPet.type || (!newPet.years && !newPet.months))
      return;

    if (editIndex !== null) {
      const updatedPets = [...pets];
      updatedPets[editIndex] = newPet;
      setPets(updatedPets);
    } else {
      setPets([...pets, newPet]);
    }
    closeModal();
  };

  const handleDeletePet = (index) => {
    const updatedPets = pets.filter((_, i) => i !== index);
    setPets(updatedPets);
  };

  const breedOptions = () => {
    switch (newPet.type) {
      case "Dog":
        return dogBreeds.map((breed) => (
          <Option key={breed} value={breed}>
            {breed}
          </Option>
        ));
      case "Cat":
        return catBreeds.map((breed) => (
          <Option key={breed} value={breed}>
            {breed}
          </Option>
        ));
      case "Exotic":
        return exoticBreeds.map((breed) => (
          <Option key={breed} value={breed}>
            {breed}
          </Option>
        ));
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-green-600">
          จัดการสัตว์เลี้ยง
        </h1>

        {/* ปุ่มเพิ่มสัตว์เลี้ยง */}
        <div className="flex justify-end mb-8 w-full max-w-4xl">
          <Button
            type="primary"
            className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            onClick={() => openModal()}
          >
            + เพิ่มสัตว์เลี้ยงใหม่
          </Button>
        </div>

        {/* ตารางสัตว์เลี้ยง */}
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-green-200 text-green-700">
              <tr>
                <th className="py-4 px-6 font-semibold text-left">ชื่อ</th>
                <th className="py-4 px-6 font-semibold text-left">ประเภท</th>
                <th className="py-4 px-6 font-semibold text-left">อายุ</th>
                <th className="py-4 px-6 font-semibold text-left">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-green-50 transition-colors duration-200"
                >
                  <td className="py-4 px-6">{pet.name}</td>
                  <td className="py-4 px-6">{pet.type}</td>
                  <td className="py-4 px-6">{pet.age} ปี</td>
                  <td className="py-4 px-6">
                    <button
                      className="text-green-500 hover:text-green-600 mr-4"
                      onClick={() => openModal(index)}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeletePet(index)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal สำหรับเพิ่มหรือแก้ไขสัตว์เลี้ยง */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <h2 className="text-center text-2xl font-bold text-green-600 mt-6 mb-6">
              {editIndex !== null ? "แก้ไขสัตว์เลี้ยง" : "เพิ่มสัตว์เลี้ยงใหม่"}
            </h2>

            {/* ฟอร์มสำหรับกรอกข้อมูล */}
            <div className="space-y-4">
              <Input
                placeholder="ชื่อสัตว์เลี้ยง"
                value={newPet.name}
                onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
              />

              {/* Dropdown สำหรับประเภทสัตว์ */}
              <Select
                placeholder="เลือกประเภทสัตว์"
                value={newPet.type}
                onChange={(value) => setNewPet({ ...newPet, type: value })}
                className="w-full"
              >
                <Option value="Dog">หมา</Option>
                <Option value="Cat">แมว</Option>
                <Option value="Exotic">สัตว์เอ็กโซติก</Option>
              </Select>

              {/* Dropdown สำหรับประเภทย่อย */}
              {newPet.type && (
                <Select
                  placeholder={`เลือกพันธุ์${newPet.type}`}
                  value={newPet.subType}
                  onChange={(value) => setNewPet({ ...newPet, subType: value })}
                  className="w-full"
                >
                  {breedOptions()}
                </Select>
              )}

              {/* อายุของสัตว์ */}
              <div className="flex space-x-4">
                <Input
                  type="number"
                  placeholder="ปี"
                  value={newPet.years}
                  onChange={(e) =>
                    setNewPet({ ...newPet, years: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="เดือน"
                  value={newPet.months}
                  onChange={(e) =>
                    setNewPet({ ...newPet, months: e.target.value })
                  }
                />
              </div>
            </div>

            {/* ปุ่มใน Modal */}
            <div className="flex justify-between items-center mt-8">
              <Button onClick={closeModal}>ยกเลิก</Button>
              <Button type="primary" onClick={handleAddOrUpdatePet}>
                {editIndex !== null ? "อัปเดต" : "เพิ่ม"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
