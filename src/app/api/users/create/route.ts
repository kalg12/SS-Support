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
    fecha_inicio_servicio,
    fecha_fin_servicio,
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

    const userId = result.insertId;

    if (rol_id === 3 && fecha_inicio_servicio && fecha_fin_servicio) {
      await pool.query(
        "INSERT INTO becarios (usuario_id, fecha_inicio_servicio, fecha_fin_servicio) VALUES (?, ?, ?)",
        [userId, fecha_inicio_servicio, fecha_fin_servicio]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
