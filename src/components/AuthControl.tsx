"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectIsAuthenticated, logout } from "@/store/authSlice";
import { Button } from "@/components/ui/button";

const AuthControl = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return isAuthenticated ? (
    <Button onClick={handleLogout} className="bg-red-500 text-white">
      Cerrar Sesión
    </Button>
  ) : (
    <Button
      onClick={() => router.push("/login")}
      className="bg-blue-500 text-white"
    >
      Iniciar Sesión
    </Button>
  );
};

export default AuthControl;
