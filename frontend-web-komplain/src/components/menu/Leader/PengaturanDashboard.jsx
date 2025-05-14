import React from "react";
import { Link } from "react-router-dom";

export const PengaturanDashboard = () => {
  return (
    <div>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-red-700 mb-8">
            Pengaturan Sistem
          </h1>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profil Pengguna */}
            <Link
              to="/settings/profile"
              className="bg-white rounded-lg shadow hover:shadow-md transition p-6 border-l-4 border-red-500"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Profil Pengguna
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Lihat atau ubah informasi akun Anda.
              </p>
            </Link>

            {/* Manajemen Role & Akses */}
            <Link
              to="/settings/roles"
              className="bg-white rounded-lg shadow hover:shadow-md transition p-6 border-l-4 border-red-500"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Role & Hak Akses
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Tambah, edit, atau hapus role dan izin pengguna.
              </p>
            </Link>

            {/* Integrasi Channel */}
            <Link
              to="/settings/integrations"
              className="bg-white rounded-lg shadow hover:shadow-md transition p-6 border-l-4 border-red-500"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Integrasi Channel
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Atur integrasi dengan WhatsApp, Email, Telegram, atau API
                eksternal.
              </p>
            </Link>

            {/* Template Pesan */}
            <Link
              to="/settings/templates"
              className="bg-white rounded-lg shadow hover:shadow-md transition p-6 border-l-4 border-red-500"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Template Balasan
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Buat template pesan untuk balasan otomatis sesuai jenis
                komplain.
              </p>
            </Link>

            {/* SLA Management */}
            <Link
              to="/settings/sla"
              className="bg-white rounded-lg shadow hover:shadow-md transition p-6 border-l-4 border-red-500"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Pengaturan SLA
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Atur target waktu penyelesaian komplain berdasarkan kategori.
              </p>
            </Link>

            {/* Departemen/Tim */}
            <Link
              to="/settings/departments"
              className="bg-white rounded-lg shadow hover:shadow-md transition p-6 border-l-4 border-red-500"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Departemen & Tim
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Kelola tim atau departemen yang bertugas menangani komplain.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
