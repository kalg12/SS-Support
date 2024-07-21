"use client";

import Register from "@/components/Register";
import { useSelector } from "react-redux";
import { selectRole } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function RegisterPage() {
  const role = useSelector(selectRole);
  const router = useRouter();

  useEffect(() => {
    if (role !== "superadmin" && role !== "admin") {
      router.push("/unauthorized");
    }
  }, [role, router]);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-2">Agregar usuario</h1>
      <p>
        En esta sección se puede agregar alumnos que realizan el servicio social
      </p>
      <Register />
    </DashboardLayout>
  );
}
