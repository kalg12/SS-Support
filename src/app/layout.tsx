import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import AuthControl from "@/components/AuthControl";

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
          <header className="p-4 bg-gray-800 text-white">
            <AuthControl />
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
