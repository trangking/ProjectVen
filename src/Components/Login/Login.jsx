import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth"; // import Firebase authentication
import { auth, db } from "../../firebase/firebase"; // นำเข้า auth จาก Firebase
import useStore from "../../store"; // import useStore
import { doc, getDoc } from "firebase/firestore";
import { Button } from "antd";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const email = useStore((state) => state.email);
  const password = useStore((state) => state.password);
  const setEmail = useStore((state) => state.setEmail);
  const setPassword = useStore((state) => state.setPassword);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const checkLogin = async (event) => {
    event.preventDefault();
    try {
      // Authenticate user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      if (userId === "LR4qbzCjoOcNZ0fmc6j1WjKHI9D2") {
        const tokenResult = await userCredential.user.getIdTokenResult();
        const token = tokenResult.token;
        localStorage.setItem("token", token);

        localStorage.setItem("Id", userId);

        navigate("/pageAdmin"); // ถ้าเป็นแอดมินให้ไปที่หน้า Admin
      } else {
        const ownerDocRef = doc(db, "owners", userId);
        const doctorDocRef = doc(db, "doctorsVen", userId);

        const ownerDoc = await getDoc(ownerDocRef);
        const doctorDoc = await getDoc(doctorDocRef);

        if (ownerDoc.exists()) {
          // User is an owner
          const ownerData = ownerDoc.data();
          if (ownerData.roleType === "user") {
            navigate("/member"); // Redirect to Owner Dashboard
          }
        } else if (doctorDoc.exists()) {
          // User is a doctor
          const doctorData = doctorDoc.data();
          if (doctorData.roleType === "doctor") {
            navigate("/doctorPage"); // Redirect to Doctor Dashboard
          }
        } else {
          // If no matching document is found, handle the case as needed
          console.error("User document not found in either collection.");
          alert("User role not identified. Please contact support.");
        }
        const tokenResult = await userCredential.user.getIdTokenResult();
        const token = tokenResult.token;

        // บันทึก token ลงใน localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("Id", userId);
      }
      // Check both collections for the user’s document
    } catch (error) {
      console.error("Error during login:", error);
      alert("Incorrect email or password");
    }
  };

  return (
    <div className="relative h-screen grid place-items-center bg-no-repeat bg-cover">
      <form
        className="relative bg-opacity-70 bg-white backdrop-blur-lg border border-gray-200 p-10 rounded-lg shadow-lg max-w-lg w-full"
        onSubmit={checkLogin} // ใช้ checkLogin เมื่อผู้ใช้กดปุ่ม Login
      >
        <h1 className="text-center text-4xl font-semibold text-gray-800 mb-6">
          สมุดวัคซีนสัตว์เลี้ยงออนไลร์
        </h1>
        <p className="text-center text-gray-600 mb-10">กรุณาลงชื่อเข้าระบบ</p>

        <div className="space-y-6">
          {/* ช่องกรอกอีเมล */}
          <div className="relative">
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="Email"
              id="login-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)} // อัปเดต email ใน useStore
            />
            <i className="ri-mail-line absolute right-3 top-3 text-gray-400"></i>
          </div>

          {/* ช่องกรอกรหัสผ่าน */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="Password"
              id="login-pass"
              value={password}
              onChange={(event) => setPassword(event.target.value)} // อัปเดต password ใน useStore
            />
            <i
              className={`ri-eye${
                showPassword ? "" : "-off"
              }-line absolute right-3 top-3 text-gray-400 cursor-pointer`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm text-gray-600">จดจำฉัน</span>
          </label>

          {/* <a href="#" className="text-sm text-blue-500 hover:underline">
            Forgot Password?
          </a> */}
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-8 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
        >
          เข้าสู่ระบบ
        </button>
        <Link to={"/loading"}>
          <Button
            className="w-full py-3 mt-8  bg-[#51e151] hover:bg-[#00a700] text-white font-semibold text-lg transition-all duration-300"
            size="large"
            // bg-[#51e151] hover:bg-[#00a700] text-white font-semibold text-lg transition-all duration-300
          >
            <img
              src="/line_icon.ico"
              alt="LINE Icon"
              className="w-6 h-6 mr-3"
            />
            เข้าสู่ระบบด้วย LINE
          </Button>
        </Link>
      </form>
    </div>
  );
}

export default Login;
