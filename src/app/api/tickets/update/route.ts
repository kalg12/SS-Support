import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export async function PATCH(request: NextRequest) {
  const { id, estado } = await request.json();

  try {
    const [result]: any = await pool.query(
      "UPDATE tickets SET estado = ? WHERE id = ?",
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
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
