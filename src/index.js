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
import PageManage from "./Components/Admin/home/PageManage";
import ManageAnimals from "./Components/Admin/home/MenuManage/ManageAnimals";
import ManageOwners from "./Components/Admin/home/MenuManage/ManageOwners";
import ManageDoctorsVets from "./Components/Admin/home/MenuManage/ManageDoctorsVets";
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
          <Route path="PageManage" element={<PageManage />}>
            <Route path="ManageAnimals" element={<ManageAnimals />} />
            <Route path="ManageOwners" element={<ManageOwners />} />
            <Route path="ManageDoctorsVets" element={<ManageDoctorsVets />} />

          </Route>
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
