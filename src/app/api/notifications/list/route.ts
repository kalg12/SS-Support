import { NextResponse } from "next/server";
import pool from "@/utils/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM notificaciones WHERE leido = 0"
    );

    return NextResponse.json({ success: true, notifications: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Error fetching notifications",
    });
  }
}
