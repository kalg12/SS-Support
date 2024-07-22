import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { schedules } = await request.json();

  if (!schedules || schedules.length === 0) {
    return NextResponse.json(
      { success: false, message: "No schedules provided" },
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

    const values = schedules.map((schedule: any) => [
      becarioId,
      schedule.day,
      schedule.startTime,
      schedule.endTime,
    ]);

    const [result]: any = await pool.query(
      "INSERT INTO horarios_fijos_becarios (becario_id, dia_semana, hora_inicio, hora_fin) VALUES ?",
      [values]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({
        success: true,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to create schedules" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
