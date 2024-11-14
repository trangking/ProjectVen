import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchedPetsByID,
  fetchedOwnerByID,
  insetAccountLineInfirebase,
} from "../../firebase/firebase";
import {
  Table,
  Button,
  Modal,
  Tabs,
  notification,
  Spin,
  Typography,
  Drawer,
  Image,
} from "antd";
import useStore from "../../store";
import { MenuOutlined } from "@ant-design/icons";
import liff from "@line/liff";
const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function PetCards() {
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false); // State for Drawer visibility
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const ownerId = localStorage.getItem("Id");
  const logout = useStore((state) => state.logout);
  const [owner, setowner] = useState([]);
  const [modal2Open, setModal2Open] = useState(false);
  const [urlPicture, seturlPicture] = useState(null);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        // Open modal if accountLine is empty, close if it exists
        setModal2Open(
          !owner.accountLine || Object.keys(owner.accountLine).length === 0
        );

        // Initialize LIFF with liffId
        await liff.init({ liffId: "2006562622-GXpWdRRO" });

        // Check if logged in and accountLine is empty, then fetch profile and save it
        if (
          liff.isLoggedIn() &&
          (!owner.accountLine || Object.keys(owner.accountLine).length === 0)
        ) {
          const profile = await liff.getProfile();
          await insetAccountLineInfirebase(ownerId, profile);
          setModal2Open(false); // Close modal after updating Firebase
        }
      } catch (err) {
        console.log("Error during LIFF initialization or login:", err);
      }
    };

    initializeLiff();
  }, [owner.accountLine, ownerId]);

  const handleViewHistory = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPet(null);
  };

  const toggleDrawer = async () => {
    setDrawerVisible(!drawerVisible);
    // เพิ่มการตรวจสอบเงื่อนไข
    seturlPicture(owner.accountLine?.pictureUrl || null);
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
      setLoading(true);
      const fetchedPet = await fetchedPetsByID(ownerId);
      setPets(fetchedPet);
      const fetchOwner = await fetchedOwnerByID(ownerId);
      setowner(fetchOwner);
      setLoading(false);
    };
    loadData();
  }, [ownerId]);

  const handleLoginLine = async () => {
    try {
      await liff.init({ liffId: "2006562622-GXpWdRRO" });
      liff.login();
    } catch (err) {
      console.log("Error during LINE login:", err);
    }
  };

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
  // console.log(owner.accountLine.pictureUrl);

  return (
    <Spin spinning={loading}>
      <div className="container mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        {/* Toggle Menu Button for Mobile */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            รายการสัตว์เลี้ยง
          </h2>
          <Button type="text" icon={<MenuOutlined />} onClick={toggleDrawer} />
        </div>

        {/* Drawer for Mobile Menu */}
        <Drawer
          title="เมนู"
          placement="left"
          onClose={toggleDrawer}
          visible={drawerVisible}
        >
          <div className="w-full flex flex-col h-full justify-between items-center">
            <div>
              {urlPicture ? (
                <img
                  src={urlPicture}
                  alt="Profile"
                  className="rounded-full h-20 w-20 mb-4"
                />
              ) : (
                <div className="rounded-full h-20 w-20 bg-gray-300 mb-4"></div>
              )}
              <div className="text-center">
                <Title level={5}>
                  {owner?.accountLine?.displayName || "ผู้ใช้"}
                </Title>
              </div>
            </div>
            <Button type="primary" danger onClick={logout} block>
              ออกจากระบบ
            </Button>
          </div>
        </Drawer>

        {/* Tabs and Table */}
        <Tabs defaultActiveKey="2">
          <TabPane tab="สัตว์เลี้ยง" key="2">
            <Table
              dataSource={pets}
              columns={columns}
              rowKey="name"
              className="mt-4"
              scroll={{ x: 800 }}
            />
          </TabPane>
        </Tabs>

        {/* Modal for History */}
        <Modal
          title={`ประวัติการรักษา : ${selectedPet?.name}`}
          visible={showModal}
          onCancel={handleCloseModal}
          footer={null}
          width="90%"
          style={{ maxWidth: "1000px" }}
        >
          {/* Table inside Modal */}
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

        {/* Modal for LINE Registration */}
        <Modal
          title="กรุณาลงทะเบียนผ่านทาง LINE"
          centered
          open={modal2Open}
          onOk={() => setModal2Open(false)}
          footer={null}
          className="p-4"
        >
          <div className="flex flex-col justify-center items-center text-center p-4 sm:p-6">
            <img
              src="/LINE_logo.svg.png"
              alt="LINE Logo"
              style={{
                width: "80px",
                marginBottom: "15px",
              }}
            />
            <Title level={3} style={{ color: "#2c3e50", marginBottom: "10px" }}>
              ลงทะเบียนผ่านทาง LINE
            </Title>

            {/* Step 1: Add Friend */}
            <div className="step-container mb-6">
              <div className="step-header flex items-center mb-2">
                <span className="step-number bg-green-500 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  1
                </span>
                <Text strong style={{ fontSize: "1.1rem" }}>
                  เพิ่มเพื่อน
                </Text>
              </div>
              <Text style={{ color: "#7f8c8d", marginBottom: "15px" }}>
                กรุณาเพิ่มเพื่อนใน LINE เพื่อรับข่าวสารการนัดหมาย
              </Text>
              <Image
                src="/QRCODE2.png"
                width={150}
                height={150}
                className="rounded-md border border-gray-200 mb-4"
              />

              <h1 style={{ color: "#7f8c8d" }}>หรือ</h1>
              <Link
                to="https://lin.ee/qTJxijq"
                className="w-full items-center justify-center flex"
              >
                <img
                  src="https://scdn.line-apps.com/n/line_add_friends/btn/th.png"
                  alt="เพิ่มเพื่อน"
                  height="20"
                  border="0"
                  className="w-[10.25rem] h-[3.25rem]"
                />
              </Link>
            </div>

            {/* Step 2: Login */}
            <div className="step-container mb-6">
              <div className="step-header flex items-center mb-2">
                <span className="step-number bg-green-500 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  2
                </span>
                <Text strong style={{ fontSize: "1.1rem" }}>
                  เข้าสู่ระบบ
                </Text>
              </div>
              <Text style={{ color: "#7f8c8d", marginBottom: "20px" }}>
                กรุณากดปุ่มด้านล่างเพื่อเข้าสู่ระบบผ่านบัญชี LINE
                ของคุณเพื่อผูกบัญชีเข้ากับระบบของเรา
              </Text>
              <Button
                type="primary"
                size="large"
                className="mt-5"
                style={{
                  backgroundColor: "#00c300",
                  borderColor: "#00c300",
                  color: "white",
                  fontWeight: "bold",
                  width: "100%",
                }}
                onClick={handleLoginLine}
              >
                ลงทะเบียนผ่าน LINE
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Spin>
  );
}
