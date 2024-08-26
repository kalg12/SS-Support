import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export async function POST(request: NextRequest) {
  try {
    const {
      nombre,
      apellido,
      grupo,
      semestre,
      telefono_whatsapp,
      descripcion,
      horario_agendado,
    } = await request.json();

    // Validación de todos los campos requeridos
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

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insertar el estudiante
      const [estudianteResult]: any = await connection.query(
        "INSERT INTO estudiantes (nombre, apellido, grupo, semestre, telefono_whatsapp) VALUES (?, ?, ?, ?, ?)",
        [nombre, apellido, grupo, semestre, telefono_whatsapp]
      );

      const estudianteId = estudianteResult.insertId;

      // Insertar el ticket
      const [ticketResult]: any = await connection.query(
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

      await connection.commit();

      if (ticketResult.affectedRows > 0) {
        return NextResponse.json({
          success: true,
          message:
            "Gracias por enviar tu solicitud. Esperamos poder asistirte pronto.",
        });
      } else {
        await connection.rollback();
        return NextResponse.json(
          { success: false, message: "Error al crear el ticket." },
          { status: 400 }
        );
      }
    } catch (error) {
      await connection.rollback();
      console.error("Error creating ticket:", error);
      return NextResponse.json(
        { success: false, message: "Error interno del servidor." },
        { status: 500 }
      );
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
