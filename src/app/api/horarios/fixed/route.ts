import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
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

  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM horarios_fijos_becarios WHERE becario_id = (SELECT id FROM becarios WHERE usuario_id = ?)",
      [user.id]
    );

    return NextResponse.json({
      success: true,
      horarios: rows,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

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

  const { days, startTime, endTime } = await request.json();

  if (!days || days.length === 0 || !startTime || !endTime) {
    return NextResponse.json(
      { success: false, message: "Invalid input" },
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

    const values = days.map((day: string) => [
      becarioId,
      day,
      startTime,
      endTime,
    ]);

    const [result]: any = await pool.query(
      "INSERT INTO horarios_fijos_becarios (becario_id, dia_semana, hora_inicio, hora_fin) VALUES ?",
      [values]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({
        success: true,
        id: result.insertId, // Asegúrate de devolver el id insertado
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
