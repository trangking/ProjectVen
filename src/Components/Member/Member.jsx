import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchedPetsByID } from "../../firebase/firebase";
import { Table, Button, Modal, Tabs, notification, Spin } from "antd";
import useStore from "../../store";

const { TabPane } = Tabs;

export default function PetCards() {
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const ownerId = localStorage.getItem("Id");
  const logout = useStore((state) => state.logout);

  const handleViewHistory = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPet(null);
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    const timer = setTimeout(() => {
      localStorage.removeItem("token");
      notification.warning({
        message: "Session Expired",
        description: "หมดเวลาเซสชั่น 1 ชั่วโมง กรุณาเข้าสู่ระบบใหม่",
      });
      navigate("/");
    }, 3600000);

    return () => clearTimeout(timer);
  }, [token, navigate]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // Start loading
      const fetchedPet = await fetchedPetsByID(ownerId);
      setPets(fetchedPet);
      setLoading(false); // Stop loading
    };
    loadData();
  }, [ownerId]);

  const columns = [
    {
      title: "ชื่อสัตว์",
      key: "name",
      render: (text, record) => `${record.name} / ${record.NumberPet}`,
    },
    { title: "ประเภท", dataIndex: "type", key: "type" },
    { title: "สายพันธุ์", dataIndex: "subType", key: "subType" },
    { title: "อายุ (ปี)", dataIndex: "years", key: "years" },
    { title: "อายุ (เดือน)", dataIndex: "months", key: "months" },
    {
      title: "ดูประวัติการรักษา",
      key: "GetTreatment",
      render: (text, record) => (
        <Button onClick={() => handleViewHistory(record)}>เปิด</Button>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="container mx-auto mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            รายการสัตว์เลี้ยง
          </h2>
          <Link to="/login">
            <Button type="primary" danger onClick={logout}>
              ออกจากระบบ
            </Button>
          </Link>
        </div>

        <Tabs defaultActiveKey="2">
          <TabPane tab="สัตว์เลี้ยง" key="2">
            <Table
              dataSource={pets}
              columns={columns}
              rowKey="name"
              className="mt-4"
            />
          </TabPane>
        </Tabs>

        <Modal
          title={`ประวัติการรักษา : ${selectedPet?.name}`}
          visible={showModal}
          onCancel={handleCloseModal}
          footer={null}
          width={1000}
        >
          <div className="bg-pink-100 rounded-lg p-6">
            <table className="min-w-full table-auto border-collapse border border-pink-200">
              <thead>
                <tr className="bg-pink-200">
                  <th className="px-4 py-2 border border-pink-300">
                    การฉีดวัคซีน
                  </th>
                  <th className="px-4 py-2 border border-pink-300">
                    หมายเลขชุดวัคซีน
                  </th>
                  <th className="px-4 py-2 border border-pink-300">
                    วันที่ฉีดวัคซีน
                  </th>
                  <th className="px-4 py-2 border border-pink-300">
                    หมอที่ทำการฉีดวัคซีน
                  </th>
                  <th className="px-4 py-2 border border-pink-300">
                    เลขที่ใบอนุญาติ
                  </th>
                  <th className="px-4 py-2 border border-pink-300">
                    ปริมาณการฉีดวัคซีน
                  </th>
                  <th className="px-4 py-2 border border-pink-300">
                    นัดครั้งถัดไป
                  </th>
                  <th className="px-4 py-2 border border-pink-300">
                    ฉลากวัดคซีน
                  </th>
                  <th className="px-4 py-2 border border-pink-300">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(selectedPet?.historytreatments) &&
                selectedPet.historytreatments.length > 0 ? (
                  selectedPet.historytreatments.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border border-pink-300">
                        {item.vaccine.vaccineName}
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        {item.No_vaccine}
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        {item.DateVaccination}
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        {item.doctorName}
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        {item.Animal_Registration_Number}
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        {item.vaccine_dose}
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        {item.nextAppointmentDate}
                      </td>
                      <td className="px-4 py-2 border border-pink-300 flex justify-center">
                        <img
                          src={item.vaccine.vaccineImage}
                          alt={`Sticker for ${item.vaccine.vaccineImage}`}
                          className="w-20 h-20 object-contain"
                        />
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        {item.description}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center w-full h-[50px]">
                      ไม่มีข้อมูลการรักษา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal>
      </div>
    </Spin>
  );
}
