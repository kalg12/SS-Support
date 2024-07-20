"use client";

import { useGetTicketsQuery } from "@/services/ticketApi";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
}

const TicketList = () => {
  const {
    data: tickets = [],
    error,
    isLoading,
  } = useGetTicketsQuery(undefined);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    Swal.fire({
      title: "Logged Out",
      text: "You have been logged out successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading tickets</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ticket List</h1>
      <Button onClick={handleLogout} className="mb-4">
        Logout
      </Button>
      <ul>
        {tickets.map((ticket: Ticket) => (
          <li key={ticket.id} className="mb-2">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold">{ticket.title}</h2>
              <p>{ticket.description}</p>
              <p>Status: {ticket.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketList;
