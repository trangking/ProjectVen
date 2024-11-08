import React, { useState, useEffect } from "react";
import { Input, Button, Select, InputNumber, Spin, Table } from "antd";
import {
  addPetToFirebase,
  updatePetInFirebase,
  fetchedPets,
  deletePetInFirebase,
} from "../../../../firebase/firebase";
import useStore from "../../../../store";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;
const exoticBreeds = ["Snake", "Lizard", "Tortoise", "Parrot"];

export default function ManageAnimals() {
  const newPet = useStore((state) => state.newPet);
  const setNewPet = useStore((state) => state.setNewPet);
  const resetNewPet = useStore((state) => state.resetNewPet);
  const pets = useStore((state) => state.pets);
  const setPets = useStore((state) => state.setPets);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredPets, setFilteredPets] = useState([]);

  const openModal = (index = null) => {
    if (index !== null) {
      setEditIndex(index);
      setNewPet(pets[index]);
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
      setLoading(true);
      const fetchedPet = await fetchedPets();
      setPets(fetchedPet);
      setFilteredPets(fetchedPet); // แสดงทั้งหมดในครั้งแรก
      setLoading(false);
    };
    loadPets();
  }, []);

  const handleDeletePet = async (petId) => {
    try {
      setLoading(true);
      await deletePetInFirebase(petId);
      const updatedPets = pets.filter((pet) => pet.id !== petId);
      setPets(updatedPets);
      setFilteredPets(updatedPets);
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
    setLoading(false);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
    const filteredData = pets.filter(
      (pet) =>
        (pet.name && pet.name.toLowerCase().includes(value)) ||
        (pet.type && pet.type.toLowerCase().includes(value)) ||
        (pet.color && pet.color.toLowerCase().includes(value)) ||
        (pet.NumberPet && String(pet.NumberPet).toLowerCase().includes(value))
    );
    setFilteredPets(filteredData);
  };

  const breedOptions = () => {
    return exoticBreeds.map((breed) => (
      <Option key={breed} value={breed}>
        {breed}
      </Option>
    ));
  };

  const handleAddOrUpdatePet = async () => {
    setLoading(true);
    if (editIndex !== null) {
      const updatedPets = [...pets];
      const petId = pets[editIndex].id;
      updatedPets[editIndex] = newPet;
      setPets(updatedPets);
      await updatePetInFirebase(petId, newPet);
    } else {
      const petId = await addPetToFirebase(newPet);
      if (petId) {
        setPets([...pets, { ...newPet, id: petId }]);
      }
    }
    setLoading(false);
    closeModal();
  };

  const columns = [
    {
      title: "ชื่อ",
      key: "name",
      render: (text, record) => `${record.name} / ${record.NumberPet}`,
    },
    { title: "ประเภท", dataIndex: "type", key: "type" },
    { title: "สี", dataIndex: "color", key: "color" },
    { title: "น้ำหนัก", dataIndex: "weight", key: "weight" },
    {
      title: "อายุ",
      key: "age",
      render: (text, record) => `${record.years} ปี ${record.months} เดือน`,
    },
    { title: "เพศ", dataIndex: "gender", key: "gender" },
    {
      title: "การจัดการ",
      key: "actions",
      render: (text, record, index) => (
        <>
          <Button
            type="link"
            onClick={() => openModal(index)}
            style={{ color: "green" }}
          >
            แก้ไข
          </Button>
          <Button type="link" danger onClick={() => handleDeletePet(record.id)}>
            ลบ
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="w-full p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-green-600">
          จัดการสัตว์เลี้ยง
        </h1>
        <div className="flex justify-between mb-8 w-full max-w-4xl">
          <Button
            type="primary"
            className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            onClick={() => openModal()}
          >
            + เพิ่มสัตว์เลี้ยงใหม่
          </Button>
          <Input
            placeholder="ค้นหาชื่อ ประเภท หรือสี"
            value={searchText}
            onChange={handleSearch}
            style={{ width: "200px" }}
            prefix={<SearchOutlined />}
          />
        </div>
        <div className="w-full max-w-4xl  rounded-lg  p-6">
          <Spin indicator={<LoadingOutlined spin />} spinning={loading}>
            <Table
              columns={columns}
              dataSource={filteredPets}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              bordered
            />
          </Spin>
        </div>
      </div>

      {/* ส่วนของ Modal */}
      {isModalOpen && (
        <Spin indicator={<LoadingOutlined spin />} spinning={loading}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-2xl relative">
              <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
                {editIndex !== null
                  ? "แก้ไขสัตว์เลี้ยง"
                  : "เพิ่มสัตว์เลี้ยงใหม่"}
              </h2>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ชื่อสัตว์เลี้ยง
                  </label>
                  <Input
                    placeholder="ชื่อสัตว์เลี้ยง"
                    value={newPet.name}
                    onChange={(e) =>
                      setNewPet({ ...newPet, name: e.target.value })
                    }
                    className="mt-1 py-2 px-4 border border-gray-300 rounded-md w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ประเภทสัตว์
                  </label>
                  <Select
                    placeholder="เลือกประเภทสัตว์"
                    value={newPet.type}
                    onChange={(value) => setNewPet({ ...newPet, type: value })}
                    className="mt-1 w-full  border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                  >
                    <Option value="Dog">หมา</Option>
                    <Option value="Cat">แมว</Option>
                    <Option value="Exotic">สัตว์เอ็กโซติก</Option>
                  </Select>
                </div>

                {newPet.type !== "Exotic" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      พันธุ์สัตว์
                    </label>
                    <Input
                      placeholder={`กรอกสายพันธ์ ${newPet.type}`}
                      value={newPet.subType}
                      onChange={(e) =>
                        setNewPet({ ...newPet, subType: e.target.value })
                      }
                      className="mt-1 py-2 px-4 border border-gray-300 rounded-md w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                )}

                {newPet.type === "Exotic" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      พันธุ์สัตว์
                    </label>
                    <Select
                      placeholder="เลือกพันธุ์"
                      value={newPet.subType}
                      onChange={(value) =>
                        setNewPet({ ...newPet, subType: value })
                      }
                      className="mt-1 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                    >
                      {breedOptions()}
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      อายุ (ปี)
                    </label>
                    <InputNumber
                      placeholder="ปี"
                      value={newPet.years}
                      min={0}
                      onChange={(value) =>
                        setNewPet({ ...newPet, years: value })
                      }
                      className="mt-1 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      อายุ (เดือน)
                    </label>
                    <InputNumber
                      placeholder="เดือน"
                      value={newPet.months}
                      min={0}
                      max={12}
                      onChange={(value) =>
                        setNewPet({ ...newPet, months: value })
                      }
                      className="mt-1 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    สี
                  </label>
                  <Input
                    placeholder="สี"
                    value={newPet.color}
                    onChange={(e) =>
                      setNewPet({ ...newPet, color: e.target.value })
                    }
                    className="mt-1 py-2 px-4 border border-gray-300 rounded-md w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    น้ำหนัก (กิโลกรัม)
                  </label>
                  <Input
                    placeholder="น้ำหนัก"
                    value={newPet.weight}
                    onChange={(e) =>
                      setNewPet({ ...newPet, weight: e.target.value })
                    }
                    className="mt-1 py-2 px-4 border border-gray-300 rounded-md w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    เพศ
                  </label>
                  <Select
                    placeholder="เลือกเพศ"
                    value={newPet.gender}
                    onChange={(value) =>
                      setNewPet({ ...newPet, gender: value })
                    }
                    className="mt-1 w-full  border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                  >
                    <Option value="Male">เพศผู้</Option>
                    <Option value="Female">เพศเมีย</Option>
                  </Select>
                </div>
              </form>

              <div className="flex justify-end mt-6 space-x-3">
                <Button
                  onClick={closeModal}
                  className="py-2 px-6 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="primary"
                  className="py-2 px-6 bg-green-500 text-white rounded-md hover:bg-green-700 transition"
                  onClick={handleAddOrUpdatePet}
                >
                  {editIndex !== null ? "อัปเดต" : "เพิ่ม"}
                </Button>
              </div>
            </div>
          </div>
        </Spin>
      )}
    </>
  );
}
