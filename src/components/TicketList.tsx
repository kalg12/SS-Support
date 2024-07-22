"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
        <Table>
          <TableCaption>Lista de tickets de soporte.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Semestre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creación</TableHead>
              <TableHead>Actualización</TableHead>
              <TableHead>Horario Agendado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.nombre}</TableCell>
                <TableCell>{ticket.apellido}</TableCell>
                <TableCell>{ticket.grupo}</TableCell>
                <TableCell>{ticket.semestre}</TableCell>
                <TableCell>{ticket.telefono_whatsapp}</TableCell>
                <TableCell>{ticket.descripcion}</TableCell>
                <TableCell>{ticket.estado}</TableCell>
                <TableCell>
                  {new Date(ticket.fecha_creacion).toLocaleString()}
                </TableCell>
                <TableCell>
                  {ticket.fecha_actualizacion
                    ? new Date(ticket.fecha_actualizacion).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {ticket.horario_agendado
                    ? new Date(ticket.horario_agendado).toLocaleString()
                    : "N/A"}
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
