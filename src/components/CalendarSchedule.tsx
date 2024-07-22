// src/components/CalendarSchedule.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, SlotInfo } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Swal from "sweetalert2";

const localizer = momentLocalizer(moment);

interface Schedule {
  id: number;
  becario_id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
}

const daysOfWeekMap: { [key: string]: number } = {
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Jueves: 4,
  Viernes: 5,
};

const CalendarSchedule = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("/api/horarios/fixed", {
          method: "GET",
        });
        const data = await response.json();
        if (data.success) {
          setSchedules(data.horarios);
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "An error occurred while fetching the schedules",
          "error"
        );
      }
    };

    fetchSchedules();
  }, []);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
  };

  const handleCreateTicket = async () => {
    if (!selectedSlot) {
      return;
    }

    const newTicket = {
      estudiante_id: 1, // Debes obtener el ID del estudiante actual
      descripcion: "Descripción del ticket",
      estado: "Pendiente",
      becario_id: selectedSlot.resourceId, // Ajusta esto según tu lógica de asignación de becarios
      horario_agendado: selectedSlot.start,
    };

    try {
      const response = await fetch("/api/tickets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTicket),
      });
      const data = await response.json();

      if (data.success) {
        Swal.fire("Success", "Ticket created successfully!", "success");
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "An error occurred while creating the ticket",
        "error"
      );
    }
  };

  const events = schedules
    .filter(
      (schedule) =>
        schedule.dia_semana && schedule.hora_inicio && schedule.hora_fin
    ) // Filtrar horarios válidos
    .map((schedule) => {
      const [startHour, startMinute] = schedule.hora_inicio
        .split(":")
        .map(Number);
      const [endHour, endMinute] = schedule.hora_fin.split(":").map(Number);
      const dayOfWeek = daysOfWeekMap[schedule.dia_semana];

      const now = new Date();
      const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + ((dayOfWeek - now.getDay() + 7) % 7),
        startHour,
        startMinute
      );
      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + ((dayOfWeek - now.getDay() + 7) % 7),
        endHour,
        endMinute
      );

      return {
        id: schedule.id,
        title: `Horario de ${schedule.dia_semana} (${startHour}:${startMinute} - ${endHour}:${endMinute})`,
        start,
        end,
        resourceId: schedule.becario_id,
      };
    });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Seleccionar Horario</h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          style={{ height: 500 }}
          views={["week", "day"]}
          step={30}
          timeslots={2}
        />
        {selectedSlot && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Horario Seleccionado</h3>
            <p>{`Inicio: ${moment(selectedSlot.start).format(
              "HH:mm"
            )}, Fin: ${moment(selectedSlot.end).format("HH:mm")}`}</p>
            <button
              onClick={handleCreateTicket}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Agendar Horario
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarSchedule;
