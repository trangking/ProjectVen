import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  UserGroupIcon,
  CogIcon,
  BellIcon,
} from "@heroicons/react/outline";
import { Outlet } from "react-router-dom";

const sidebarLinks = [
  {
    name: "Appointments",
    path: "Dashboard",
    icon: <CalendarIcon className="h-6 w-6" />,
  },
  {
    name: "Pet Owners",
    path: "/admin/pet-owners",
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

export default function Page() {
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
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
              Add New Appointment
            </button>
            <img
              src=" https://i.etsystatic.com/12346156/r/il/4ada00/4392713417/il_570xN.4392713417_z7v3.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
