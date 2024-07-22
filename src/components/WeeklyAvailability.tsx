import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

type Availability = {
  day: string;
  startTime: string;
  endTime: string;
};

const WeeklyAvailability = () => {
  const token = useSelector(selectToken);
  const [availability, setAvailability] = useState<Availability[]>(
    daysOfWeek.map((day) => ({
      day,
      startTime: "",
      endTime: "",
    }))
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    day: string,
    field: "startTime" | "endTime"
  ) => {
    const value = e.target.value;
    setAvailability((prevAvailability) => {
      const updatedAvailability = prevAvailability.map((a) =>
        a.day === day ? { ...a, [field]: value } : a
      );
      return updatedAvailability;
    });
  };

  const handleSave = async () => {
    const validSchedules = availability.filter(
      (schedule) => schedule.startTime && schedule.endTime
    );

    if (validSchedules.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Debes ingresar horarios válidos para al menos un día.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await fetch("/api/horarios/fixed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ schedules: validSchedules }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: "Success",
          text: "Horarios guardados exitosamente!",
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

  return (
    <div>
      {daysOfWeek.map((day) => (
        <div key={day} className="mb-4">
          <h3 className="text-lg font-bold">{day}</h3>
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor={`${day}-start`} className="block text-gray-700">
                Hora de Inicio
              </label>
              <input
                type="time"
                id={`${day}-start`}
                min="07:00"
                max="15:00"
                className="w-full px-3 py-2 border rounded"
                onChange={(e) => handleChange(e, day, "startTime")}
              />
            </div>
            <div>
              <label htmlFor={`${day}-end`} className="block text-gray-700">
                Hora de Fin
              </label>
              <input
                type="time"
                id={`${day}-end`}
                min="07:00"
                max="15:00"
                className="w-full px-3 py-2 border rounded"
                onChange={(e) => handleChange(e, day, "endTime")}
              />
            </div>
          </div>
        </div>
      ))}
      <Button onClick={handleSave} className="mt-4 bg-blue-500 text-white">
        Guardar Horarios
      </Button>
    </div>
  );
};

export default WeeklyAvailability;
