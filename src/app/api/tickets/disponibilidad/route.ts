import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export async function GET() {
  try {
    const [horarios]: any = await pool.query(`
      SELECT 
        hf.becario_id, hf.dia_semana, hf.hora_inicio, hf.hora_fin,
        da.fecha, da.disponible
      FROM horarios_fijos_becarios hf
      LEFT JOIN disponibilidad_ad_hoc da ON hf.becario_id = da.becario_id
    `);

    return NextResponse.json({
      success: true,
      horarios,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
