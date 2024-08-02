import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export async function POST(request: NextRequest) {
  const { usuario_id, mensaje } = await request.json();

  if (!usuario_id || !mensaje) {
    return NextResponse.json(
      { success: false, message: "Todos los campos son obligatorios." },
      { status: 400 }
    );
  }

  const fechaCreacion = new Date().toISOString();

  try {
    const [result]: any = await pool.query(
      "INSERT INTO notificaciones (usuario_id, mensaje, leido, fecha_creacion) VALUES (?, ?, ?, ?)",
      [usuario_id, mensaje, false, fechaCreacion]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({ success: true, insertId: result.insertId });
    } else {
      return NextResponse.json(
        { success: false, message: "Error al crear la notificación." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
