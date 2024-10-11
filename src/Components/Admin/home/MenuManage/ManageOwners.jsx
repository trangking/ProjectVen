import React, { useEffect, useState } from "react";
import useStore from "../../../../store";
import { Select } from "antd";
import {
  fecthOwners,
  fetchedPets,
  AddOwnerToFirebase,
  updateOwnerInFirebase,
  deleteOwnerInFirebase,
} from "../../../../firebase/firebase";

// คอมโพเนนต์สำหรับเพิ่มเจ้าของสัตว์เลี้ยง
function AddOwnerModal({ isOpen, onClose, pets, owners, setOwners }) {
  const [selectedPetIds, setSelectedPetIds] = useState([]);
  const addMember = useStore((state) => state.addMember);
  const setAddMember = useStore((state) => state.setAddMember);
  const addEmailMember = useStore((state) => state.addEmailMember);
  const setEmailMember = useStore((state) => state.setEmailMember);
  const addPhoneMember = useStore((state) => state.addPhoneMember);
  const setPhoneMember = useStore((state) => state.setPhoneMember);
  const addAddressMember = useStore((state) => state.addAddressMember);
  const setAddressMember = useStore((state) => state.setAddressMember);

  const handleAddOwner = async () => {
    if (
      !addMember ||
      !addEmailMember ||
      !addPhoneMember ||
      selectedPetIds.length === 0
    )
      return;

    try {
      await AddOwnerToFirebase(
        addMember,
        addEmailMember,
        addPhoneMember,
        addAddressMember,
        selectedPetIds,
        owners,
        setOwners
      );
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error adding owner:", error);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-10 rounded-lg shadow-2xl relative">
        <button className="absolute top-4 right-4" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-3xl font-bold mb-8 text-green-700 text-center">
          เพิ่มเจ้าของสัตว์เลี้ยง
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              ชื่อเจ้าของ
            </label>
            <input
              type="text"
              placeholder="กรอกชื่อเจ้าของ"
              className="w-full p-4 border border-gray-300 rounded-md"
              value={addMember}
              onChange={(e) => setAddMember(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              อีเมลเจ้าของ
            </label>
            <input
              type="email"
              placeholder="กรอกอีเมลเจ้าของ"
              className="w-full p-4 border border-gray-300 rounded-md"
              value={addEmailMember}
              onChange={(e) => setEmailMember(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              เบอร์โทร
            </label>
            <input
              type="text"
              placeholder="กรอกเบอร์โทร"
              className="w-full p-4 border border-gray-300 rounded-md"
              value={addPhoneMember}
              onChange={(e) => setPhoneMember(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              ที่อยู่
            </label>
            <input
              type="text"
              placeholder="กรอกที่อยู่"
              className="w-full p-4 border border-gray-300 rounded-md"
              value={addAddressMember}
              onChange={(e) => setAddressMember(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-gray-700 font-semibold mb-2">
            เลือกสัตว์เลี้ยง
          </label>
          <Select
            mode="multiple"
            placeholder="กรุณาเลือกสัตว์เลี้ยง"
            className="w-full"
            value={selectedPetIds}
            onChange={(value) => setSelectedPetIds(value)}
          >
            {pets.map((pet) => (
              <Select.Option key={pet.id} value={pet.id}>
                {pet.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            className="bg-green-500 text-white py-2 px-8 rounded-md"
            onClick={handleAddOwner}
          >
            เพิ่มเจ้าของ
          </button>
          <button
            className="bg-red-500 text-white py-2 px-8 rounded-md"
            onClick={onClose}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

// คอมโพเนนต์สำหรับแก้ไขเจ้าของสัตว์เลี้ยง
function EditOwnerModal({
  isOpen,
  onClose,
  owners,
  pets,
  editIndex,
  setOwners,
}) {
  const [selectedPetIds, setSelectedPetIds] = useState([]);
  const addMember = useStore((state) => state.addMember);
  const setAddMember = useStore((state) => state.setAddMember);
  const addEmailMember = useStore((state) => state.addEmailMember);
  const setEmailMember = useStore((state) => state.setEmailMember);
  const addPhoneMember = useStore((state) => state.addPhoneMember);
  const setPhoneMember = useStore((state) => state.setPhoneMember);
  const addAddressMember = useStore((state) => state.addAddressMember);
  const setAddressMember = useStore((state) => state.setAddressMember);
  const [petToAdd, setPetToAdd] = useState(""); // เก็บสัตว์เลี้ยงที่จะเพิ่ม

  useEffect(() => {
    if (editIndex !== null) {
      const selectedOwner = owners[editIndex];
      setAddMember(selectedOwner.name);
      setEmailMember(selectedOwner.contact);
      setPhoneMember(selectedOwner.phone || "");
      setAddressMember(selectedOwner.address || "");
      setSelectedPetIds(selectedOwner.petIds || []);
    }
  }, [editIndex]);

  const handleUpdateOwner = async () => {
    if (!addMember || !addEmailMember || !addPhoneMember) return;

    try {
      const ownerId = owners[editIndex].id;
      const previousPetIds = owners[editIndex].petIds || [];

      const updatedOwnerData = {
        name: addMember,
        contact: addEmailMember,
        phone: addPhoneMember,
        address: addAddressMember,
        petIds: selectedPetIds,
      };

      await updateOwnerInFirebase(
        ownerId,
        updatedOwnerData,
        previousPetIds,
        selectedPetIds
      );

      const updatedOwners = [...owners];
      updatedOwners[editIndex] = { ...updatedOwnerData, id: ownerId };
      setOwners(updatedOwners);
      onClose();
    } catch (error) {
      console.error("Error updating owner:", error);
    }
  };

  const handleAddPet = () => {
    if (petToAdd && !selectedPetIds.includes(petToAdd)) {
      setSelectedPetIds([...selectedPetIds, petToAdd]); // เพิ่มสัตว์เลี้ยง
    }
    setPetToAdd(""); // รีเซ็ตการเลือกหลังเพิ่ม
  };

  // ฟังก์ชันลบสัตว์เลี้ยง
  const handleRemovePet = (id) => {
    setSelectedPetIds(selectedPetIds.filter((petId) => petId !== id));
  };
  return isOpen ? (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-10 rounded-lg shadow-2xl relative">
        <button className="absolute top-4 right-4" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-3xl font-bold mb-8 text-green-700 text-center">
          แก้ไขเจ้าของสัตว์เลี้ยง
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              ชื่อเจ้าของ
            </label>
            <input
              type="text"
              placeholder="กรอกชื่อเจ้าของ"
              className="w-full p-4 border border-gray-300 rounded-md"
              value={addMember}
              onChange={(e) => setAddMember(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              อีเมลเจ้าของ
            </label>
            <input
              type="email"
              placeholder="กรอกอีเมลเจ้าของ"
              className="w-full p-4 border border-gray-300 rounded-md"
              value={addEmailMember}
              onChange={(e) => setEmailMember(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              เบอร์โทร
            </label>
            <input
              type="text"
              placeholder="กรอกเบอร์โทร"
              className="w-full p-4 border border-gray-300 rounded-md"
              value={addPhoneMember}
              onChange={(e) => setPhoneMember(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              ที่อยู่
            </label>
            <input
              type="text"
              placeholder="กรอกที่อยู่"
              className="w-full p-4 border border-gray-300 rounded-md"
              value={addAddressMember}
              onChange={(e) => setAddressMember(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div className="mt-5 flex flex-col">
            <div className="flex flex-row justify-between items-center">
              <h3 className="text-lg font-semibold mb-2">เลือกสัตว์เลี้ยง</h3>
              <Select
                placeholder="กรุณาเลือกสัตว์เลี้ยง"
                className="w-1/2"
                value={petToAdd}
                onChange={(value) => setPetToAdd(value)} // เลือกสัตว์เลี้ยงทีละตัว
                options={pets.map((pet) => ({
                  label: pet.name, // แสดงชื่อสัตว์เลี้ยง
                  value: pet.id, // ใช้ id ของสัตว์เลี้ยงเป็นค่า
                }))}
              />
              <button
                className="bg-green-500 text-white py-2 px-4 ml-2 rounded-md"
                onClick={handleAddPet}
              >
                เพิ่ม
              </button>
            </div>
          </div>

          {/* ตารางแสดงสัตว์เลี้ยงที่เลือกไว้ */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">
              สัตว์เลี้ยงที่เลือกไว้:
            </h3>
            <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="py-4 px-6 font-semibold text-left">
                    ชื่อสัตว์เลี้ยง
                  </th>
                  <th className="py-4 px-6 font-semibold text-left">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedPetIds.map((id) => {
                  const pet = pets.find((p) => p.id === id);
                  return (
                    <tr
                      key={id}
                      className="border-b hover:bg-green-50 transition-colors"
                    >
                      <td className="py-4 px-6">{pet ? pet.name : id}</td>
                      <td className="py-4 px-6">
                        <button
                          className="text-red-500 hover:text-red-600 font-medium"
                          onClick={() => handleRemovePet(id)}
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            className="bg-green-500 text-white py-2 px-8 rounded-md"
            onClick={handleUpdateOwner}
          >
            แก้ไขเจ้าของ
          </button>
          <button
            className="bg-red-500 text-white py-2 px-8 rounded-md"
            onClick={onClose}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

export default function ManageOwners() {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);

  const handleDeleteOwner = async (index) => {
    const ownerId = owners[index].id;
    const ownerAuthId = owners[index].authId; // เก็บค่า authId (uid) ของเจ้าของ
    await deleteOwnerInFirebase(ownerId, ownerAuthId);
    const updatedOwners = owners.filter((_, i) => i !== index);
    setOwners(updatedOwners);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedOwners = await fecthOwners();
      const fetchedPet = await fetchedPets();
      setOwners(fetchedOwners);
      setPets(fetchedPet);
    };
    fetchData();
  }, []);

  const openEditModal = (index) => {
    setEditIndex(index);
    setEditModalOpen(true);
  };

  return (
    <>
      <div className="w-full h-screen p-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-center mb-10 text-green-800">
          จัดการเจ้าของสัตว์เลี้ยง
        </h1>

        <div className="flex justify-end mb-8 w-full max-w-3xl">
          <button
            className="bg-green-500 text-white py-2 px-6 rounded-lg"
            onClick={() => setAddModalOpen(true)}
          >
            + เพิ่มเจ้าของใหม่
          </button>
        </div>

        {/* Owners table */}
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="py-4 px-6 font-semibold text-left">ชื่อ</th>
                <th className="py-4 px-6 font-semibold text-left">อีเมลล์</th>
                <th className="py-4 px-6 font-semibold text-left">เบอร์โทร</th>
                <th className="py-4 px-6 font-semibold text-left">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner, index) => (
                <tr key={index} className="border-b hover:bg-green-50">
                  <td className="py-4 px-6">{owner.name}</td>
                  <td className="py-4 px-6">{owner.contact}</td>
                  <td className="py-4 px-6">{owner.phone}</td>
                  <td className="py-4 px-6 flex gap-4">
                    <button
                      className="text-blue-500 hover:text-blue-600"
                      onClick={() => openEditModal(index)}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteOwner(index)}
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

      {/* Add Owner Modal */}
      <AddOwnerModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        pets={pets}
        owners={owners}
        setOwners={setOwners}
      />

      {/* Edit Owner Modal */}
      <EditOwnerModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        owners={owners}
        pets={pets}
        editIndex={editIndex}
        setOwners={setOwners}
      />
    </>
  );
}
