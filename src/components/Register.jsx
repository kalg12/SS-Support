import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "@/store/authSlice";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const grupos = [
  "Mecánica Naval",
  "Refrigeración",
  "Químico Biólogo",
  "Alimentos y Bebidas",
  "Recreaciones Acuáticas",
  "Acuacultura",
];

const semestres = [1, 2, 3, 4, 5, 6];

const roles = [
  { id: 1, nombre: "superadmin" },
  { id: 2, nombre: "admin" },
  { id: 3, nombre: "becario" },
];

const Register = () => {
  const token = useSelector(selectToken);
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    grupo: grupos[0],
    telefono_whatsapp: "",
    correo_electronico: "",
    semestre: semestres[0],
    foto: "",
    rol_id: roles[0].id,
    password: "",
    fecha_inicio_servicio: "",
    fecha_fin_servicio: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (e) => {
    const newRole = parseInt(e.target.value);
    setFormData({
      ...formData,
      rol_id: newRole,
      fecha_inicio_servicio:
        newRole === 3 ? formData.fecha_inicio_servicio : "",
      fecha_fin_servicio: newRole === 3 ? formData.fecha_fin_servicio : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: "Success",
          text: "User created successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/dashboard");
        });
      } else {
        Swal.fire({
          title: "Error",
          text: data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while creating the user",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="nombre" className="block text-gray-700">
              Nombre
            </Label>
            <Input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded mt-2"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="apellido" className="block text-gray-700">
              Apellido
            </Label>
            <Input
              id="apellido"
              name="apellido"
              type="text"
              value={formData.apellido}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded mt-2"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="fecha_nacimiento" className="block text-gray-700">
              Fecha de Nacimiento
            </Label>
            <Input
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              type="date"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded mt-2"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="grupo" className="block text-gray-700">
              Grupo
            </Label>
            <select
              id="grupo"
              name="grupo"
              value={formData.grupo}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded mt-2"
            >
              {grupos.map((grupo) => (
                <option key={grupo} value={grupo}>
                  {grupo}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <Label htmlFor="semestre" className="block text-gray-700">
              Semestre
            </Label>
            <select
              id="semestre"
              name="semestre"
              value={formData.semestre}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded mt-2"
            >
              {semestres.map((semestre) => (
                <option key={semestre} value={semestre}>
                  {semestre}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <Label htmlFor="telefono_whatsapp" className="block text-gray-700">
              Teléfono WhatsApp
            </Label>
            <Input
              id="telefono_whatsapp"
              name="telefono_whatsapp"
              type="text"
              value={formData.telefono_whatsapp}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded mt-2"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="correo_electronico" className="block text-gray-700">
              Correo Electrónico
            </Label>
            <Input
              id="correo_electronico"
              name="correo_electronico"
              type="email"
              value={formData.correo_electronico}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded mt-2"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password" className="block text-gray-700">
              Contraseña
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded mt-2"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="rol_id" className="block text-gray-700">
              Rol
            </Label>
            <select
              id="rol_id"
              name="rol_id"
              value={formData.rol_id}
              onChange={handleRoleChange}
              className="w-full px-3 py-2 border rounded mt-2"
            >
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>
          {formData.rol_id === 3 && (
            <>
              <div className="mb-4">
                <Label
                  htmlFor="fecha_inicio_servicio"
                  className="block text-gray-700"
                >
                  Fecha de Inicio de Servicio
                </Label>
                <Input
                  id="fecha_inicio_servicio"
                  name="fecha_inicio_servicio"
                  type="date"
                  value={formData.fecha_inicio_servicio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor="fecha_fin_servicio"
                  className="block text-gray-700"
                >
                  Fecha de Fin de Servicio
                </Label>
                <Input
                  id="fecha_fin_servicio"
                  name="fecha_fin_servicio"
                  type="date"
                  value={formData.fecha_fin_servicio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Registrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
