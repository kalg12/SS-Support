import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "@/utils/db";

const JWT_SECRET = process.env.JWT_SECRET || "app_service_social_ultras3cre3t";

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const {
      nombre,
      apellido,
      fecha_nacimiento,
      grupo,
      telefono_whatsapp,
      correo_electronico,
      semestre,
      foto,
      rol_id,
      password,
    } = await request.json();

    const hashedPassword = bcrypt.hashSync(password, 10);

    const [result]: any = await pool.query(
      "INSERT INTO usuarios (nombre, apellido, fecha_nacimiento, grupo, telefono_whatsapp, correo_electronico, semestre, foto, rol_id, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nombre,
        apellido,
        fecha_nacimiento,
        grupo,
        telefono_whatsapp,
        correo_electronico,
        semestre,
        foto,
        rol_id,
        hashedPassword,
      ]
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
