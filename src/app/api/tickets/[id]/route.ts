import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { verifyToken } from "@/utils/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }

  const { id } = params;
  const { estado } = await request.json();

  if (!estado) {
    return NextResponse.json(
      { success: false, message: "Invalid input" },
      { status: 400 }
    );
  }

  try {
    // Verificar que el becario_id existe en la tabla becarios
    const [becarioCheck]: any = await pool.query(
      "SELECT id FROM becarios WHERE usuario_id = ?",
      [user.id]
    );

    if (becarioCheck.length === 0) {
      return NextResponse.json(
        { success: false, message: "Becario not found" },
        { status: 404 }
      );
    }

    const becarioId = becarioCheck[0].id;

    const [result]: any = await pool.query(
      "UPDATE tickets SET estado = ?, becario_id = ? WHERE id = ?",
      [estado, becarioId, id]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Ticket update failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
