"use client";

import { useState } from "react";
import { FaUserPlus, FaTicketAlt, FaCalendarAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectRole } from "@/store/authSlice";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const role = useSelector(selectRole);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out bg-gray-800 w-64`}
    >
      <div className="flex items-center justify-between p-4 bg-gray-900">
        <h1 className="text-white text-2xl font-bold">Dashboard</h1>
        <button onClick={toggleSidebar} className="text-white">
          <MdDashboard className="h-6 w-6" />
        </button>
      </div>
      <nav className="mt-10">
        <Link
          href="/dashboard"
          className="flex items-center py-2.5 px-4 text-white hover:bg-gray-700 transition duration-200"
        >
          <MdDashboard className="mr-2" /> Dashboard
        </Link>
        {(role === "admin" || role === "superadmin") && (
          <>
            <Link
              href="/dashboard/register"
              className="flex items-center py-2.5 px-4 text-white hover:bg-gray-700 transition duration-200"
            >
              <FaUserPlus className="mr-2" /> Agregar Usuario
            </Link>
            <Link
              href="/dashboard/tickets"
              className="flex items-center py-2.5 px-4 text-white hover:bg-gray-700 transition duration-200"
            >
              <FaTicketAlt className="mr-2" /> Tickets
            </Link>
          </>
        )}
        {role === "becario" && (
          <>
            <Link
              href="/dasboard/servicio-social/horarios"
              className="flex items-center py-2.5 px-4 text-white hover:bg-gray-700 transition duration-200"
            >
              <FaCalendarAlt className="mr-2" /> Horarios
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
