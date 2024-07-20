import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export async function GET() {
  try {
    const [rows]: any = await pool.query("SELECT * FROM tickets");
    return NextResponse.json({ success: true, tickets: rows });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
