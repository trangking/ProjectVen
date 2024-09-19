import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [bgSize, setBgSize] = useState("");
  const [bgPosition, setBgPosition] = useState("");
  const [user, setuser] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

  const checkLogin = () => {
    if (user === "admin") {
      navigate("/pageAdmin");
    } else {
      navigate("/member");
    }
  };

  return (
    <div
      className="relative h-screen grid place-items-center bg-no-repeat"
      style={{
        backgroundImage: "url('image/1.webp')",
        backgroundSize: bgSize,
        backgroundPosition: bgPosition,
      }}
    >
      <form className="relative bg-opacity-10 bg-gray-900 backdrop-blur-lg border-2 border-white mx-6 p-8 rounded-lg md:w-[432px]">
        <h1 className="text-center text-2xl font-medium text-neutral-900 mb-8">
          Login
        </h1>

        <div className="grid gap-6 mb-6">
          <div className="flex items-center border-b-2 border-white gap-3">
            <i className="ri-user-3-line text-xl"></i>
            <div className="relative w-full">
              <input
                type="email"
                required
                className="w-full bg-transparent py-2 focus:outline-none placeholder-transparent peer"
                id="login-email"
                onChange={(event) => setuser(event.target.value)}
              />
              <label
                htmlFor="login-email"
                className="absolute left-0 top-3 text-neutral-900 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-12px] peer-focus:text-sm transition-all duration-300"
              >
                Email
              </label>
            </div>
          </div>

          <div className="flex items-center border-b-2 border-white gap-3">
            <i className="ri-lock-2-line text-xl"></i>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-transparent py-2 focus:outline-none placeholder-transparent peer"
                id="login-pass"
              />
              <label
                htmlFor="login-pass"
                className="absolute left-0 top-3 text-neutral-900 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[-12px] peer-focus:text-sm transition-all duration-300"
              >
                Password
              </label>
              <i
                className={`ri-eye${
                  showPassword ? "" : "-off"
                }-line absolute right-0 top-4 cursor-pointer`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm text-neutral-900">Remember me</span>
          </label>

          <a href="#" className="text-sm text-neutral-900 hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          onClick={checkLogin}
          className="w-full py-3 bg-white text-red-600 font-medium rounded-lg mb-6"
        >
          Login
        </button>

        <p className="text-center">
          Don't have an account?{" "}
          <a href="#" className="text-white font-medium hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
