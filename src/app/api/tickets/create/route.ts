import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export async function POST(request: NextRequest) {
  const { title, description } = await request.json();

  try {
    const [result]: any = await pool.query(
      "INSERT INTO tickets (title, description, status) VALUES (?, ?, ?)",
      [title, description, "open"]
    );

    if (result.affectedRows === 1) {
      const [rows]: any = await pool.query(
        "SELECT * FROM tickets WHERE id = ?",
        [result.insertId]
      );
      const ticket = rows[0];
      return NextResponse.json({ success: true, ticket });
    } else {
      return NextResponse.json(
        { success: false, message: "Ticket creation failed" },
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
