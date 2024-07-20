import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "@/utils/db";

const JWT_SECRET = process.env.JWT_SECRET || "app_service_social_ultras3cre3t";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const [rows]: any = await pool.query(
      `SELECT u.*, r.nombre AS rol_nombre 
       FROM usuarios u 
       JOIN roles r ON u.rol_id = r.id 
       WHERE correo_electronico = ?`,
      [email]
    );
    const user = rows[0];

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        { id: user.id, rol: user.rol_nombre },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return NextResponse.json({ success: true, token, rol: user.rol_nombre });
    } else {
      return NextResponse.json(
        { success: false, message: "Credenciales inválidas" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
