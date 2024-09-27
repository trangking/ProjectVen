import React, { useState } from "react";
import useStore from "../../../../store";
import { Select } from "antd";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function ManageOwners() {
  const [owners, setOwners] = useState([
    { name: "John Doe", contact: "john@example.com", pets: 2 },
    { name: "Jane Smith", contact: "jane@example.com", pets: 3 },
  ]);
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addMember = useStore((state) => state.addMember);
  const setAddMember = useStore((state) => state.setAddMember);

  const addEmailMember = useStore((state) => state.addEmailMember);
  const setEmailMember = useStore((state) => state.setEmailMember);

  const addPhoneMember = useStore((state) => state.addPhoneMember);
  const setPhoneMember = useStore((state) => state.setPhoneMember);

  const addAddressMember = useStore((state) => state.addAddressMember);
  const setAddressMember = useStore((state) => state.setAddressMember);

  const { Option } = Select;

  const openModal = (index = null) => {
    if (index !== null) {
      const selectedOwner = owners[index];
      setAddMember(selectedOwner.name);
      setEmailMember(selectedOwner.contact);
      setPhoneMember(selectedOwner.phone || "");
      setAddressMember(selectedOwner.address || "");
      setEditIndex(index);
    } else {
      setAddMember("");
      setEmailMember("");
      setPhoneMember("");
      setAddressMember("");
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
  };

  const handleAddOwner = async () => {
    if (!addMember || !addEmailMember || !addPhoneMember) return;

    const newOwnerData = {
      name: addMember,
      contact: addEmailMember,
      phone: addPhoneMember,
      address: addAddressMember,
    };

    try {
      // สร้างผู้ใช้ใหม่ใน Firebase Authentication โดยใช้ email และ password (เบอร์โทร)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        addEmailMember,
        addPhoneMember
      );

      // ดึง userId จากผู้ใช้ที่ถูกสร้าง
      const userId = userCredential.user.uid;

      // เก็บข้อมูลเพิ่มเติมของผู้ใช้ใหม่ใน Firestore
      await setDoc(doc(db, "owners", userId), newOwnerData);

      // อัปเดต state ของ owners เพื่อแสดงใน UI
      setOwners([...owners, { ...newOwnerData, id: userId }]);

      closeModal(); // ปิด modal หลังจากเพิ่มข้อมูลเสร็จสิ้น
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการสมัครสมาชิก:", error);
    }
  };

  const handleDeleteOwner = (index) => {
    const updatedOwners = owners.filter((_, i) => i !== index);
    setOwners(updatedOwners);
  };

  return (
    <>
      <div className="w-full h-screen  p-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-center mb-10 text-green-800">
          จัดการเจ้าของสัตว์เลี้ยง
        </h1>

        {/* ปุ่มเพิ่มเจ้าของใหม่ */}
        <div className="flex justify-end mb-8 w-full max-w-3xl">
          <button
            className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            onClick={() => openModal()}
          >
            + เพิ่มเจ้าของใหม่
          </button>
        </div>

        {/* ตารางแสดงเจ้าของ */}
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
                  <td className="py-4 px-6">
                    <button
                      className="text-red-500 hover:text-red-600 font-medium"
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

      {/* Modal */}
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
                  เลือกประเภทสัตว์
                </label>
                <Select
                  showSearch
                  placeholder="กรุณาเลือกสัตว์"
                  optionFilterProp="children"
                  className="w-full"
                  // value={addPhoneMember}
                  // onChange={(value) => setPhoneMember(value)}
                  filterOption={(input, option) =>
                    option?.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="สุนัข">สุนัข</Option>
                  <Option value="แมว">แมว</Option>
                  <Option value="นก">นก</Option>
                  <Option value="ปลา">ปลา</Option>
                </Select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                className="bg-green-500 text-white py-2 px-8 rounded-md hover:bg-green-600 transition-all"
                onClick={handleAddOwner}
              >
                เพิ่มเจ้าของ
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
