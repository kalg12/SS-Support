"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "@/store/authSlice";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const daysOfWeek = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

type FixedSchedule = {
  id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
};

type AdHocSchedule = {
  id: number;
  fecha: string;
  disponible: boolean;
};

const BecarioHorarios = () => {
  const token = useSelector(selectToken);
  const [fixedSchedules, setFixedSchedules] = useState<FixedSchedule[]>([]);
  const [adHocSchedules, setAdHocSchedules] = useState<AdHocSchedule[]>([]);
  const [newSchedule, setNewSchedule] = useState({
    dia_semana: daysOfWeek[0],
    hora_inicio: "",
    hora_fin: "",
  });
  const [newAdHocSchedule, setNewAdHocSchedule] = useState({
    fecha: "",
    disponible: "true",
  });

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("/api/horarios", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setFixedSchedules(data.fixedSchedules);
          setAdHocSchedules(data.adHocSchedules);
        } else {
          Swal.fire({
            title: "Error",
            text: data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
        Swal.fire({
          title: "Error",
          text: "An error occurred while fetching the schedules",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchSchedules();
  }, [token]);

  const handleFixedScheduleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setNewSchedule({
      ...newSchedule,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdHocScheduleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewAdHocSchedule({
      ...newAdHocSchedule,
      [e.target.name]: e.target.value,
    });
  };

  const addFixedSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setFixedSchedules([...fixedSchedules, data.schedule]);
        setNewSchedule({
          dia_semana: daysOfWeek[0],
          hora_inicio: "",
          hora_fin: "",
        });
        Swal.fire({
          title: "Success",
          text: "Schedule added successfully!",
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
        text: "An error occurred while adding the schedule",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const addAdHocSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/horarios/ad-hoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newAdHocSchedule,
          disponible: newAdHocSchedule.disponible === "true",
        }),
      });
      const data = await response.json();

      if (data.success) {
        setAdHocSchedules([...adHocSchedules, data.schedule]);
        setNewAdHocSchedule({ fecha: "", disponible: "true" });
        Swal.fire({
          title: "Success",
          text: "Ad-hoc schedule added successfully!",
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
      console.error("Error adding ad-hoc schedule:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while adding the ad-hoc schedule",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-bold mb-6">Horarios Fijos</h2>
        <form onSubmit={addFixedSchedule}>
          <div className="mb-4">
            <Label htmlFor="dia_semana" className="block text-gray-700">
              Día de la Semana
            </Label>
            <select
              id="dia_semana"
              name="dia_semana"
              value={newSchedule.dia_semana}
              onChange={handleFixedScheduleChange}
              className="w-full px-3 py-2 border rounded"
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <Label htmlFor="hora_inicio" className="block text-gray-700">
              Hora de Inicio
            </Label>
            <Input
              id="hora_inicio"
              name="hora_inicio"
              type="time"
              value={newSchedule.hora_inicio}
              onChange={handleFixedScheduleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="hora_fin" className="block text-gray-700">
              Hora de Fin
            </Label>
            <Input
              id="hora_fin"
              name="hora_fin"
              type="time"
              value={newSchedule.hora_fin}
              onChange={handleFixedScheduleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Agregar Horario Fijo
          </Button>
        </form>
        <ul className="space-y-4 mt-6">
          {fixedSchedules.map((schedule) => (
            <li key={schedule.id} className="p-4 bg-gray-200 rounded shadow">
              <p className="text-lg font-bold">
                {schedule.dia_semana}: {schedule.hora_inicio} -{" "}
                {schedule.hora_fin}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Disponibilidad Ad-Hoc</h2>
        <form onSubmit={addAdHocSchedule}>
          <div className="mb-4">
            <Label htmlFor="fecha" className="block text-gray-700">
              Fecha y Hora
            </Label>
            <Input
              id="fecha"
              name="fecha"
              type="datetime-local"
              value={newAdHocSchedule.fecha}
              onChange={handleAdHocScheduleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="disponible" className="block text-gray-700">
              Disponible
            </Label>
            <select
              id="disponible"
              name="disponible"
              value={newAdHocSchedule.disponible}
              onChange={handleAdHocScheduleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Agregar Disponibilidad Ad-Hoc
          </Button>
        </form>
        <ul className="space-y-4 mt-6">
          {adHocSchedules.map((schedule) => (
            <li key={schedule.id} className="p-4 bg-gray-200 rounded shadow">
              <p className="text-lg font-bold">
                {new Date(schedule.fecha).toLocaleString()} -{" "}
                {schedule.disponible ? "Disponible" : "No Disponible"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BecarioHorarios;
