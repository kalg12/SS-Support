import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/utils/db";

export async function POST(request: NextRequest) {
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

  try {
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
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { success: false, message: "Email already in use" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
