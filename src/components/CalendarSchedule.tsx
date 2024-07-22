"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";

interface Disponibilidad {
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
}

const CalendarSchedule = ({
  onSelect,
}: {
  onSelect: (date: Date, disponibilidad: Disponibilidad[]) => void;
}) => {
  const [disponibilidad, setDisponibilidad] = useState<{
    [key: string]: Disponibilidad[];
  }>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchDisponibilidad = async () => {
      try {
        const response = await fetch("/api/tickets/horarios");
        const data = await response.json();
        if (data.success) {
          const formattedDisponibilidad: { [key: string]: Disponibilidad[] } =
            {};

          // Format fixed schedules
          data.horariosFijos.forEach((item: any) => {
            if (!formattedDisponibilidad[item.dia_semana]) {
              formattedDisponibilidad[item.dia_semana] = [];
            }
            formattedDisponibilidad[item.dia_semana].push({
              dia_semana: item.dia_semana,
              hora_inicio: item.hora_inicio,
              hora_fin: item.hora_fin,
            });
          });

          // Format ad hoc availability
          data.disponibilidadAdHoc.forEach((item: any) => {
            const dateKey = new Date(item.fecha).toISOString().split("T")[0];
            if (!formattedDisponibilidad[dateKey]) {
              formattedDisponibilidad[dateKey] = [];
            }
            formattedDisponibilidad[dateKey].push({
              dia_semana: dateKey,
              hora_inicio: item.hora_inicio,
              hora_fin: item.hora_fin,
            });
          });

          setDisponibilidad(formattedDisponibilidad);
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "An error occurred while fetching availability",
          "error"
        );
      }
    };

    fetchDisponibilidad();
  }, []);

  const handleDateChange = (value: Date | Date[]) => {
    const selected = Array.isArray(value) ? value[0] : value;
    setSelectedDate(selected);

    const dayOfWeek = selected.toLocaleDateString("en-US", { weekday: "long" });
    const formattedDate = selected.toISOString().split("T")[0];

    const availableSlots =
      disponibilidad[dayOfWeek] || disponibilidad[formattedDate] || [];

    onSelect(selected, availableSlots);
  };

  return (
    <div>
      <Calendar
        onChange={(value) => handleDateChange(value as Date | Date[])}
        value={selectedDate}
      />
    </div>
  );
};

export default CalendarSchedule;
