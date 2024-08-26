import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export async function GET(request: NextRequest) {
  try {
    const notifications = await pool.query(
      "SELECT * FROM notificaciones WHERE leido = false ORDER BY fecha_creacion DESC"
    );
    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
