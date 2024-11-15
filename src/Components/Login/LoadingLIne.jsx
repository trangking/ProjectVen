import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import liff from "@line/liff";
import { db } from "../../firebase/firebase";
import { message } from "antd";

export default function LoadingLine() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const initializeLiff = async () => {
    try {
      await liff.init({ liffId: "2006562622-GXpWdRRO" });
      if (!liff.isLoggedIn()) {
        liff.login(); // ถ้ายังไม่ได้ล็อกอิน จะเข้าสู่หน้า login ของ LINE
      } else {
        const profile = await liff.getProfile();
        const userId = profile.userId;
        await findUserInFirebase(userId);
        const token = liff.getIDToken();
        localStorage.setItem("token", token);
      }
    } catch (error) {
      console.error("Error initializing LIFF:", error);
      setLoading(false);
    }
  };

  const findUserInFirebase = async (userId) => {
    try {
      // ใช้ collection สำหรับการ query คอลเลกชัน "owners"
      const ownersCollectionRef = collection(db, "owners");

      // Query คอลเลกชัน "owners" เพื่อค้นหา userId ใน accountLine.userId
      const q = query(
        ownersCollectionRef,
        where("accountLine.userId", "==", userId)
      );

      // ใช้ getDocs กับ query เพื่อนำเอกสารที่ตรงกับเงื่อนไขออกมา
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          localStorage.setItem("Id", doc.id);
          // นำไปที่หน้า member หรือดำเนินการกับข้อมูลของผู้ใช้
          navigate("/member");
        });
      } else {
                // ส่งกลับหน้าเดิม
        navigate("/");
        localStorage.clear();
        message.error("ท่านยังไม่ได้ลงทะเบียน Line กรุณาติดต่อพนักงาน");
      }
    } catch (error) {
      console.error("ข้อผิดพลาดในการดึงข้อมูลผู้ใช้จาก Firebase:", error);
    }
  };

  useEffect(() => {
    initializeLiff();
  }, []);

  return (
    <>
      {loading ? (
        <div className="loading-screen">
          <div className="loading-logo">
            <img src="/unnamed.gif" alt="Logo" />
          </div>
          {/* <div className="loading-spinner"></div> */}
          <p className="loading-text">กำลังโหลดข้อมูล . . . กรุณารอสักครู่</p>
        </div>
      ) : (
        <div>เข้าสู่ระบบเรียบร้อย</div>
      )}
    </>
  );
}
