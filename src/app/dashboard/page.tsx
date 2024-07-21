"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/authSlice";
import DashboardLayout from "@/components/DashboardLayout";

export default function Dashboard() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard Content</h1>
      <p>Welcome to the dashboard!</p>
    </DashboardLayout>
  );
}
