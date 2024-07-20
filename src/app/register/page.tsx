"use client";

import Register from "@/components/Register";
import { useSelector } from "react-redux";
import { selectRole } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
  const role = useSelector(selectRole);
  const router = useRouter();

  useEffect(() => {
    if (role !== "superadmin" && role !== "admin") {
      router.push("/unauthorized");
    }
  }, [role, router]);

  return (
    <div>
      <Register />
    </div>
  );
}
