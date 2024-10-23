import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Upload, Card, Space, Spin } from "antd";
import { UploadOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {
  AddVaccine,
  fetchedVaccine,
  deleteVaccineInFirebase,
  EditVaccine,
} from "../../../firebase/firebase";

export default function DrugManage() {
  const [vaccineData, setVaccineData] = useState([]);
  const [newVaccine, setNewVaccine] = useState({ name: "", image: null });
  const [editVaccine, setEditVaccine] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editImage, setEditImage] = useState(null); // State สำหรับการอัปโหลดรูปใหม่ใน Modal แก้ไข
  const [uploading, setUploading] = useState(false); // สถานะการอัปโหลด
  const [uploadComplete, setUploadComplete] = useState(false); // สถานะอัปโหลดเสร็จ

  // ฟังก์ชันสำหรับลบวัคซีน
  const handleDeleteVaccine = async (vaccine) => {
    await deleteVaccineInFirebase(vaccine.id, vaccine.vaccineImage);
    setVaccineData(vaccineData.filter((v) => v.id !== vaccine.id));
  };

  // ฟังก์ชันสำหรับเพิ่มวัคซีน
  const handleAddVaccine = async () => {
    if (!newVaccine.name || !newVaccine.image) {
      console.log("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    await AddVaccine(newVaccine);
    setNewVaccine({ name: "", image: null });
    setIsAddModalVisible(false);
    const updatedVaccines = await fetchedVaccine();
    setVaccineData(updatedVaccines); // อัปเดตตารางหลังจากเพิ่มวัคซีน
  };

  // ฟังก์ชันสำหรับบันทึกการแก้ไขวัคซีน
  const handleSaveEdit = async () => {
    if (!editVaccine.vaccineName) {
      console.log("กรุณากรอกชื่อวัคซีน");
      return;
    }

    await EditVaccine(editVaccine.id, editVaccine, editImage);
    setIsEditModalVisible(false);
    const updatedVaccines = await fetchedVaccine();
    setVaccineData(updatedVaccines); // อัปเดตตารางหลังจากแก้ไขวัคซีน
  };

  const columns = [
    {
      title: "ชื่อวัคซีน",
      dataIndex: "vaccineName",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "รูปภาพ",
      dataIndex: "vaccineImage",
      key: "image",
      render: (image) =>
        image ? (
          <img
            src={image} // ใช้ URL ของรูปภาพจาก Firebase Storage
            alt="vaccine"
            style={{
              width: "100px",
              height: "70px",
              objectFit: "cover",
              borderRadius: "4px",
              border: "1px solid #d9d9d9",
            }}
          />
        ) : (
          <span>ไม่มีรูป</span>
        ),
    },
    {
      title: "การจัดการ",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
            onClick={() => {
              setEditVaccine(record);
              setIsEditModalVisible(true);
            }}
          >
            แก้ไข
          </Button>
          <Button
            type="danger"
            style={{ backgroundColor: "#f5222d", borderColor: "#f5222d" }}
            onClick={() => handleDeleteVaccine(record)}
          >
            ลบ
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const loadVaccines = async () => {
      const fetchedVaccines = await fetchedVaccine();
      setVaccineData(fetchedVaccines);
    };
    loadVaccines();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Card
        bordered={false}
        style={{ marginBottom: "24px", backgroundColor: "#fafafa" }}
      >
        <h1 className="text-2xl font-bold mb-6">จัดการวัคซีน</h1>
        <div style={{ textAlign: "right" }}>
          <Button
            type="primary"
            onClick={() => setIsAddModalVisible(true)}
            style={{
              marginBottom: 16,
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
            }}
          >
            เพิ่มวัคซีน
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={vaccineData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Modal สำหรับเพิ่มวัคซีน */}
      <Modal
        title="เพิ่มวัคซีน"
        visible={isAddModalVisible}
        onOk={handleAddVaccine}
        onCancel={() => setIsAddModalVisible(false)}
        okText="เพิ่ม"
        cancelText="ยกเลิก"
      >
        <Input
          placeholder="ชื่อวัคซีน"
          value={newVaccine.name}
          onChange={(e) =>
            setNewVaccine({ ...newVaccine, name: e.target.value })
          }
          style={{ marginBottom: 16 }}
        />
        <Upload
          beforeUpload={(file) => {
            const isJpgOrPng =
              file.type === "image/jpeg" || file.type === "image/png";
            if (!isJpgOrPng) {
              alert("You can only upload JPG/PNG file!");
              return Upload.LIST_IGNORE;
            }

            setUploading(true); // เริ่มแสดง loading
            // Simulate upload delay with setTimeout, replace with real upload logic
            setTimeout(() => {
              setNewVaccine({ ...newVaccine, image: file });
              setUploading(false); // หยุด loading
              setUploadComplete(true); // อัปโหลดเสร็จ
            }, 2000); // delay 2 วินาที

            return false;
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>อัพโหลดรูปภาพ (JPG/PNG)</Button>
        </Upload>
        {/* แสดง loading หรือติ๊กถูกตามสถานะ */}
        {uploading && <Spin style={{ marginTop: 16 }} />} {/* Loading */}
        {uploadComplete && !uploading && (
          <CheckCircleOutlined
            style={{ color: "green", fontSize: 24, marginTop: 16 }}
          />
        )}{" "}
        {/* ติ๊กถูก */}
      </Modal>

      {/* Modal สำหรับแก้ไขวัคซีน */}
      {editVaccine && (
        <Modal
          title="แก้ไขวัคซีน"
          visible={isEditModalVisible}
          onOk={handleSaveEdit}
          onCancel={() => setIsEditModalVisible(false)}
          okText="บันทึก"
          cancelText="ยกเลิก"
        >
          <Input
            placeholder="ชื่อวัคซีน"
            value={editVaccine.vaccineName}
            onChange={(e) =>
              setEditVaccine({ ...editVaccine, vaccineName: e.target.value })
            }
            style={{ marginBottom: 16 }}
          />
          <Upload
            beforeUpload={(file) => {
              const isJpgOrPng =
                file.type === "image/jpeg" || file.type === "image/png";
              if (!isJpgOrPng) {
                alert("You can only upload JPG/PNG file!");
                return Upload.LIST_IGNORE;
              }
              setEditImage(file); // เก็บไฟล์รูปใหม่ใน state
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>อัพโหลดรูปภาพ (JPG/PNG)</Button>
          </Upload>
          {editVaccine.vaccineImage && (
            <img
              src={editVaccine.vaccineImage}
              alt="vaccine"
              style={{
                width: "100px",
                height: "70px",
                objectFit: "cover",
                marginTop: 16,
              }}
            />
          )}
        </Modal>
      )}
    </div>
  );
}
