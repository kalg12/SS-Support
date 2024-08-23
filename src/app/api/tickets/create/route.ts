import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export async function POST(request: NextRequest) {
  const {
    nombre,
    apellido,
    grupo,
    semestre,
    telefono_whatsapp,
    descripcion,
    horario_agendado,
  } = await request.json();

  if (
    !nombre ||
    !apellido ||
    !grupo ||
    !semestre ||
    !telefono_whatsapp ||
    !descripcion ||
    !horario_agendado
  ) {
    return NextResponse.json(
      { success: false, message: "Todos los campos son obligatorios." },
      { status: 400 }
    );
  }

  const estado = "pendiente";
  const fechaCreacion = new Date().toISOString();
  const fechaActualizacion = fechaCreacion;

  try {
    const [estudianteResult]: any = await pool.query(
      "INSERT INTO estudiantes (nombre, apellido, grupo, semestre, telefono_whatsapp) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, grupo, semestre, telefono_whatsapp]
    );

    const estudianteId = estudianteResult.insertId;

    const [ticketResult]: any = await pool.query(
      "INSERT INTO tickets (estudiante_id, descripcion, estado, fecha_creacion, fecha_actualizacion, horario_agendado) VALUES (?, ?, ?, ?, ?, ?)",
      [
        estudianteId,
        descripcion,
        estado,
        fechaCreacion,
        fechaActualizacion,
        horario_agendado,
      ]
    );

    if (ticketResult.affectedRows > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Error al crear el ticket." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
