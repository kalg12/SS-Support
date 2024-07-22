// src/components/EditScheduleModal.tsx
"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

interface Schedule {
  id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
}

interface EditScheduleModalProps {
  schedule: Schedule;
  onClose: () => void;
  onSave: (updatedSchedule: Schedule) => void;
}

const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  schedule,
  onClose,
  onSave,
}) => {
  const parseTimeString = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const [startTime, setStartTime] = useState<Date | null>(
    parseTimeString(schedule.hora_inicio)
  );
  const [endTime, setEndTime] = useState<Date | null>(
    parseTimeString(schedule.hora_fin)
  );

  const handleSave = async () => {
    if (!startTime || !endTime) {
      Swal.fire("Error", "Debe seleccionar una hora de inicio y fin.", "error");
      return;
    }

    const updatedSchedule = {
      ...schedule,
      hora_inicio: startTime.toTimeString().substring(0, 5),
      hora_fin: endTime.toTimeString().substring(0, 5),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/horarios/fixed/${schedule.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSchedule),
      });

      const data = await response.json();

      if (data.success) {
        onSave(updatedSchedule);
        onClose();
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error al actualizar el horario", "error");
    }
  };

  return (
    <Modal onClose={onClose} title="Editar Horario">
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <DatePicker
            selected={startTime}
            onChange={setStartTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption="Inicio"
            dateFormat="HH:mm"
            minTime={new Date(0, 0, 0, 7, 0)}
            maxTime={new Date(0, 0, 0, 15, 0)}
            className="form-control w-full px-3 py-2 border rounded"
          />
          <DatePicker
            selected={endTime}
            onChange={setEndTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption="Fin"
            dateFormat="HH:mm"
            minTime={new Date(0, 0, 0, 7, 0)}
            maxTime={new Date(0, 0, 0, 15, 0)}
            className="form-control w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Guardar Cambios
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditScheduleModal;
