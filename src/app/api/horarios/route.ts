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
    const [fixedSchedules]: any = await pool.query(
      "SELECT * FROM horarios_fijos_becarios WHERE becario_id = ?",
      [user.id]
    );
    const [adHocSchedules]: any = await pool.query(
      "SELECT * FROM disponibilidad_ad_hoc WHERE becario_id = ?",
      [user.id]
    );

    return NextResponse.json({
      success: true,
      fixedSchedules,
      adHocSchedules,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
