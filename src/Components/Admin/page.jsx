import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  CalendarIcon,
  UserGroupIcon,
  CogIcon,
  BellIcon,
} from "@heroicons/react/outline";
import { Outlet } from "react-router-dom";

// Sidebar Links
const sidebarLinks = [
  {
    name: "Appointments",
    path: "Dashboard",
    icon: <CalendarIcon className="h-6 w-6" />,
  },
  {
    name: "Pet Owners",
    path: "PetOwners",
    icon: <UserGroupIcon className="h-6 w-6" />,
  },
  {
    name: "Notifications",
    path: "/admin/notifications",
    icon: <BellIcon className="h-6 w-6" />,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: <CogIcon className="h-6 w-6" />,
  },
];

// Main Page Component
export default function Page() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current path
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [petName, setPetName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  useEffect(() => {
    // If the current path is exactly '/pageAdmin', redirect to '/pageAdmin/Dashboard'
    if (location.pathname === "/pageAdmin") {
      navigate("/pageAdmin/Dashboard");
    }
  }, [location, navigate]);

  const handleAddAppointment = () => {
    // Log the appointment details to the console
    console.log({
      ownerName,
      petName,
      appointmentDate,
      appointmentTime,
    });
    // Reset the form and close the modal
    setIsModalOpen(false);
    setOwnerName("");
    setPetName("");
    setAppointmentDate("");
    setAppointmentTime("");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <ul>
            {sidebarLinks.map((link) => (
              <li key={link.name} className="mb-4">
                <Link
                  to={link.path}
                  className="flex items-center px-6 py-2 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition duration-300"
                >
                  {link.icon}
                  <span className="ml-3">{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Topbar */}
        <header className="bg-white shadow-md p-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Appointments Overview
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)} // Open modal
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Add New Appointment
            </button>
            <img
              src="https://i.etsystatic.com/12346156/r/il/4ada00/4392713417/il_570xN.4392713417_z7v3.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Modal for adding new appointment */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                Add New Appointment
              </h2>

              {/* Owner's Name */}
              <label className="block mb-2">Owner's Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="mb-4 p-2 border rounded-lg w-full"
                placeholder="Enter owner's name"
              />

              {/* Pet's Name */}
              <label className="block mb-2">Pet's Name</label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="mb-4 p-2 border rounded-lg w-full"
                placeholder="Enter pet's name"
              />

              {/* Appointment Date */}
              <label className="block mb-2">Appointment Date</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="mb-4 p-2 border rounded-lg w-full"
              />

              {/* Appointment Time */}
              <label className="block mb-2">Appointment Time</label>
              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="mb-4 p-2 border rounded-lg w-full"
              />

              {/* Save and Cancel Buttons */}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)} // Close modal
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAppointment} // Save appointment
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Outlet for child routes */}
        <Outlet />
      </div>
    </div>
  );
}
