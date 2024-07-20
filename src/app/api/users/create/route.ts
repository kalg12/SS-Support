import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/utils/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "app_service_social_ultras3cre3t";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { success: false, message: "No autorizado" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const { rol } = decoded;

    if (rol !== "superadmin" && rol !== "admin") {
      return NextResponse.json(
        { success: false, message: "Acceso denegado" },
        { status: 403 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Token inválido o expirado" },
      { status: 401 }
    );
  }

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
        { success: false, message: "Error en la creación del usuario" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error creando usuario:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { success: false, message: "Correo electrónico ya en uso" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
