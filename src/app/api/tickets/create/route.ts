import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export async function POST(request: NextRequest) {
  const { estudiante_id, descripcion, becario_id, horario_agendado } =
    await request.json();

  if (!estudiante_id || !descripcion || !becario_id || !horario_agendado) {
    return NextResponse.json(
      { success: false, message: "Invalid input" },
      { status: 400 }
    );
  }

  try {
    const [result]: any = await pool.query(
      "INSERT INTO tickets (estudiante_id, descripcion, estado, becario_id, fecha_creacion, fecha_actualizacion, horario_agendado) VALUES (?, ?, 'pendiente', ?, NOW(), NOW(), ?)",
      [estudiante_id, descripcion, becario_id, horario_agendado]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to create ticket" },
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
