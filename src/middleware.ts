import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken"; // Asegúrate de tener este paquete instalado

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Verifica el token con tu clave secreta
    jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
  } catch (err) {
    // Si el token es inválido o ha expirado, redirige al usuario
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
