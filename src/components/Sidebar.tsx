"use client";

import { FaUserPlus, FaTicketAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="fixed inset-y-0 left-0 bg-slate-900 w-64 flex flex-col">
      <nav className="mt-10 flex flex-col space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center py-2.5 px-4 text-white hover:bg-gray-700 transition duration-200"
        >
          <MdDashboard className="mr-2" /> Dashboard
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
  );
};

export default Sidebar;
