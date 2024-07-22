import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export async function GET(request: NextRequest) {
  try {
    const [horariosFijos]: any = await pool.query(
      "SELECT b.usuario_id, h.dia_semana, h.hora_inicio, h.hora_fin FROM horarios_fijos_becarios h JOIN becarios b ON h.becario_id = b.id"
    );

    const [disponibilidadAdHoc]: any = await pool.query(
      "SELECT b.usuario_id, d.fecha, d.disponible FROM disponibilidad_ad_hoc d JOIN becarios b ON d.becario_id = b.id"
    );

    return NextResponse.json({
      success: true,
      horariosFijos,
      disponibilidadAdHoc,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
