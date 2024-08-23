import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import NotificationProvider from "@/components/NotificationProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soporte - Servicio Social",
  description:
    "Aplicación de soporte tecnológico y académico para estudiantes y administrativos del CETMAR18",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
