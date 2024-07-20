"use client";

import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Button onClick={handleLogout} className="bg-red-500 text-white">
        Cerrar Sesión
      </Button>
    </div>
  );
}
