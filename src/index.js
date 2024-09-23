// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import Login from "./Components/Login/Login";
import Member from "./Components/Member/Member";
import AddPet from "./Components/Member/AddPet";
import EditPet from "./Components/Member/EditPet";
import Page from "./Components/Admin/page";
import AdminDashboard from "./Components/Admin/home/AdminDashboard";
import PetOwners from "./Components/Admin/petOwners";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App />}>
          <Route path="/member" element={<Member />} />
          <Route path="/addpet" element={<AddPet />} />
          <Route path="/editpet" element={<EditPet />} />
        </Route>
        <Route path="/pageAdmin" element={<Page />}>
          <Route path="Dashboard" element={<AdminDashboard />} />
          <Route path="PetOwners" element={<PetOwners />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
