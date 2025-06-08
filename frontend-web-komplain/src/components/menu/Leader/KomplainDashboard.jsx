import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter, Download, Calendar, CheckCircle } from "lucide-react";
import { getKomplainByLeader } from "../../../service/getMyComplain";

export const KomplainDashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [komplainData, setKomplainData] = useState([]);
  const [loading, setLoading] = useState(true);

  // state untuk get data
  useEffect(() => {
    const fetcKomplain = async () => {
      try {
        const res = await getKomplainByLeader();
        console.log("Response dari API:", res);

        // Pastikan res.data adalah array, jika tidak set sebagai empty array
        const dataArray = Array.isArray(res.data) ? res.data : [];
        setKomplainData(dataArray);

        console.log("Data komplain yang didapat:", dataArray);
        console.log("Jumlah data:", dataArray.length);

        // Log sample data untuk debugging
        if (dataArray.length > 0) {
          console.log("Sample data pertama:", dataArray[0]);
          console.log("Field yang tersedia:", Object.keys(dataArray[0]));
        }
      } catch (error) {
        console.log("Error fetching data:", error);
        // Set sebagai empty array jika error
        setKomplainData([]);
      } finally {
        setLoading(false);
      }
    };
    fetcKomplain();
  }, []);

  // const filteredData = useMemo(() => {
  //   console.log("=== MULAI FILTERING ===");
  //   console.log("komplainData:", komplainData);
  //   console.log("komplainData.length:", komplainData?.length);
  //   console.log("searchTerm:", `"${searchTerm}"`);
  //   console.log("startDate:", startDate);
  //   console.log("endDate:", endDate);

  //   // Pastikan komplainData adalah array dan tidak kosong
  //   if (!Array.isArray(komplainData)) {
  //     console.log("❌ Data bukan array:", typeof komplainData);
  //     return [];
  //   }

  //   if (komplainData.length === 0) {
  //     console.log("❌ Data array kosong");
  //     return [];
  //   }

  //   let filtered = [...komplainData]; // Buat copy array
  //   console.log("✅ Data awal:", filtered.length);

  //   // Filter berdasarkan tanggal hanya jika kedua tanggal diisi dan valid
  //   if (
  //     startDate &&
  //     endDate &&
  //     startDate.trim() !== "" &&
  //     endDate.trim() !== ""
  //   ) {
  //     console.log("🔍 Menjalankan filter tanggal...");
  //     try {
  //       const start = new Date(startDate);
  //       const end = new Date(endDate);
  //       // Set end date ke akhir hari
  //       end.setHours(23, 59, 59, 999);

  //       console.log("Start date:", start);
  //       console.log("End date:", end);

  //       filtered = filtered.filter((item) => {
  //         // Prioritas updatedAt, lalu createdAt
  //         const dateField = item.updatedAt || item.createdAt;
  //         if (!dateField) {
  //           console.log("⚠️ Item tanpa tanggal, tetap tampilkan:", item.id);
  //           return true;
  //         }

  //         const itemDate = new Date(dateField);
  //         if (isNaN(itemDate.getTime())) {
  //           console.log(
  //             "⚠️ Item dengan tanggal invalid, tetap tampilkan:",
  //             item.id,
  //             dateField
  //           );
  //           return true;
  //         }

  //         const inRange = itemDate >= start && itemDate <= end;
  //         console.log(
  //           `Item ${
  //             item.id
  //           }: ${dateField} -> ${itemDate.toISOString()} -> inRange: ${inRange}`
  //         );
  //         return inRange;
  //       });
  //       console.log("📅 Setelah filter tanggal:", filtered.length);
  //     } catch (error) {
  //       console.log("❌ Error pada filter tanggal:", error);
  //     }
  //   } else {
  //     console.log("⏭️ Skip filter tanggal (tidak ada range lengkap)");
  //   }

  //   // Filter berdasarkan pencarian hanya jika ada search term yang tidak kosong
  //   if (searchTerm && searchTerm.trim() !== "") {
  //     console.log("🔍 Menjalankan filter pencarian...");
  //     const term = searchTerm.toLowerCase().trim();

  //     filtered = filtered.filter((item) => {
  //       // Daftar field yang akan dicari berdasarkan struktur data Anda
  //       const searchFields = [
  //         item.nama_Pelanggan, // "Musang King"
  //         item.nomor_Indihome, // "12345678"
  //         item.alamat_Pelanggan, // "Pamulang"
  //         item.email_Pelanggan, // "contoh@gmail.com"
  //         item.noTlp_Pelanggan, // "0812345678901"
  //         item.priority, // "high"
  //         item.status, // "completed"
  //         // Handler bisa null atau object
  //         item.Handler?.name,
  //         // Agent adalah object
  //         item.Agent?.name, // "agent 2"
  //         // layanan adalah object
  //         item.layanan?.nama_layanan, // "Tagihan Tidak Sesuai"
  //       ];

  //       // Filter field yang tidak null/undefined dan konversi ke string
  //       const validFields = searchFields
  //         .filter(
  //           (field) => field != null && field !== undefined && field !== ""
  //         )
  //         .map((field) => String(field).toLowerCase());

  //       console.log(`🔎 Item ${item.id} - Search fields:`, validFields);

  //       // Cek apakah ada field yang mengandung search term
  //       const found = validFields.some((field) => field.includes(term));
  //       console.log(`🔎 Item ${item.id} - Found: ${found}`);

  //       return found;
  //     });
  //     console.log("🔍 Setelah filter pencarian:", filtered.length);
  //   } else {
  //     console.log("⏭️ Skip filter pencarian (tidak ada search term)");
  //   }

  //   console.log("✅ Data final:", filtered.length);
  //   console.log("=== SELESAI FILTERING ===");
  //   return filtered;
  // }, [komplainData, startDate, endDate, searchTerm]);

  const filteredData = [1, 2];
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const exportToCSV = () => {
    // Pastikan ada data untuk di-export
    if (!filteredData || filteredData.length === 0) {
      alert("Tidak ada data untuk di-export");
      return;
    }

    const headers = [
      "No Inihome",
      "Nama",
      "Alamat",
      "Email",
      "No Telepon",
      "Komplain",
      "Handler",
      "Agent",
      "Tanggal Komplain",
      "Tanggal Selesai",
      "Prioritas",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        [
          row.nomor_Indihome || "",
          `"${row.nama_Pelanggan || ""}"`,
          `"${row.alamat_Pelanggan || ""}"`,
          row.email_Pelanggan || "",
          row.noTlp_Pelanggan || "",
          `"${row.layanan?.nama_layanan || ""}"`,
          // Handle nested handler
          typeof row.Handler === "string"
            ? row.Handler
            : row.Handler?.name || "N/A",
          // Handle nested agent
          typeof row.Agent === "string" ? row.Agent : row.Agent?.name || "N/A",
          new Date(row.createdAt).toLocaleDateString("id-ID") || "",
          new Date(row.updatedAt).toLocaleDateString("id-ID") || "",
          row.priority || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "komplain-complete.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Debug info
  console.log("Render - Loading:", loading);
  console.log("Render - KomplainData length:", komplainData.length);
  console.log("Render - FilteredData length:", filteredData.length);
  console.log("Render - Search term:", searchTerm);
  console.log("Render - Date range:", startDate, "to", endDate);

  if (loading) return <p>Loading....</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Komplain Leader
                </h1>
                <p className="text-sm text-gray-500">
                  Kelola data komplain yang telah diselesaikan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Debug Info - Hapus ini setelah masalah teratasi */}
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-yellow-800">Debug Info:</h3>
          <p className="text-yellow-700">Total Data: {komplainData.length}</p>
          <p className="text-yellow-700">
            Data Terfilter: {filteredData.length}
          </p>
          <p className="text-yellow-700">Search Term: "{searchTerm}"</p>
          <p className="text-yellow-700">
            Date Range: {startDate} - {endDate}
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-red-600" />
                Filter & Pencarian
              </h2>
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama, No Indihome, komplain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Start Date */}
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  placeholder="Tanggal Mulai"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* End Date */}
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  placeholder="Tanggal Selesai"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setSearchTerm("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Komplain Selesai
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {filteredData?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Prioritas Tinggi
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {filteredData?.filter((item) => item.priority === "high")
                    ?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <div className="w-6 h-6 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Rata-rata Penyelesaian
                </p>
                <p className="text-3xl font-bold text-red-600">2 Hari</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Data Komplain Selesai
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Menampilkan {filteredData?.length || 0} dari{" "}
              {komplainData?.length || 0} data
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    No Indihome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    Nama Pelanggan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    Jenis Layanan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    Alamat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    No Telepon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    Tgl Komplain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    Tgl Selesai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                    Prioritas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.nomor_Indihome || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.nama_Pelanggan || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.layanan?.nama_layanan || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.alamat_Pelanggan || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.email_Pelanggan || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.noTlp_Pelanggan || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.Agent?.name || item.Agent || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.updatedAt
                          ? new Date(item.updatedAt).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                            item.priority
                          )}`}
                        >
                          {item.priority === "high"
                            ? "Tinggi"
                            : item.priority === "medium"
                            ? "Sedang"
                            : item.priority === "low"
                            ? "Rendah"
                            : item.priority || "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="10"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <Search className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium">
                          {komplainData.length === 0
                            ? "Tidak ada data komplain"
                            : "Tidak ada data yang ditemukan"}
                        </p>
                        <p className="text-sm">
                          {komplainData.length === 0
                            ? "Belum ada data komplain yang tersedia"
                            : "Coba ubah filter atau kata kunci pencarian"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
