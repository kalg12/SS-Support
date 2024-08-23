import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { verifyToken } from "@/utils/auth";

interface Params {
  id: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { estado } = await request.json();
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized: Invalid token or insufficient permissions",
      },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);

  if (!decoded || decoded.rol !== "becario") {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized: Invalid token or insufficient permissions",
      },
      { status: 401 }
    );
  }

  const usuarioId = decoded.id;

  try {
    // Verificar que el usuarioId existe en la tabla becarios
    const [becarioExists]: any = await pool.query(
      "SELECT id FROM becarios WHERE usuario_id = ?",
      [usuarioId]
    );

    console.log("Becario Exists:", becarioExists);

    if (becarioExists.length === 0) {
      return NextResponse.json(
        { success: false, message: "Becario not found." },
        { status: 404 }
      );
    }

    // Obtener el id del becario
    const becarioId = becarioExists[0].id;

    // Actualizar el ticket con el becarioId y el nuevo estado
    const [ticketResult]: any = await pool.query(
      "UPDATE tickets SET estado = ?, becario_id = ? WHERE id = ?",
      [estado, becarioId, params.id]
    );

    if (ticketResult.affectedRows > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Error updating ticket." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
