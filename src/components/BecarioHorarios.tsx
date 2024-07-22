"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "@/store/authSlice";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Schedule {
  id: number | null;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
}

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const BecarioHorarios = () => {
  const token = useSelector(selectToken);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [token]);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/horarios/fixed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ schedules }),
      });
      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: "Success",
          text: "Schedules updated successfully!",
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
      console.error("Error saving schedules:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while saving the schedules",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleTimeChange = (
    time: Date,
    day: string,
    type: "hora_inicio" | "hora_fin"
  ) => {
    setSchedules((prevSchedules) =>
      prevSchedules.map((schedule) =>
        schedule.dia_semana === day
          ? {
              ...schedule,
              [type]: time.toTimeString().split(" ")[0],
            }
          : schedule
      )
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Horarios</h2>
        <div className="grid grid-cols-1 gap-6">
          {daysOfWeek.map((day) => {
            const schedule = schedules.find((s) => s.dia_semana === day) || {
              id: null,
              dia_semana: day,
              hora_inicio: "",
              hora_fin: "",
            };
            return (
              <div key={day} className="mb-4">
                <Label className="block text-gray-700">{day}</Label>
                <div className="flex space-x-4 items-center">
                  <DatePicker
                    selected={
                      schedule.hora_inicio
                        ? new Date(`1970-01-01T${schedule.hora_inicio}Z`)
                        : null
                    }
                    onChange={(time) =>
                      handleTimeChange(time as Date, day, "hora_inicio")
                    }
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Inicio"
                    dateFormat="HH:mm"
                    className="w-1/2 px-3 py-2 border rounded"
                  />
                  <DatePicker
                    selected={
                      schedule.hora_fin
                        ? new Date(`1970-01-01T${schedule.hora_fin}Z`)
                        : null
                    }
                    onChange={(time) =>
                      handleTimeChange(time as Date, day, "hora_fin")
                    }
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Fin"
                    dateFormat="HH:mm"
                    className="w-1/2 px-3 py-2 border rounded"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <Button
          onClick={handleSave}
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Guardar Horarios
        </Button>
      </div>
    </div>
  );
};

export default BecarioHorarios;
