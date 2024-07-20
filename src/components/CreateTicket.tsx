"use client";

import { useState } from "react";
import { useCreateTicketMutation } from "@/services/ticketApi";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CreateTicket = () => {
  const [estudianteId, setEstudianteId] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [estado, setEstado] = useState<string>("open");
  const [becarioId, setBecarioId] = useState<string>("");
  const [horarioAgendado, setHorarioAgendado] = useState<string>("");
  const [createTicket] = useCreateTicketMutation();

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createTicket({
        estudiante_id: parseInt(estudianteId, 10),
        descripcion,
        estado,
        becario_id: parseInt(becarioId, 10),
        horario_agendado: horarioAgendado,
      }).unwrap();
      if (response.success) {
        Swal.fire({
          title: "Success",
          text: "Ticket created successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setEstudianteId("");
        setDescripcion("");
        setEstado("open");
        setBecarioId("");
        setHorarioAgendado("");
      } else {
        Swal.fire({
          title: "Error",
          text: response.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while creating the ticket",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create Ticket</h2>
        <form onSubmit={handleCreateTicket}>
          <div className="mb-4">
            <Label htmlFor="estudiante_id" className="block text-gray-700">
              Student ID
            </Label>
            <Input
              id="estudiante_id"
              type="text"
              value={estudianteId}
              onChange={(e) => setEstudianteId(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="descripcion" className="block text-gray-700">
              Description
            </Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="estado" className="block text-gray-700">
              Status
            </Label>
            <Input
              id="estado"
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="becario_id" className="block text-gray-700">
              Scholar ID
            </Label>
            <Input
              id="becario_id"
              type="text"
              value={becarioId}
              onChange={(e) => setBecarioId(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="horario_agendado" className="block text-gray-700">
              Scheduled Time
            </Label>
            <Input
              id="horario_agendado"
              type="datetime-local"
              value={horarioAgendado}
              onChange={(e) => setHorarioAgendado(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Create Ticket
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
