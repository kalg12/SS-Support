"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/authSlice";
import Login from "@/components/Login";

export default function Home() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return <>{!isAuthenticated && <Login />}</>;
}
