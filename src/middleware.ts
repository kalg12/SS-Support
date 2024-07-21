import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Si no hay token, redirige a la página de login
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Verifica el token aquí si es necesario (decodificación, etc.)
  // Si el token es inválido, redirige a la página de login
  // ...

  return NextResponse.next();
}

// Aplica el middleware solo a rutas específicas
export const config = {
  matcher: ["/dashboard/:path*"],
};
