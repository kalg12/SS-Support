import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "@/utils/db";

const JWT_SECRET = process.env.JWT_SECRET || "app_service_social_ultras3cre3t";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM usuarios WHERE correo_electronico = ?",
      [email]
    );
    const user = rows[0];

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, rol: user.rol }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return NextResponse.json({ success: true, token });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
