import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export async function POST(request: NextRequest) {
  const { estudiante_id, descripcion, estado, becario_id, horario_agendado } =
    await request.json();

  try {
    const [result]: any = await pool.query(
      "INSERT INTO tickets (estudiante_id, descripcion, estado, becario_id, horario_agendado) VALUES (?, ?, ?, ?, ?)",
      [estudiante_id, descripcion, estado, becario_id, horario_agendado]
    );

    if (result.affectedRows === 1) {
      const [rows]: any = await pool.query(
        "SELECT * FROM tickets WHERE id = ?",
        [result.insertId]
      );
      const ticket = rows[0];
      return NextResponse.json({ success: true, ticket });
    } else {
      return NextResponse.json(
        { success: false, message: "Ticket creation failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
