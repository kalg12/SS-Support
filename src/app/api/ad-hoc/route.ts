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

  const { fecha, disponible } = await request.json();

  try {
    const [result]: any = await pool.query(
      "INSERT INTO disponibilidad_ad_hoc (becario_id, fecha, disponible) VALUES (?, ?, ?)",
      [user.id, fecha, disponible]
    );

    if (result.affectedRows === 1) {
      return NextResponse.json({
        success: true,
        schedule: {
          id: result.insertId,
          becario_id: user.id,
          fecha,
          disponible,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to create schedule" },
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
