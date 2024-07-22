"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";

const grupos = [
  "Mecánica Naval",
  "Refrigeración",
  "Químico Biólogo",
  "Alimentos y Bebidas",
  "Recreaciones Acuáticas",
  "Acuacultura",
];

const semestres = [1, 2, 3, 4, 5, 6];

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    grupo: grupos[0],
    semestre: semestres[0],
    telefono_whatsapp: "",
    descripcion: "",
    horario_agendado: "",
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSlotSelect = (date: Date, time: string) => {
    const formattedDate = date.toISOString().split("T")[0];
    const horarioAgendado = `${formattedDate}T${time}:00`;
    setFormData((prevData) => ({
      ...prevData,
      horario_agendado: horarioAgendado,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/tickets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: "Success",
          text: "Ticket created successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/"); // Redirige a la página principal o a donde desees
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
        <h2 className="text-2xl font-bold mb-6">Crear Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="nombre" className="block text-gray-700">
              Nombre
            </Label>
            <Input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="apellido" className="block text-gray-700">
              Apellido
            </Label>
            <Input
              id="apellido"
              name="apellido"
              type="text"
              value={formData.apellido}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="grupo" className="block text-gray-700">
              Grupo
            </Label>
            <select
              id="grupo"
              name="grupo"
              value={formData.grupo}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              {grupos.map((grupo) => (
                <option key={grupo} value={grupo}>
                  {grupo}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <Label htmlFor="semestre" className="block text-gray-700">
              Semestre
            </Label>
            <select
              id="semestre"
              name="semestre"
              value={formData.semestre}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              {semestres.map((semestre) => (
                <option key={semestre} value={semestre}>
                  {semestre}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <Label htmlFor="telefono_whatsapp" className="block text-gray-700">
              Teléfono WhatsApp
            </Label>
            <Input
              id="telefono_whatsapp"
              name="telefono_whatsapp"
              type="text"
              value={formData.telefono_whatsapp}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="descripcion" className="block text-gray-700">
              Descripción
            </Label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            ></textarea>
          </div>
          <div className="mb-4">
            <Label htmlFor="horario_agendado" className="block text-gray-700">
              Horario Agendado
            </Label>
            <Input
              id="horario_agendado"
              name="horario_agendado"
              type="text"
              value={formData.horario_agendado}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              readOnly
            />
          </div>
          <AvailabilityCalendar onSelectSlot={handleSlotSelect} />
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Crear Ticket
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
