import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Label } from "@/components/ui/label";

interface Schedule {
  id: number;
  becario_id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
}

interface AvailabilitySelectorProps {
  onSelectSlot: (date: Date, time: string) => void;
}

const AvailabilitySelector: React.FC<AvailabilitySelectorProps> = ({
  onSelectSlot,
}) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("/api/tickets/availability");
        const data = await response.json();

        if (data.success) {
          setSchedules(data.horarios);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const dayOfWeek = selectedDate.toLocaleDateString("es-MX", {
        weekday: "long",
      });
      const slots = schedules.filter(
        (schedule) =>
          schedule.dia_semana.toLowerCase() === dayOfWeek.toLowerCase()
      );

      const newTimeSlots: string[] = [];
      slots.forEach((slot) => {
        const start = new Date(`1970-01-01T${slot.hora_inicio}`);
        const end = new Date(`1970-01-01T${slot.hora_fin}`);
        while (start < end) {
          newTimeSlots.push(start.toTimeString().split(" ")[0].slice(0, 5));
          start.setMinutes(start.getMinutes() + 30);
        }
      });

      setAvailableTimes(newTimeSlots);
    }
  }, [selectedDate, schedules]);

  const handleDateChange = (value: Date | Date[] | null) => {
    if (value && !(value instanceof Array)) {
      setSelectedDate(value);
    }
  };

  const handleTimeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedDate) {
      onSelectSlot(selectedDate, event.target.value);
    }
  };

  return (
    <div>
      <Label htmlFor="calendar" className="block text-gray-700 mb-2">
        Selecciona una fecha:
      </Label>
      <Calendar
        onChange={(value) => handleDateChange(value as Date | Date[] | null)}
      />
      {selectedDate && availableTimes.length > 0 && (
        <div className="mt-4">
          <Label htmlFor="time" className="block text-gray-700 mb-2">
            Selecciona un horario disponible para el día seleccionado:
          </Label>
          <select
            id="time"
            className="w-full px-3 py-2 border rounded"
            onChange={handleTimeSelect}
          >
            {availableTimes.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default AvailabilitySelector;
