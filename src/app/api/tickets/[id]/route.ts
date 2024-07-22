import pool from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { estado } = await request.json();

  if (!estado) {
    return NextResponse.json(
      { success: false, message: "Estado is required" },
      { status: 400 }
    );
  }

  try {
    const [result]: any = await pool.query(
      "UPDATE tickets SET estado = ?, fecha_actualizacion = NOW() WHERE id = ?",
      [estado, id]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
