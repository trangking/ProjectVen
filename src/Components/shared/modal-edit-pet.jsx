import React, { useEffect, useState } from "react";
import { Input, Select, InputNumber, Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { updatePetInFirebase } from "../../firebase/firebase";

export default function ModalEditPet({ newPet, closeModal }) {
  const [loading, setLoading] = useState(false);
  const [petData, setPetData] = useState(newPet || {});

  useEffect(() => {
    if (newPet) {
      setPetData(newPet);
    }
  }, [newPet]);

  const handleUpdatePet = async () => {
    setLoading(true);
    try {
      await updatePetInFirebase(petData.id, petData);
      closeModal();
    } catch (error) {
      console.error("Error updating pet:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <Spin indicator={<LoadingOutlined spin />} spinning={loading}>
        {/* <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> */}
        {/* <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-2xl relative"> */}
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          แก้ไขสัตว์เลี้ยง
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ชื่อสัตว์เลี้ยง
            </label>
            <Input
              placeholder="ชื่อสัตว์เลี้ยง"
              value={petData.name}
              onChange={(e) => setPetData({ ...petData, name: e.target.value })}
              className="mt-1 py-2 px-4 border border-gray-300 rounded-md w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ประเภทสัตว์
            </label>
            <Select
              placeholder="เลือกประเภทสัตว์"
              value={petData.type}
              onChange={(value) => setPetData({ ...petData, type: value })}
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              <Select.Option value="สุนัข">สุนัข</Select.Option>
              <Select.Option value="แมว">แมว</Select.Option>
              <Select.Option value="สัตว์เอ็กโซติก">
                สัตว์เอ็กโซติก
              </Select.Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              พันธุ์สัตว์
            </label>
            <Input
              placeholder="กรอกสายพันธุ์"
              value={petData.subType}
              onChange={(e) =>
                setPetData({ ...petData, subType: e.target.value })
              }
              className="mt-1 py-2 px-4 border border-gray-300 rounded-md w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              สี
            </label>
            <Input
              placeholder="สี"
              value={petData.color}
              onChange={(e) =>
                setPetData({ ...petData, color: e.target.value })
              }
              className="mt-1 py-2 px-4 border border-gray-300 rounded-md w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                อายุ (ปี)
              </label>
              <InputNumber
                placeholder="ปี"
                value={petData.years}
                min={0}
                onChange={(value) => setPetData({ ...petData, years: value })}
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                อายุ (เดือน)
              </label>
              <InputNumber
                placeholder="เดือน"
                value={petData.months}
                min={0}
                max={12}
                onChange={(value) => setPetData({ ...petData, months: value })}
                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              น้ำหนัก (กิโลกรัม)
            </label>
            <Input
              placeholder="น้ำหนัก"
              value={petData.weight}
              onChange={(e) =>
                setPetData({ ...petData, weight: e.target.value })
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
              value={petData.gender}
              onChange={(value) => setPetData({ ...petData, gender: value })}
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              <Select.Option value="Male">เพศผู้</Select.Option>
              <Select.Option value="Female">เพศเมีย</Select.Option>
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
            onClick={handleUpdatePet}
          >
            บันทึกการเปลี่ยนแปลง
          </Button>
        </div>
        {/* </div> */}
        {/* </div> */}
      </Spin>
    </div>
  );
}
