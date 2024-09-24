import React, { useState } from "react";

export default function ManageAnimals() {
  const [pets, setPets] = useState([
    { name: "Buddy", type: "Dog", age: 2 },
    { name: "Whiskers", type: "Cat", age: 3 },
  ]);
  const [newPet, setNewPet] = useState({ name: "", type: "", age: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index = null) => {
    if (index !== null) {
      setNewPet(pets[index]);
      setEditIndex(index);
    } else {
      setNewPet({ name: "", type: "", age: "" });
      setEditIndex(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewPet({ name: "", type: "", age: "" });
  };

  const handleAddOrUpdatePet = () => {
    if (!newPet.name || !newPet.type || !newPet.age) return;

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

  return (
    <>
      <div className="w-full p-10 flex flex-col items-center ">
        <h1 className="text-3xl font-bold mb-8 text-green-600">จัดการสัตว์เลี้ยง</h1>

        {/* ปุ่มเพิ่มสัตว์เลี้ยง */}
        <div className="flex justify-end mb-8 w-full max-w-4xl">
          <button
            className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            onClick={() => openModal()}
          >
            + เพิ่มสัตว์เลี้ยงใหม่
          </button>
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
                  <td className="py-4 px-6">{pet.age}</td>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">
              {editIndex !== null ? "แก้ไขสัตว์เลี้ยง" : "เพิ่มสัตว์เลี้ยงใหม่"}
            </h2>
            <input
              type="text"
              placeholder="ชื่อสัตว์เลี้ยง"
              className="w-full p-3 mb-4 border rounded-lg"
              value={newPet.name}
              onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="ประเภท"
              className="w-full p-3 mb-4 border rounded-lg"
              value={newPet.type}
              onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
            />
            <input
              type="number"
              placeholder="อายุ"
              className="w-full p-3 mb-4 border rounded-lg"
              value={newPet.age}
              onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2"
                onClick={closeModal}
              >
                ยกเลิก
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                onClick={handleAddOrUpdatePet}
              >
                {editIndex !== null ? "อัปเดต" : "เพิ่ม"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
