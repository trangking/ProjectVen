import React, { useEffect, useState } from "react";
import useStore from "../../../../store";
import { Select, Button, Spin, Table } from "antd";
import {
  fecthOwners,
  fetchedPets,
  AddOwner,
  updateOwnerInFirebase,
  deleteOwnerInFirebase,
} from "../../../../firebase/firebase";

// คอมโพเนนต์สำหรับเพิ่มเจ้าของสัตว์เลี้ยง
function AddOwnerModal({ isOpen, onClose, pets, owners, setOwners }) {
  const [selectedPetIds, setSelectedPetIds] = useState([]);
  const firstName = useStore((state) => state.firstName);
  const setfirstName = useStore((state) => state.setfirstName);
  const lastnameOwner = useStore((state) => state.lastnameOwner);
  const setLastnameOwner = useStore((state) => state.setLastnameOwner);
  const addPassword = useStore((state) => state.addPassword);
  const setAddPassword = useStore((state) => state.setAddPassword);
  const addEmailMember = useStore((state) => state.addEmailMember);
  const setEmailMember = useStore((state) => state.setEmailMember);
  const addPhoneMember = useStore((state) => state.addPhoneMember);
  const setPhoneMember = useStore((state) => state.setPhoneMember);
  const addAddressMember = useStore((state) => state.addAddressMember);
  const setAddressMember = useStore((state) => state.setAddressMember);

  const handleAddOwner = async () => {
    if (
      !firstName ||
      !lastnameOwner ||
      !addEmailMember ||
      !addPhoneMember ||
      !addPassword
      // ||
      // selectedPetIds.length === 0
    )
      return;

    try {
      await AddOwner(
        firstName,
        lastnameOwner,
        addEmailMember,
        addPhoneMember,
        addAddressMember,
        addPassword,
        selectedPetIds
      );
      onClose();
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
              onChange={(e) => setfirstName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              นามสกุลเจ้าของ
            </label>
            <input
              type="text"
              placeholder="กรอกนามสกุลเจ้าของ"
              className="w-full p-4 border border-gray-300 rounded-md"
              onChange={(e) => setLastnameOwner(e.target.value)}
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
              onChange={(e) => setEmailMember(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              เบอร์โทรศัพท์
            </label>
            <input
              type="text"
              placeholder="กรอกเบอร์โทรศัพท์"
              className="w-full p-4 border border-gray-300 rounded-md"
              onChange={(e) => setPhoneMember(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              รหัสผ่าน
            </label>
            <input
              type="password"
              placeholder="กรอกรหัสผ่าน"
              className="w-full p-4 border border-gray-300 rounded-md"
              onChange={(e) => setAddPassword(e.target.value)}
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
  const firstName = useStore((state) => state.firstName);
  const setfirstName = useStore((state) => state.setfirstName);
  const lastnameOwner = useStore((state) => state.lastnameOwner);
  const setLastnameOwner = useStore((state) => state.setLastnameOwner);
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
      setfirstName(selectedOwner.name);
      setLastnameOwner(selectedOwner.lastnameOwner);
      setEmailMember(selectedOwner.contact);
      setPhoneMember(selectedOwner.phone || "");
      setAddressMember(selectedOwner.address || "");
      setSelectedPetIds(selectedOwner.petIds || []);
    }
  }, [editIndex]);

  const handleUpdateOwner = async () => {
    if (!firstName || !lastnameOwner || !addEmailMember || !addPhoneMember)
      return;

    try {
      const ownerId = owners[editIndex].id;
      const previousPetIds = owners[editIndex].petIds || [];

      const updatedOwnerData = {
        name: firstName,
        lastnameOwner: lastnameOwner,
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
              value={firstName}
              onChange={(e) => setfirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              นามสกุลเจ้าของ
            </label>
            <input
              type="text"
              placeholder="กรอกชื่อเจ้าของ"
              className="w-full p-4 border border-gray-300 rounded-md"
              value={lastnameOwner}
              onChange={(e) => setLastnameOwner(e.target.value)}
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
              เบอร์โทรศัพท์
            </label>
            <input
              type="text"
              placeholder="กรอกเบอร์โทรศัพท์"
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
                showSearch
                placeholder="กรุณาเลือกสัตว์เลี้ยง"
                className="w-1/2"
                value={petToAdd}
                onChange={(value) => setPetToAdd(value)}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                options={pets.map((pet) => ({
                  label: `${pet.name} / ${pet.NumberPet}`, // แสดงชื่อสัตว์เลี้ยง
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
                      <td className="py-4 px-6">
                        {pet ? pet.name : id} / {pet ? pet.NumberPet : 0}
                      </td>
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
  const [loading, setLoading] = useState(false);

  const handleDeleteOwner = async (index) => {
    setLoading(true);
    const ownerId = owners[index].id;
    const ownerAuthId = owners[index].authId; // เก็บค่า authId (uid) ของเจ้าของ
    await deleteOwnerInFirebase(ownerId, ownerAuthId);
    const updatedOwners = owners.filter((_, i) => i !== index);
    setOwners(updatedOwners);
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // เริ่มแสดง loading ก่อนดึงข้อมูล
      try {
        const fetchedOwners = await fecthOwners();
        const fetchedPet = await fetchedPets();
        setOwners(fetchedOwners);
        setPets(fetchedPet);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false); // หยุดแสดง loading เมื่อข้อมูลถูกโหลดเสร็จ
    };
    fetchData();
  }, []);

  const openEditModal = (index) => {
    setEditIndex(index);
    setEditModalOpen(true);
  };

  const paginationConfig = {
    pageSize: 5, // Number of items per page
    // showSizeChanger: true,
  };

  const columns = [
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "นามสกุล",
      dataIndex: "lastnameOwner",
      key: "lastnameOwner",
    },
    {
      title: "อีเมลล์",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "การจัดการ",
      key: "action",
      render: (_, record, index) => (
        <>
          <Button
            type="link"
            onClick={() => openEditModal(index)}
            className="text-blue-500 hover:text-blue-600"
          >
            แก้ไข
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteOwner(index)}
            className="text-red-500 hover:text-red-600"
          >
            ลบ
          </Button>
        </>
      ),
    },
  ];

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
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={owners}
              rowKey={(record) => record.id || record.key}
              pagination={paginationConfig}
            />
          </Spin>
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
