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

  try {
    // Primero, insertar el estudiante en la tabla 'estudiantes'
    const [resultEstudiante]: any = await pool.query(
      "INSERT INTO estudiantes (nombre, apellido, grupo, semestre, telefono_whatsapp) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, grupo, semestre, telefono_whatsapp]
    );

    const estudianteId = resultEstudiante.insertId;

    // Luego, insertar el ticket en la tabla 'tickets'
    const [resultTicket]: any = await pool.query(
      "INSERT INTO tickets (estudiante_id, descripcion, estado, fecha_creacion, horario_agendado) VALUES (?, ?, 'pendiente', NOW(), ?)",
      [estudianteId, descripcion, horario_agendado]
    );

    if (resultTicket.affectedRows === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Ticket creation failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
