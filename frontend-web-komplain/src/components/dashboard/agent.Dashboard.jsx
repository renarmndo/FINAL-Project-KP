import React from "react";
import Lottie from "lottie-react";

export const AgentDasboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-screen-lg w-full overflow-hidden ">
        {/* Konten teks */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
            Sistem Komplain Customers
          </h1>
          <p className="text-red-600 text-lg mb-6">
            PT Transkom Integrasi Mandiri
          </p>
        </div>
      </div>
    </div>
  );
};
