import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

export const PengaturanDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-red-700 mb-8">
          Pengaturan Sistem
        </h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Menu yang aktif */}
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

          {/* Menu coming soon */}
          {[
            {
              title: "Role & Hak Akses",
              desc: "Tambah, edit, atau hapus role dan izin pengguna.",
            },
            {
              title: "Integrasi Channel",
              desc: "Atur integrasi dengan WhatsApp, Email, Telegram, atau API eksternal.",
            },
            {
              title: "Template Balasan",
              desc: "Buat template pesan untuk balasan otomatis sesuai jenis komplain.",
            },
            {
              title: "Pengaturan SLA",
              desc: "Atur target waktu penyelesaian komplain berdasarkan kategori.",
            },
            {
              title: "Departemen & Tim",
              desc: "Kelola tim atau departemen yang bertugas menangani komplain.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-300 opacity-60 cursor-not-allowed relative"
            >
              <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> Segera Tersedia
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
