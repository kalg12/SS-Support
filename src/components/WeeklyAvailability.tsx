// src/components/WeeklyAvailability.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "@/store/authSlice";
import Swal from "sweetalert2";
import EditScheduleModal from "@/components/EditScheduleModal";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Schedule {
  id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
}

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const WeeklyAvailability = () => {
  const token = useSelector(selectToken);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDays, setNewDays] = useState<string[]>([]);
  const [newStartTime, setNewStartTime] = useState<Date | null>(null);
  const [newEndTime, setNewEndTime] = useState<Date | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("/api/horarios/fixed", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
  }, [token]);

  const handleEditClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleUpdateSchedule = (updatedSchedule: Schedule) => {
    const updatedSchedules = schedules.map((sch) =>
      sch.id === updatedSchedule.id ? updatedSchedule : sch
    );
    setSchedules(updatedSchedules);
    setIsModalOpen(false);
  };

  const handleDayChange = (day: string) => {
    setNewDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleAddSchedule = async () => {
    if (newDays.length === 0 || !newStartTime || !newEndTime) {
      Swal.fire({
        title: "Error",
        text: "Debes ingresar al menos un día, una hora de inicio y una hora de fin",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const newSchedule = {
      days: newDays,
      startTime: newStartTime.toTimeString().split(" ")[0],
      endTime: newEndTime.toTimeString().split(" ")[0],
    };

    try {
      const response = await fetch("/api/horarios/fixed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSchedule),
      });
      const data = await response.json();

      if (data.success) {
        const addedSchedules = newDays.map((day) => ({
          id: Date.now(), // This should be replaced with the actual id from the backend
          dia_semana: day,
          hora_inicio: newSchedule.startTime,
          hora_fin: newSchedule.endTime,
        }));
        setSchedules((prevSchedules) => [...prevSchedules, ...addedSchedules]);
        setNewDays([]);
        setNewStartTime(null);
        setNewEndTime(null);
        Swal.fire({
          title: "Success",
          text: "Horario agregado correctamente",
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
      console.error("Error adding schedule:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al agregar el horario",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Horario Semanal</h2>
      <div className="grid grid-cols-5 gap-4 mb-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="p-4 bg-white shadow-md rounded">
            <h3 className="text-xl font-bold mb-2">{day}</h3>
            {schedules
              .filter((schedule) => schedule.dia_semana === day)
              .map((schedule) => (
                <div key={schedule.id} className="mb-2">
                  <p>
                    {schedule.hora_inicio} - {schedule.hora_fin}
                  </p>
                  <Button
                    onClick={() => handleEditClick(schedule)}
                    className="mt-2"
                  >
                    Editar
                  </Button>
                </div>
              ))}
          </div>
        ))}
      </div>
      <div className="bg-white shadow-md rounded p-4 mb-6">
        <h3 className="text-xl font-bold mb-4">Añadir Horarios</h3>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => handleDayChange(day)}
              className={`px-4 py-2 border rounded ${
                newDays.includes(day) ? "bg-blue-500 text-white" : ""
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <DatePicker
            selected={newStartTime}
            onChange={(time) => setNewStartTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption="Inicio"
            dateFormat="HH:mm"
            minTime={new Date("1970-01-01T13:00:00Z")}
            maxTime={new Date("1970-01-01T21:00:00Z")}
            className="w-1/3 px-3 py-2 border rounded"
          />
          <DatePicker
            selected={newEndTime}
            onChange={(time) => setNewEndTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption="Fin"
            dateFormat="HH:mm"
            minTime={new Date("1970-01-01T13:00:00Z")}
            maxTime={new Date("1970-01-01T21:00:00Z")}
            className="w-1/3 px-3 py-2 border rounded"
          />
          <Button
            className="bg-green-500 hover:bg-green-700"
            onClick={handleAddSchedule}
          >
            Añadir
          </Button>
        </div>
      </div>
      {selectedSchedule && isModalOpen && (
        <EditScheduleModal
          schedule={selectedSchedule}
          onSave={handleUpdateSchedule}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default WeeklyAvailability;
