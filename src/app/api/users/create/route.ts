import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/utils/db";

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json();

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const [result]: any = await pool.query(
      "INSERT INTO usuarios (nombre, correo_electronico, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    if (result.affectedRows === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "User creation failed" },
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
