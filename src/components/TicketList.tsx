"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { selectToken } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const token = useSelector(selectToken);

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

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === id ? { ...ticket, estado: newStatus } : ticket
          )
        );
        Swal.fire({
          title: "Success",
          text: "Ticket updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating the ticket",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6">Tickets</h2>
        <Table>
          <TableCaption>Lista de tickets de soporte.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Semestre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead>Horario Agendado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>
                  {ticket.nombre} {ticket.apellido}
                </TableCell>
                <TableCell>{ticket.grupo}</TableCell>
                <TableCell>{ticket.semestre}</TableCell>
                <TableCell>{ticket.telefono_whatsapp}</TableCell>
                <TableCell>{ticket.descripcion}</TableCell>
                <TableCell>{ticket.estado}</TableCell>
                <TableCell>
                  {new Date(ticket.fecha_creacion).toLocaleString()}
                </TableCell>
                <TableCell>
                  {ticket.horario_agendado
                    ? new Date(ticket.horario_agendado).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <select
                    value={ticket.estado}
                    onChange={(e) =>
                      handleStatusChange(ticket.id, e.target.value)
                    }
                    className="form-select"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Resuelto">Resuelto</option>
                    <option value="Cerrado">Cerrado</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TicketList;
