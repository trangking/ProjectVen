import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [bgSize, setBgSize] = useState("");
  const [bgposition, setbgposition] = useState("");
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setBgSize("175% 100%");
        setbgposition("38% 47%");
      } else {
        setBgSize("112% 144%");
        setbgposition("15% 47%");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to set initial value

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="login "
      style={{
        backgroundImage: "url('image/1.webp')",
        backgroundRepeat: "no-repeat",
        backgroundSize: bgSize,
        backgroundPosition: bgposition,
      }}
    >
      <form action="" className="login__form">
        <h1 className="login__title text-neutral-950">Login</h1>

        <div className="login__content">
          <div className="login__box">
            <i className="ri-user-3-line login__icon"></i>

            <div className="login__box-input">
              <input
                type="email"
                required
                className="login__input"
                id="login-email"
                placeholder=" "
              />
              <label
                htmlFor="login-email"
                className="login__label text-neutral-950"
              >
                Email
              </label>
            </div>
          </div>

          <div className="login__box">
            <i className="ri-lock-2-line login__icon"></i>

            <div className="login__box-input  text-neutral-950">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="login__input"
                id="login-pass"
                placeholder=" "
              />
              <label htmlFor="login-pass" className="login__label">
                Password
              </label>
              <i
                className={`ri-eye${
                  showPassword ? "" : "-off"
                }-line login__eye`}
                id="login-eye"
                onClick={togglePasswordVisibility}
              ></i>
            </div>
          </div>
        </div>

        <div className="login__check">
          <div className="login__check-group">
            <input
              type="checkbox"
              className="login__check-input"
              id="login-check"
            />
            <label htmlFor="login-check" className="login__check-label">
              Remember me
            </label>
          </div>

          <a href="#" className="login__forgot text-neutral-950">
            Forgot Password?
          </a>
        </div>
        <Link to="/member">
          <button type="submit" className="login__button">
            Login
          </button>
        </Link>

        <p className="login__register">
          Don't have an account? <a href="#">Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
