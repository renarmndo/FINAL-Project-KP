import React, { useEffect, useState } from "react";

export const TeamFuDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "http://localhost:5000/webKp/teamfu/komplain",
          {
            headers: {
              Authorization: `Bearer ${localStorage?.getItem("token") || ""}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setData(result.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Statistik
  const stats = {
    total: data.length,
    selesai: data.filter((item) => item.status === "completed").length,
    proses: data.filter((item) => item.status === "processing").length,
    pending: data.filter((item) => item.status === "pending").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Selamat Datang di Dashboard Team Follow Up
              </h1>
              <p className="text-gray-600 mt-2">
                Kelola dan pantau semua aktivitas follow up komplain pelanggan
                secara efektif.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Tanggal</p>
              <p className="text-lg font-semibold text-red-600">
                {new Date().toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Komplain"
            value={stats.total}
            color="red"
            icon="document"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            color="orange"
            icon="clock"
          />
          <StatCard
            title="Dalam Proses"
            value={stats.proses}
            color="yellow"
            icon="progress"
          />
          <StatCard
            title="Selesai"
            value={stats.selesai}
            color="green"
            icon="check"
          />
        </div>

        {/* Overview Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Ringkasan Dashboard
          </h2>
          <p className="text-gray-700 mb-4">
            Dashboard ini dirancang khusus bagi Tim Follow Up untuk memantau dan
            mengelola seluruh komplain pelanggan secara real-time.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Lihat jumlah komplain yang masuk hari ini.</li>
            <li>
              Kelola status komplain: Pending, Dalam Proses, atau Selesai.
            </li>
            <li>Analisis kinerja tim berdasarkan penyelesaian komplain.</li>
          </ul>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-800">
            Tips Penggunaan
          </h3>
          <ul className="mt-2 text-blue-700 list-disc list-inside space-y-1">
            <li>
              Pastikan Anda selalu memperbarui status komplain secara berkala.
            </li>
            <li>
              Gunakan filter pencarian pada halaman detail untuk melihat
              komplain tertentu.
            </li>
            <li>Periksa notifikasi harian untuk update prioritas komplain.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Component Reusable untuk Kartu Statistik
const StatCard = ({ title, value, color, icon }) => {
  const colorClasses = {
    red: "bg-red-100 text-red-600 border-red-200",
    orange: "bg-orange-100 text-orange-600 border-orange-200",
    yellow: "bg-yellow-100 text-yellow-600 border-yellow-200",
    green: "bg-green-100 text-green-600 border-green-200",
  };

  const icons = {
    document: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    clock: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    progress: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.228 4.228l15.544 15.544m0 0a2 2 0 01-2.828 0L4.228 16.944m13.516 2.828a2 2 0 010-2.828L4.228 4.228"
        />
      </svg>
    ),
    check: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold mt-2 text-red-600">{value}</p>
          </div>
          <div
            className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}
          >
            {icons[icon]}
          </div>
        </div>
      </div>
    </div>
  );
};
