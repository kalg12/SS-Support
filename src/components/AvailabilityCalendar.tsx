import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Swal from "sweetalert2";

interface Schedule {
  id: number;
  becario_id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
}

interface AvailabilityCalendarProps {
  onSelectSlot: (date: Date, time: string) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  onSelectSlot,
}) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("/api/tickets/availability");
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

  const handleDateChange = (value: Date | Date[] | null) => {
    if (value && !(value instanceof Array)) {
      setSelectedDate(value);
    }
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      onSelectSlot(selectedDate, time);
    } else {
      Swal.fire("Error", "Please select a date first", "error");
    }
  };

  const renderTimeSlots = () => {
    if (!selectedDate) return null;

    const dayOfWeek = selectedDate.toLocaleDateString("es-MX", {
      weekday: "long",
    });
    const slots = schedules.filter(
      (schedule) =>
        schedule.dia_semana.toLowerCase() === dayOfWeek.toLowerCase()
    );

    return slots.map((slot) => (
      <div
        key={slot.id}
        className="time-slot"
        onClick={() =>
          handleTimeSelect(`${slot.hora_inicio} - ${slot.hora_fin}`)
        }
      >
        {slot.hora_inicio} - {slot.hora_fin}
      </div>
    ));
  };

  return (
    <div className="availability-calendar">
      <Calendar
        onChange={(value) => handleDateChange(value as Date | Date[] | null)}
      />
      <div className="time-slots">{renderTimeSlots()}</div>
    </div>
  );
};

export default AvailabilityCalendar;
