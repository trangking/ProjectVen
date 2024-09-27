import React, { useState } from "react";
import useStore from "../../../../store";

export default function ManageOwners() {
  const [owners, setOwners] = useState([
    { name: "John Doe", contact: "john@example.com", pets: 2 },
    { name: "Jane Smith", contact: "jane@example.com", pets: 3 },
  ]);
  const [newOwner, setNewOwner] = useState({ name: "", contact: "", pets: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addMember = useStore((state) => state.addMember);
  const setAddMember = useStore((state) => state.setAddMember);
  const addEmailMember = useStore((state) => state.addEmailMember);
  const setEmailMember = useStore((state) => state.setEmailMember);
  const addPhoneMember = useStore((state) => state.addPhoneMember);
  const setaddPhoneMember = useStore((state) => state.setaddPhoneMember);
  const addAddressMember = useStore((state) => state.addAddressMember);
  const setaddAddressMember = useStore((state) => state.setaddAddressMember);

  console.log(addMember);

  const openModal = (index = null) => {
    if (index !== null) {
      setNewOwner(owners[index]);
      setEditIndex(index);
    } else {
      setNewOwner({ name: "", contact: "", pets: "" });
      setEditIndex(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewOwner({ name: "", contact: "", pets: "" });
  };

  const handleAddOrUpdateOwner = () => {
    if (!newOwner.name || !newOwner.contact || !newOwner.pets) return;

    if (editIndex !== null) {
      const updatedOwners = [...owners];
      updatedOwners[editIndex] = newOwner;
      setOwners(updatedOwners);
    } else {
      setOwners([...owners, newOwner]);
    }
    closeModal();
  };

  const handleDeleteOwner = (index) => {
    const updatedOwners = owners.filter((_, i) => i !== index);
    setOwners(updatedOwners);
  };

  return (
    <>
      <div className="w-full h-screen  p-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-center mb-10 text-green-800">
          Manage Owners
        </h1>

        {/* Add New Owner Button */}
        <div className="flex justify-end mb-8 w-full max-w-3xl">
          <button
            className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            onClick={() => openModal()}
          >
            + Add New Owner
          </button>
        </div>

        {/* Table to Display Owners */}
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="py-4 px-6 font-semibold text-left">Name</th>
                <th className="py-4 px-6 font-semibold text-left">Contact</th>
                <th className="py-4 px-6 font-semibold text-left">
                  Number of Pets
                </th>
                <th className="py-4 px-6 font-semibold text-left">Actions</th>
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
                  <td className="py-4 px-6">{owner.pets}</td>
                  <td className="py-4 px-6">
                    <button
                      className="text-green-500 hover:text-green-600 mr-4 font-medium"
                      onClick={() => openModal(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600 font-medium"
                      onClick={() => handleDeleteOwner(index)}
                    >
                      Delete
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
              {editIndex !== null ? "Edit Owner Details" : "Add New Owner"}
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Owner Name
                </label>
                <input
                  type="text"
                  placeholder="Enter owner's name"
                  className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={addMember}
                  onChange={(e) => setAddMember(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Owner Email
                </label>
                <input
                  type="email"
                  placeholder="Enter owner's email"
                  className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={addEmailMember}
                  onChange={(e) => setEmailMember(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Owner Phone
                </label>
                <input
                  type="text"
                  placeholder="Enter owner's phone number"
                  className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={addPhoneMember}
                  onChange={(e) => setaddPhoneMember(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Owner Address
                </label>
                <input
                  type="text"
                  placeholder="Enter owner's address"
                  className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={addAddressMember}
                  onChange={(e) => setaddAddressMember(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Number of Pets
                </label>
                <input
                  type="number"
                  placeholder="Enter number of pets"
                  className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newOwner.pets}
                  onChange={(e) =>
                    setNewOwner({ ...newOwner, pets: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Pet ID
                </label>
                <input
                  type="text"
                  placeholder="Enter pet ID"
                  className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newOwner.petId}
                  onChange={(e) =>
                    setNewOwner({ ...newOwner, petId: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                className="bg-green-500 text-white py-2 px-8 rounded-md hover:bg-green-600 transition-all"
                onClick={handleAddOrUpdateOwner}
              >
                {editIndex !== null ? "Update Owner" : "Add Owner"}
              </button>
              <button
                className="bg-red-500 text-white py-2 px-8 rounded-md hover:bg-red-600 transition-all"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
              {editIndex !== null
                ? "แก้ไขเจ้าของสัตว์เลี้ยง"
                : "เพิ่มเจ้าของสัตว์เลี้ยง"}
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
                  onChange={(e) => setaddPhoneMember(e.target.value)}
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
                  onChange={(e) => setaddAddressMember(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  เลือกประเภทสัตว์
                </label>
                <select
                  className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newOwner.petType}
                  onChange={(e) =>
                    setNewOwner({ ...newOwner, petType: e.target.value })
                  }
                >
                  <option value="" disabled hidden>
                    กรุณาเลือกสัตว์
                  </option>
                  <option value="สุนัข">สุนัข</option>
                  <option value="แมว">แมว</option>
                  <option value="นก">นก</option>
                  <option value="ปลา">ปลา</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                className="bg-green-500 text-white py-2 px-8 rounded-md hover:bg-green-600 transition-all"
                onClick={handleAddOrUpdateOwner}
              >
                {editIndex !== null ? "แก้ไขเจ้าของ" : "เพิ่มเจ้าของ"}
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
