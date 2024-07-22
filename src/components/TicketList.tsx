"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
  TableCaption,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: newStatus }),
      });
      const data = await response.json();

      if (data.success) {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === ticketId ? { ...ticket, estado: newStatus } : ticket
          )
        );
        Swal.fire({
          title: "Success",
          text: "Ticket status updated successfully!",
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
      console.error("Error updating ticket status:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating the ticket status",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Tickets</h2>
        <Table>
          <TableCaption>Lista de tickets de soporte</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Semestre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creación</TableHead>
              <TableHead>Actualización</TableHead>
              <TableHead>Horario Agendado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.nombre}</TableCell>
                <TableCell>{ticket.apellido}</TableCell>
                <TableCell>{ticket.grupo}</TableCell>
                <TableCell>{ticket.semestre}</TableCell>
                <TableCell>{ticket.telefono_whatsapp}</TableCell>
                <TableCell>{ticket.descripcion}</TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) =>
                      handleStatusChange(ticket.id, value)
                    }
                    defaultValue={ticket.estado}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="en proceso">En Proceso</SelectItem>
                      <SelectItem value="resuelto">Resuelto</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
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
                <TableCell>
                  <Button
                    onClick={() => handleStatusChange(ticket.id, "resuelto")}
                  >
                    Marcar como Resuelto
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={12}>
                Total: {tickets.length} tickets
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default TicketList;
