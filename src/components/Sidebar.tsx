"use client";

import { useState } from "react";
import { FaBars, FaTimes, FaUserPlus, FaTicketAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Link from "next/link";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button onClick={toggleSidebar} className="text-white bg-gray-900 p-2">
        <FaBars className="h-6 w-6" />
      </button>
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
            <FaUserPlus className="mr-2" /> Dashboard
          </Link>
          <Link
            href="/dashboard/register"
            className="flex items-center py-2.5 px-4 text-white hover:bg-gray-700 transition duration-200"
          >
            <FaUserPlus className="mr-2" /> Agregar Usuario
          </Link>
          <Link
            href="/tickets"
            className="flex items-center py-2.5 px-4 text-white hover:bg-gray-700 transition duration-200"
          >
            <FaTicketAlt className="mr-2" /> Tickets
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
