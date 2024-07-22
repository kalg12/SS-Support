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

    if (result.affectedRows === 1) {
      const userId = result.insertId;

      // Si el rol es becario, insertar en la tabla becarios
      if (rol_id === 3) {
        // Asegúrate de que 3 es el ID para el rol becario
        await pool.query(
          "INSERT INTO becarios (usuario_id, fecha_inicio_servicio, fecha_fin_servicio) VALUES (?, ?, ?)",
          [userId, fecha_inicio_servicio, fecha_fin_servicio]
        );
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "User creation failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
