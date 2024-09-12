// App.js
import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

const App = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      {location.pathname !== "/login" && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {location.pathname !== "/login" && <Footer />}
    </div>
  );
};

export default App;
