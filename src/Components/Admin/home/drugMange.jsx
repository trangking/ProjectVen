import React, { useState } from "react";

export default function DrugManage() {
  const [vaccineData, setVaccineData] = useState([
    { id: 1, name: "วัคซีน A", image: null },
    { id: 2, name: "วัคซีน B", image: null },
  ]);

  const [newVaccine, setNewVaccine] = useState({ name: "", image: null });
  const [editVaccine, setEditVaccine] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleFileChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (isEdit) {
        setEditVaccine({ ...editVaccine, image: reader.result });
      } else {
        setNewVaccine({ ...newVaccine, image: reader.result });
      }
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleAddVaccine = () => {
    if (newVaccine.name && newVaccine.image) {
      setVaccineData([...vaccineData, { ...newVaccine, id: Date.now() }]);
      setNewVaccine({ name: "", image: null });
      setShowAddModal(false); // ปิด modal หลังเพิ่ม
    }
  };

  const handleEditVaccine = (vaccine) => {
    setEditVaccine(vaccine);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setVaccineData(
      vaccineData.map((vaccine) =>
        vaccine.id === editVaccine.id ? editVaccine : vaccine
      )
    );
    setEditVaccine(null);
    setShowEditModal(false); // ปิด modal หลังบันทึกการแก้ไข
  };

  const handleDeleteVaccine = (id) => {
    setVaccineData(vaccineData.filter((vaccine) => vaccine.id !== id));
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">จัดการวัคซีน</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-500 text-white px-4 h- rounded hover:bg-green-400 transition"
        >
          เพิ่มวัคซีน
        </button>
      </div>

      {/* ตารางแสดงข้อมูลวัคซีน */}
      <table className="table-auto w-full mb-6 text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-3 font-medium text-gray-700">ชื่อวัคซีน</th>
            <th className="px-4 py-3 font-medium text-gray-700">รูปภาพ</th>
            <th className="px-4 py-3 font-medium text-gray-700">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {vaccineData.map((vaccine) => (
            <tr key={vaccine.id} className="border-t">
              <td className="px-4 py-3">{vaccine.name}</td>
              <td className="px-4 py-3">
                {vaccine.image ? (
                  <img
                    src={vaccine.image}
                    alt={vaccine.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-500">ไม่มีรูป</span>
                )}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleEditVaccine(vaccine)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-300 transition mr-2"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDeleteVaccine(vaccine.id)}
                  className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-300 transition"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ปุ่มเปิด Modal สำหรับเพิ่มวัคซีน */}

      {/* Modal สำหรับเพิ่มวัคซีน */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              เพิ่มวัคซีน
            </h2>
            <input
              type="text"
              placeholder="ชื่อวัคซีน"
              value={newVaccine.name}
              onChange={(e) =>
                setNewVaccine({ ...newVaccine, name: e.target.value })
              }
              className="border px-4 py-2 mb-3 w-full rounded focus:ring-2 focus:ring-green-400"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="block mb-3 text-gray-700"
            />
            {newVaccine.image && (
              <img
                src={newVaccine.image}
                alt="New vaccine"
                className="w-12 h-12 object-cover rounded mb-3"
              />
            )}
            <button
              onClick={handleAddVaccine}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 transition w-full"
            >
              เพิ่มวัคซีน
            </button>
            <button
              onClick={() => setShowAddModal(false)}
              className="mt-4 text-red-500 w-full"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* Modal สำหรับแก้ไขวัคซีน */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              แก้ไขวัคซีน
            </h2>
            <input
              type="text"
              value={editVaccine.name}
              onChange={(e) =>
                setEditVaccine({ ...editVaccine, name: e.target.value })
              }
              className="border px-4 py-2 mb-3 w-full rounded focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="file"
              onChange={(e) => handleFileChange(e, true)}
              className="block mb-3 text-gray-700"
            />
            {editVaccine.image && (
              <img
                src={editVaccine.image}
                alt="Edit vaccine"
                className="w-12 h-12 object-cover rounded mb-3"
              />
            )}
            <button
              onClick={handleSaveEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition w-full"
            >
              บันทึก
            </button>
            <button
              onClick={() => setShowEditModal(false)}
              className="mt-4 text-red-500 w-full"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
