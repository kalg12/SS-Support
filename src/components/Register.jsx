"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegisterUserMutation } from "@/services/userApi";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fecha_nacimiento, setFechaNacimiento] = useState("");
  const [grupo, setGrupo] = useState("");
  const [telefono_whatsapp, setTelefonoWhatsapp] = useState("");
  const [correo_electronico, setCorreoElectronico] = useState("");
  const [semestre, setSemestre] = useState("");
  const [foto, setFoto] = useState("");
  const [rol_id, setRolId] = useState(1);
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [registerUser] = useRegisterUserMutation();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser({
        nombre,
        apellido,
        fecha_nacimiento,
        grupo,
        telefono_whatsapp,
        correo_electronico,
        semestre,
        foto,
        rol_id,
        password,
      }).unwrap();
      if (response.success) {
        Swal.fire({
          title: "Success",
          text: "Registration successful!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/login");
        });
      } else {
        Swal.fire({
          title: "Error",
          text: response.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error registering:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred during registration",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <Label htmlFor="nombre" className="block text-gray-700">
              Name
            </Label>
            <Input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="apellido" className="block text-gray-700">
              Last Name
            </Label>
            <Input
              id="apellido"
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="fecha_nacimiento" className="block text-gray-700">
              Birth Date
            </Label>
            <Input
              id="fecha_nacimiento"
              type="date"
              value={fecha_nacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="grupo" className="block text-gray-700">
              Group
            </Label>
            <Input
              id="grupo"
              type="text"
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="telefono_whatsapp" className="block text-gray-700">
              WhatsApp Phone
            </Label>
            <Input
              id="telefono_whatsapp"
              type="text"
              value={telefono_whatsapp}
              onChange={(e) => setTelefonoWhatsapp(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="correo_electronico" className="block text-gray-700">
              Email
            </Label>
            <Input
              id="correo_electronico"
              type="email"
              value={correo_electronico}
              onChange={(e) => setCorreoElectronico(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="semestre" className="block text-gray-700">
              Semester
            </Label>
            <Input
              id="semestre"
              type="text"
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="foto" className="block text-gray-700">
              Photo URL
            </Label>
            <Input
              id="foto"
              type="text"
              value={foto}
              onChange={(e) => setFoto(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="password" className="block text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
