"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "@/services/userApi";
import { login } from "@/store/authSlice";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginUser] = useLoginUserMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password }).unwrap();
      if (response.success) {
        dispatch(login(response.token));
        Swal.fire({
          title: "Success",
          text: "Login successful!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/tickets");
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Invalid credentials",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred during login",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <Label htmlFor="email" className="block text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
