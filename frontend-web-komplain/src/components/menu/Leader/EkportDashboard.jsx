import React from "react";
import { Hourglass } from "lucide-react";

export const EkportDashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="animate-spin-slow text-red-500 bg-red-100 p-4 rounded-full">
            <Hourglass className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Fitur Dalam Pengembangan
        </h1>
        <p className="text-gray-600">
          Halaman ini akan segera tersedia. Kami sedang menyiapkan fitur ekspor
          data untuk Anda.
        </p>
      </div>
    </div>
  );
};
