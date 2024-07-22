// src/app/api/horarios/fixed/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { verifyToken } from "@/utils/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }

  const { id } = params;
  const { dia_semana, hora_inicio, hora_fin } = await request.json();

  if (!dia_semana || !hora_inicio || !hora_fin) {
    return NextResponse.json(
      { success: false, message: "Invalid input: Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Verificar que el becario_id existe en la tabla becarios
    const [becarioCheck]: any = await pool.query(
      "SELECT id FROM becarios WHERE usuario_id = ?",
      [user.id]
    );

    if (becarioCheck.length === 0) {
      return NextResponse.json(
        { success: false, message: "Becario no encontrado" },
        { status: 404 }
      );
    }

    const becarioId = becarioCheck[0].id;

    const [result]: any = await pool.query(
      "UPDATE horarios_fijos_becarios SET dia_semana = ?, hora_inicio = ?, hora_fin = ? WHERE id = ? AND becario_id = ?",
      [dia_semana, hora_inicio, hora_fin, id, becarioId]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Schedule update failed: No rows affected" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error: " + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
