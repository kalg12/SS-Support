"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";

interface Ticket {
  id: number;
  nombre: string;
  apellido: string;
  grupo: string;
  semestre: number;
  telefono_whatsapp: string;
  descripcion: string;
  estado: string;
  fecha_creacion: string;
  fecha_actualizacion?: string;
  horario_agendado?: string;
}

const TicketList = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/tickets/list");
        const data = await response.json();

        if (data.success) {
          setTickets(data.tickets);
        } else {
          Swal.fire({
            title: "Error",
            text: data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
        Swal.fire({
          title: "Error",
          text: "An error occurred while fetching the tickets",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Tickets</h2>
        <ul className="space-y-4">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="p-4 bg-gray-200 rounded shadow">
              <p className="text-lg font-bold">
                {ticket.nombre} {ticket.apellido}
              </p>
              <p className="text-sm">
                {ticket.grupo} - Semestre {ticket.semestre}
              </p>
              <p className="text-sm">{ticket.telefono_whatsapp}</p>
              <p className="text-sm">{ticket.descripcion}</p>
              <p className="text-sm text-gray-500">
                {new Date(ticket.fecha_creacion).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TicketList;
