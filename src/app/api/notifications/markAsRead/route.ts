// src/app/api/notifications/markAsRead/route.ts

import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { verifyToken } from "@/utils/auth";

export async function PATCH(request: NextRequest) {
  const { ticketId } = await request.json();
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

  if (!decoded) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized: Invalid token or insufficient permissions",
      },
      { status: 401 }
    );
  }

  try {
    await pool.query(
      "UPDATE notificaciones SET leido = true WHERE mensaje LIKE ?",
      [`%${ticketId}%`]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
