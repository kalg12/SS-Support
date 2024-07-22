import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, SlotInfo } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const locales = {
  es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type Event = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
};

const MyCalendar = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const handleSelectSlot = async (slotInfo: SlotInfo) => {
    const { start, end } = slotInfo;

    const result = await Swal.fire({
      title: "Agregar Horario",
      input: "text",
      inputLabel: "Título",
      inputPlaceholder: "Ingresa el título del horario",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      const newEvent = {
        title: result.value || "Nuevo Horario",
        start,
        end,
      };
      setEvents([...events, newEvent]);
    }
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        views={["week"]}
        step={60}
        timeslots={1}
        defaultView="week"
        min={new Date(2021, 1, 1, 7, 0, 0)}
        max={new Date(2021, 1, 1, 15, 0, 0)}
      />
      <Button
        onClick={() => {
          console.log(events);
        }}
      >
        Guardar Horarios
      </Button>
    </div>
  );
};

export default MyCalendar;
