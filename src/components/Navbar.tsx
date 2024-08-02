"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  selectRole,
  logout,
  selectIsAuthenticated,
  selectNombre,
  selectApellido,
  selectFoto,
} from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Cookies from "js-cookie";

const Navbar = () => {
  const role = useSelector(selectRole);
  const nombre = useSelector(selectNombre);
  const apellido = useSelector(selectApellido);
  const foto = useSelector(selectFoto);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("token"); // Elimina el token de las cookies
    router.push("/");
  };

  const imageUrl =
    foto && foto.startsWith("http") ? foto : "/assets/images/icon.jpg";

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <div className="flex items-center space-x-4">
        <Image
          src={imageUrl}
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <span>{`${nombre} ${apellido}`}</span>
      </div>
      {isAuthenticated && (
        <Button onClick={handleLogout} className="bg-red-500 text-white">
          Cerrar Sesión
        </Button>
      )}
    </nav>
  );
};

export default Navbar;
