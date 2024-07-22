import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export async function GET(request: NextRequest) {
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM horarios_fijos_becarios"
    );

    return NextResponse.json({
      success: true,
      horarios: rows,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
