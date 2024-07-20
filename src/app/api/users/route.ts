import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export async function GET() {
  try {
    const [rows]: any = await pool.query(
      "SELECT id, nombre, apellido, correo_electronico, rol FROM usuarios"
    );
    return NextResponse.json({ success: true, users: rows });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
