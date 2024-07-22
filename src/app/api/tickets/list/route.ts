import pool from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const [tickets]: any = await pool.query(`
      SELECT t.id, t.descripcion, t.estado, t.fecha_creacion, t.fecha_actualizacion, t.horario_agendado,
             e.nombre, e.apellido, e.grupo, e.semestre, e.telefono_whatsapp
      FROM tickets t
      JOIN estudiantes e ON t.estudiante_id = e.id
    `);

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
