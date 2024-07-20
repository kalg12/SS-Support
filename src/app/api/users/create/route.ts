import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/utils/db";

export async function POST(request: NextRequest) {
  const { nombre, apellido, correo_electronico, password, rol_id } =
    await request.json();
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const [result]: any = await pool.query(
      "INSERT INTO usuarios (nombre, apellido, correo_electronico, password, rol_id) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, correo_electronico, hashedPassword, rol_id]
    );

    return NextResponse.json({ success: true, userId: result.insertId });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
