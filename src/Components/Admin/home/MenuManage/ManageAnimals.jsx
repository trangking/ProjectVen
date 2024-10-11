import React, { useState, useEffect } from "react";
import { Input, Button, Select, InputNumber } from "antd";
import {
  addPetToFirebase,
  updatePetInFirebase,
  fetchedPets,
  deletePetInFirebase,
} from "../../../../firebase/firebase"; // นำเข้า add และ update function
import useStore from "../../../../store";

const { Option } = Select;

const exoticBreeds = ["Snake", "Lizard", "Tortoise", "Parrot"];

export default function ManageAnimals() {
  const newPet = useStore((state) => state.newPet);
  const setNewPet = useStore((state) => state.setNewPet);
  const resetNewPet = useStore((state) => state.resetNewPet);
  const pets = useStore((state) => state.pets);
  const setPets = useStore((state) => state.setPets);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const openModal = (index = null) => {
    if (index !== null) {
      setEditIndex(index);
      setNewPet(pets[index]); // โหลดข้อมูลสัตว์เลี้ยงที่ต้องการแก้ไข
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetNewPet();
    setEditIndex(null);
  };

  useEffect(() => {
    const loadPets = async () => {
      const fetchedPet = await fetchedPets();
      setPets(fetchedPet);
    };
    loadPets();
  }, [setPets]);

  const handleDeletePet = async (petId) => {
    try {
      console.log("Deleting pet with id:", petId); // ตรวจสอบค่าของ petId
      await deletePetInFirebase(petId); // ลบสัตว์เลี้ยงและ petId ที่เกี่ยวข้องใน owners
      const updatedPets = pets.filter((pet) => pet.id !== petId); // ลบสัตว์เลี้ยงจาก state
      setPets(updatedPets);
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  const breedOptions = () => {
    switch (newPet.type) {
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

  const handleAddOrUpdatePet = async () => {
    if (editIndex !== null) {
      const updatedPets = [...pets];
      const petId = pets[editIndex].id; // ตรวจสอบว่ามีการเก็บ id ของสัตว์เลี้ยงหรือไม่
      updatedPets[editIndex] = newPet;
      setPets(updatedPets);
      await updatePetInFirebase(petId, newPet); // ใช้ id ที่ถูกต้องในการอัปเดต
    } else {
      const petId = await addPetToFirebase(newPet); // เพิ่มสัตว์เลี้ยงใหม่ใน Firebase
      if (petId) {
        setPets([...pets, { ...newPet, id: petId }]); // เก็บ id ที่ได้จาก Firebase
      }
    }
    closeModal();
  };

  return (
    <>
      <div className="w-full p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-green-600">
          จัดการสัตว์เลี้ยง
        </h1>
        <div className="flex justify-end mb-8 w-full max-w-4xl">
          <Button
            type="primary"
            className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            onClick={() => openModal()}
          >
            + เพิ่มสัตว์เลี้ยงใหม่
          </Button>
        </div>
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-green-200 text-green-700">
              <tr>
                <th className="py-4 px-6 font-semibold text-left">ชื่อ</th>
                <th className="py-4 px-6 font-semibold text-left">ประเภท</th>
                <th className="py-4 px-6 font-semibold text-left">สี</th>
                <th className="py-4 px-6 font-semibold text-left">น้ำหนัก</th>
                <th className="py-4 px-6 font-semibold text-left">อายุ</th>
                <th className="py-4 px-6 font-semibold text-left">เพศ</th>
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
                  <td className="py-4 px-6">{pet.color}</td>
                  <td className="py-4 px-6">{pet.weight}</td>
                  <td className="py-4 px-6">
                    {pet.years} ปี {pet.months} เดือน
                  </td>
                  <td className="py-4 px-6">{pet.gender}</td>
                  <td className="py-4 px-6">
                    <button
                      className="text-green-500 hover:text-green-600 mr-4"
                      onClick={() => openModal(index)}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeletePet(pet.id)}
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white w-full max-w-3xl p-8 rounded-lg shadow-2xl relative">
            <h2 className="text-center text-2xl font-bold text-green-600 mb-6">
              {editIndex !== null ? "แก้ไขสัตว์เลี้ยง" : "เพิ่มสัตว์เลี้ยงใหม่"}
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <Input
                  placeholder="ชื่อสัตว์เลี้ยง"
                  value={newPet.name}
                  onChange={(e) =>
                    setNewPet({ ...newPet, name: e.target.value })
                  }
                  className="py-3 px-4 border border-gray-300 rounded-lg w-full"
                />
              </div>
              <div className="col-span-2">
                <Select
                  placeholder="เลือกประเภทสัตว์"
                  value={newPet.type}
                  onChange={(value) => setNewPet({ ...newPet, type: value })}
                  className="w-full "
                >
                  <Option value="Dog">หมา</Option>
                  <Option value="Cat">แมว</Option>
                  <Option value="Exotic">สัตว์เอ็กโซติก</Option>
                </Select>
              </div>
              {newPet.type === "Exotic" && (
                <div className="col-span-2">
                  <Select
                    placeholder={`เลือกพันธุ์${newPet.type}`}
                    value={newPet.subType}
                    onChange={(value) =>
                      setNewPet({ ...newPet, subType: value })
                    }
                    className="w-full "
                  >
                    {breedOptions()}
                  </Select>
                </div>
              )}
              <div className="col-span-1">
                <InputNumber
                  placeholder="อายุ (ปี)"
                  value={newPet.years}
                  min={0}
                  onChange={(value) => setNewPet({ ...newPet, years: value })}
                  className="py-3 px-4 border border-gray-300 rounded-lg w-full"
                />
              </div>
              <div className="col-span-1">
                <InputNumber
                  placeholder="อายุ (เดือน)"
                  value={newPet.months}
                  min={0}
                  max={11}
                  onChange={(value) => setNewPet({ ...newPet, months: value })}
                  className="py-3 px-4 border border-gray-300 rounded-lg w-full"
                />
              </div>
              <div>
                <Input
                  placeholder="สี"
                  value={newPet.color}
                  onChange={(e) =>
                    setNewPet({ ...newPet, color: e.target.value })
                  }
                  className="py-3 px-4 border border-gray-300 rounded-lg w-full"
                />
              </div>
              <div>
                <Input
                  placeholder="น้ำหนัก (กิโลกรัม)"
                  value={newPet.weight}
                  onChange={(e) =>
                    setNewPet({ ...newPet, weight: e.target.value })
                  }
                  className="py-3 px-4 border border-gray-300 rounded-lg w-full"
                />
              </div>
              <div className="col-span-2">
                <Select
                  placeholder="เพศ"
                  value={newPet.gender}
                  onChange={(value) => setNewPet({ ...newPet, gender: value })}
                  className="w-full"
                >
                  <Option value="Male">เพศผู้</Option>
                  <Option value="Female">เพศเมีย</Option>
                </Select>
              </div>
            </div>
            <div className="flex justify-between items-center mt-8">
              <Button onClick={closeModal}>ยกเลิก</Button>
              <Button
                type="primary"
                className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-600"
                onClick={handleAddOrUpdatePet}
              >
                {editIndex !== null ? "อัปเดต" : "เพิ่ม"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
