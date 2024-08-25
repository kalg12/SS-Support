"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import NotificationProvider from "@/components/NotificationProvider";
import { useEffect } from "react"; // Importa useEffect

const inter = Inter({ subsets: ["latin"] });

/*
export const metadata: Metadata = {
  title: "Soporte - Servicio Social",
  description:
    "Aplicación de soporte tecnológico y académico para estudiantes y administrativos del CETMAR18",
}; */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Llama a la API para inicializar el servidor de Socket.IO
    fetch("/api/socket");
  }, []);

  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <NotificationProvider />
          {children}
        </Providers>
      </body>
    </html>
  );
}
