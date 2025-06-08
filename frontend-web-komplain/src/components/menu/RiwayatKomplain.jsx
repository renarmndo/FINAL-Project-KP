import React, { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Eye,
} from "lucide-react";
import { getMyComplain, getMyResponse } from "../../service/getMyComplain";
import { ResponseKomplain } from "../../assets/popup/agent/ResponseKomplain";

export const RiwayatKomplain = () => {
  const [komplain, setKomplain] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedKomplain, setSelectedKomplain] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase();
    if (s === "completed") return <CheckCircle className="w-4 h-4" />;
    if (s === "processing") return <Clock className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "completed") return "bg-green-50 text-green-700 border-green-200";
    if (s === "processing")
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  const filteredKomplain = komplain.filter((item) => {
    const matchesSearch =
      item.nama_Pelanggan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomor_Indihome?.includes(searchTerm) ||
      item.email_Pelanggan?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      !filterDate ||
      new Date(item.createdAt).toDateString() ===
        new Date(filterDate).toDateString();

    return (
      item.status?.trim().toLowerCase() === "completed" &&
      matchesSearch &&
      matchesDate
    );
  });

  // Fetch data komplain
  const fetchDataKomplain = async () => {
    setLoading(true);
    try {
      const data = await getMyComplain();
      setKomplain(data);
      console.log("Ini adalah komplain saya", data);
    } catch (error) {
      console.error("Gagal Mendapatkan Data", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch response data berdasarkan complaint ID

  const fetchResponseData = async (complaintId) => {
    if (!complaintId) return;

    setLoadingResponse(true);
    try {
      const data = await getMyResponse(complaintId);
      setResponseData(data);
      console.log("Response data:", data);
    } catch (error) {
      console.error("Gagal mendapatkan response:", error);
      setResponseData(null);
    } finally {
      setLoadingResponse(false);
    }
  };

  // Opsi 1: Fetch response data setelah complaint data berhasil dimuat
  useEffect(() => {
    const fetchData = async () => {
      await fetchDataKomplain();
      // Jika fetchDataKomplain mengset complaint data, dan complaint memiliki ID
      // Anda bisa fetch response data di sini
    };

    fetchData();
  }, []);

  // ✅ PERBAIKAN UTAMA: Handle detail click dengan benar
  const handleDetailClick = async (complaint) => {
    console.log("Selected complaint:", complaint);
    setSelectedKomplain(complaint);
    setIsPopupOpen(true);

    // Fetch response data saat popup dibuka
    if (complaint?.id) {
      await fetchResponseData(complaint.id);
    }
  };

  const handleClosePopUp = () => {
    setIsPopupOpen(false);
    setSelectedKomplain(null);
    setResponseData(null); // Clear response data saat popup ditutup
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900">
          Riwayat Komplain
        </h3>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Total Komplain
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {komplain.length}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Selesai</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  komplain.filter(
                    (k) => k.status?.toLowerCase() === "completed"
                  ).length
                }
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Dalam Proses</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  komplain.filter(
                    (k) => k.status?.toLowerCase() === "processing"
                  ).length
                }
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, nomor IndiHome, atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
          <h3 className="text-lg font-semibold text-red-800">
            Data Komplain Selesai
          </h3>
          <p className="text-red-600 text-sm">
            Menampilkan {filteredKomplain.length} dari {komplain.length} data
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              <p>Memuat data...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-red-600 uppercase tracking-wider">
                    No IndiHome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-red-600 uppercase tracking-wider">
                    Nama Pelanggan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-red-600 uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-red-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-red-600 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-red-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredKomplain.length > 0 ? (
                  filteredKomplain.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-red-25 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-red-100 rounded-lg p-2 mr-3">
                            <span className="text-red-600 font-mono text-xs font-bold">
                              ID
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {item.nomor_Indihome}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.nama_Pelanggan}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.email_Pelanggan}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.noTlp_Pelanggan}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                            item.status
                          )}`}
                        >
                          {getStatusIcon(item.status)}
                          <span className="capitalize">{item.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDate(item.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* ✅ PERBAIKAN: Pass 'item' bukan 'komplain' */}
                        <button
                          onClick={() => handleDetailClick(item)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 hover:cursor-pointer rounded-lg text-xs font-medium transition-colors duration-200 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 rounded-full p-4 mb-4">
                          <AlertCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Tidak ada data
                        </h3>
                        <p className="text-gray-500">
                          Tidak ada komplain dengan status selesai yang
                          ditemukan.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination (Optional) */}
      {filteredKomplain.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Menampilkan <span className="font-medium">1</span> sampai{" "}
              <span className="font-medium">{filteredKomplain.length}</span>{" "}
              dari{" "}
              <span className="font-medium">{filteredKomplain.length}</span>{" "}
              hasil
            </p>
            <div className="flex items-center space-x-2">
              <button className="bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                Sebelumnya
              </button>
              <button className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium">
                1
              </button>
              <button className="bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop up */}
      <ResponseKomplain
        isOpen={isPopupOpen}
        onClose={handleClosePopUp}
        complaint={selectedKomplain}
        responseData={responseData}
        loading={loadingResponse}
      />
    </div>
  );
};
