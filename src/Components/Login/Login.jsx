import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth"; // import Firebase authentication
import { auth } from "../../firebase/firebase"; // นำเข้า auth จาก Firebase
import useStore from "../../store"; // import useStore

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [bgSize, setBgSize] = useState("");
  const [bgPosition, setBgPosition] = useState("");
  const email = useStore((state) => state.email);
  const password = useStore((state) => state.password);
  const setEmail = useStore((state) => state.setEmail);
  const setPassword = useStore((state) => state.setPassword);
  const settoken = useStore((state) => state.settoken);
  const token = useStore((state) => state.token);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setBgSize("175% 100%");
        setBgPosition("38% 47%");
      } else {
        setBgSize("112% 144%");
        setBgPosition("15% 47%");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to set initial value

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const checkLogin = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ดึง token ของผู้ใช้
      const tokenResult = await userCredential.user.getIdTokenResult();
      const token = tokenResult.token;

      // บันทึก token ลงใน localStorage
      localStorage.setItem("token", token);
      console.log("Token ถูกบันทึกลงใน localStorage:", token);
      const userId = userCredential.user.uid;
      // ตรวจสอบว่าเป็น admin หรือไม่
      if (userId === "XQisYFDzRueY6uwH5bUmuPIeUVI2") {
        navigate("/pageAdmin"); // ถ้าเป็นแอดมินให้ไปที่หน้า Admin
      } else {
        navigate("/member"); // ถ้าไม่ใช่แอดมินให้ไปที่หน้า Member
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ:", error);
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div
      className="relative h-screen grid place-items-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: "url('image/1.webp')",
        backgroundSize: bgSize,
        backgroundPosition: bgPosition,
      }}
    >
      <form
        className="relative bg-opacity-70 bg-white backdrop-blur-lg border border-gray-200 p-10 rounded-lg shadow-lg max-w-lg w-full"
        onSubmit={checkLogin} // ใช้ checkLogin เมื่อผู้ใช้กดปุ่ม Login
      >
        <h1 className="text-center text-4xl font-semibold text-gray-800 mb-6">
          Welcome
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Sign in to your account
        </p>

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
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-sm text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-8 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <a href="#" className="text-blue-500 font-medium hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
