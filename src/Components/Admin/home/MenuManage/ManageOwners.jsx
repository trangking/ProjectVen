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

export default function ManageOwners() {
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null); // Store selected pet ID

  const addMember = useStore((state) => state.addMember);
  const setAddMember = useStore((state) => state.setAddMember);

  const addEmailMember = useStore((state) => state.addEmailMember);
  const setEmailMember = useStore((state) => state.setEmailMember);

  const addPhoneMember = useStore((state) => state.addPhoneMember);
  const setPhoneMember = useStore((state) => state.setPhoneMember);

  const addAddressMember = useStore((state) => state.addAddressMember);
  const setAddressMember = useStore((state) => state.setAddressMember);

  const owners = useStore((state) => state.Owners);
  const setOwners = useStore((state) => state.setOwners);

  const pets = useStore((state) => state.pets);
  const setPets = useStore((state) => state.setPets);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedOwners = await fecthOwners();
        const fetchedPet = await fetchedPets();
        setOwners(fetchedOwners);
        setPets(fetchedPet);
      } catch (error) {
        console.error("Error fetching owners: ", error);
      }
    };

    fetchData();
  }, []);

  const { Option } = Select;

  const openModal = (index = null) => {
    if (index !== null) {
      const selectedOwner = owners[index];
      setAddMember(selectedOwner.name);
      setEmailMember(selectedOwner.contact);
      setPhoneMember(selectedOwner.phone || "");
      setAddressMember(selectedOwner.address || "");
      setSelectedPetId(selectedOwner.petId || null); // Set selected pet ID
      setEditIndex(index);
    } else {
      // Reset values for adding new owner
      setAddMember("");
      setEmailMember("");
      setPhoneMember("");
      setAddressMember("");
      setSelectedPetId(null);
      setEditIndex(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAddMember("");
    setEmailMember("");
    setPhoneMember("");
    setAddressMember("");
    setSelectedPetId(null); // Reset pet selection
  };

  // Handle adding a new owner
  const handleAddOwner = async () => {
    if (!addMember || !addEmailMember || !addPhoneMember || !selectedPetId)
      return;

    try {
      await AddOwnerToFirebase(
        addMember,
        addEmailMember,
        addPhoneMember,
        addAddressMember,
        selectedPetId,
        owners,
        setOwners
      );
      closeModal();
    } catch (error) {
      console.error("Error adding owner:", error);
    }
  };

  // Handle updating an existing owner
  const handleUpdateOwner = async () => {
    if (!addMember || !addEmailMember || !addPhoneMember || !selectedPetId)
      return;

    try {
      const ownerId = owners[editIndex].id;
      const previousPetId = owners[editIndex].petId; // เก็บค่า petId ก่อนหน้า

      const updatedOwnerData = {
        name: addMember,
        contact: addEmailMember,
        phone: addPhoneMember,
        address: addAddressMember,
        petId: selectedPetId,
      };

      await updateOwnerInFirebase(
        ownerId,
        updatedOwnerData,
        previousPetId, // petId ก่อนหน้า
        selectedPetId // petId ใหม่
      );

      const updatedOwners = [...owners];
      updatedOwners[editIndex] = { ...updatedOwnerData, id: ownerId };
      setOwners(updatedOwners);
      closeModal();
    } catch (error) {
      console.error("Error updating owner:", error);
    }
  };

  const handleDeleteOwner = async (index) => {
    const ownerId = owners[index].id;
    const ownerAuthId = owners[index].authId; // เก็บค่า authId (uid) ของเจ้าของ
    await deleteOwnerInFirebase(ownerId, ownerAuthId);
    const updatedOwners = owners.filter((_, i) => i !== index);
    setOwners(updatedOwners);
  };

  return (
    <>
      <div className="w-full h-screen p-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-center mb-10 text-green-800">
          จัดการเจ้าของสัตว์เลี้ยง
        </h1>

        {/* Add new owner button */}
        <div className="flex justify-end mb-8 w-full max-w-3xl">
          <button
            className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            onClick={() => openModal()}
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
                <th className="py-4 px-6 font-semibold text-left">ติดต่อ</th>
                <th className="py-4 px-6 font-semibold text-left">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-green-50 transition-colors duration-200"
                >
                  <td className="py-4 px-6">{owner.name}</td>
                  <td className="py-4 px-6">{owner.contact}</td>
                  <td className="py-4 px-6 flex gap-4">
                    <button
                      className="text-blue-500 hover:text-blue-600 font-medium"
                      onClick={() => openModal(index)} // Edit owner
                    >
                      แก้ไข
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600 font-medium"
                      onClick={() => handleDeleteOwner(index)} // Delete owner
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

      {/* Modal for adding or updating owner */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white w-full max-w-2xl p-10 rounded-lg shadow-2xl relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
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
              {editIndex !== null ? "แก้ไขเจ้าของ" : "เพิ่มเจ้าของสัตว์เลี้ยง"}
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ชื่อเจ้าของ
                </label>
                <input
                  type="text"
                  placeholder="กรอกชื่อเจ้าของ"
                  className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={addAddressMember}
                  onChange={(e) => setAddressMember(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  เลือกสัตว์เลี้ยง
                </label>
                <Select
                  showSearch
                  placeholder="กรุณาเลือกสัตว์เลี้ยง"
                  optionFilterProp="children"
                  className="w-full"
                  value={selectedPetId} // Show selected pet ID
                  onChange={(value) => setSelectedPetId(value)} // Store pet ID in state
                >
                  {pets.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                className="bg-green-500 text-white py-2 px-8 rounded-md hover:bg-green-600 transition-all"
                onClick={
                  editIndex !== null ? handleUpdateOwner : handleAddOwner
                }
              >
                {editIndex !== null ? "แก้ไข" : "เพิ่มเจ้าของ"}
              </button>
              <button
                className="bg-red-500 text-white py-2 px-8 rounded-md hover:bg-red-600 transition-all"
                onClick={closeModal}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
