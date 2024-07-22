"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import WeeklyAvailability from "@/components/WeeklyAvailability";

const Horarios = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Horarios</h2>
          <WeeklyAvailability />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Horarios;
