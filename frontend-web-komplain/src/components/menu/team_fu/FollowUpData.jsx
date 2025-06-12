import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronUp,
  ChevronDown,
  Calendar,
  Users,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../../../auth/authService";

export const FollowUpData = () => {
  // Sample data for demonstration - replace with actual API data
  const [followUpData, setFollowUpData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterPriority, setFilterPriority] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter data to only show completed status
  const completedData = useMemo(() => {
    return followUpData.filter(
      (item) => item.status.toLowerCase() === "completed"
    );
  }, [followUpData]);

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    let filteredData = completedData.filter(
      (item) =>
        item.nama_Pelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nomor_Indihome.includes(searchTerm) ||
        item.noTlp_Pelanggan.includes(searchTerm) ||
        item.email_Pelanggan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterPriority) {
      filteredData = filteredData.filter(
        (item) => item.priority === filterPriority
      );
    }

    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [completedData, searchTerm, sortConfig, filterPriority]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Statistics for completed data only
  const stats = useMemo(() => {
    const total = completedData.length;
    const highPriority = completedData.filter(
      (item) => item.priority === "High"
    ).length;
    const mediumPriority = completedData.filter(
      (item) => item.priority === "Medium"
    ).length;
    const lowPriority = completedData.filter(
      (item) => item.priority === "Low"
    ).length;
    const thisMonth = completedData.filter((item) => {
      const followUpDate = new Date(item.tanggal_followup);
      const currentDate = new Date();
      return (
        followUpDate.getMonth() === currentDate.getMonth() &&
        followUpDate.getFullYear() === currentDate.getFullYear()
      );
    }).length;

    return { total, highPriority, mediumPriority, lowPriority, thisMonth };
  }, [completedData]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-700 border border-red-200";
      case "Medium":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Low":
        return "bg-green-50 text-green-700 border border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return (
        <ChevronUp className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      );
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 text-red-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-red-600" />
    );
  };

  //
  // fetcing api
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${API_URL}/teamfu/komplain/handler`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setFollowUpData(response.data.data); // asumsi struktur { data: { data: [...] } }
        console.log("Ini datanya", response.data.data);
      } catch (error) {
        console.log("Error saat fetch:", error);
      }
    };
    fetchData();
  }, []);

  // Detail Modal Component
  const DetailModal = () => {
    if (!showDetailModal || !selectedData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Detail Follow Up
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    MSISDN
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedData.nomor_Indihome}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Nama Pelanggan
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedData.nama_Pelanggan}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    No. Telepon
                  </label>
                  <p className="text-lg text-gray-900">
                    {selectedData.noTlp_Pelanggan}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-lg text-gray-900">
                    {selectedData.email_Pelanggan}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Layanan
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedData.layananId?.nama_Layanan}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Priority
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                      selectedData.priority
                    )}`}
                  >
                    {selectedData.priority}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                    Completed
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Tanggal Follow Up
                  </label>
                  <p className="text-lg text-gray-900">
                    {new Date(selectedData.createdAt).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>

            {selectedData.keterangan && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Keterangan
                </label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg mt-2">
                  {selectedData.keterangan}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Daftar Data Follow Up
              </h1>
              <p className="text-sm text-gray-600">
                Data pelanggan IndiHome yang telah diselesaikan
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Completed
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  High Priority
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.highPriority}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Medium Priority
                </p>
                <p className="text-3xl font-bold text-amber-600">
                  {stats.mediumPriority}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Low Priority
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.lowPriority}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  This Month
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.thisMonth}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari nama, nomor IndiHome, telepon, atau email..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Priority Filter */}
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 bg-gray-50 hover:bg-white text-gray-700"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="">Semua Priority</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort("nomor_Indihome")}
                      className="group flex items-center gap-2 hover:text-red-600 transition-colors duration-200"
                    >
                      MSISDN
                      <SortIcon column="nomor_Indihome" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort("nama_Pelanggan")}
                      className="group flex items-center gap-2 hover:text-red-600 transition-colors duration-200"
                    >
                      Nama Pelanggan
                      <SortIcon column="nama_Pelanggan" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort("noTlp_Pelanggan")}
                      className="group flex items-center gap-2 hover:text-red-600 transition-colors duration-200"
                    >
                      No. Telepon
                      <SortIcon column="noTlp_Pelanggan" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort("layananId")}
                      className="group flex items-center gap-2 hover:text-red-600 transition-colors duration-200"
                    >
                      Layanan
                      <SortIcon column="layananId" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort("priority")}
                      className="group flex items-center gap-2 hover:text-red-600 transition-colors duration-200"
                    >
                      Priority
                      <SortIcon column="priority" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort("tanggal_followup")}
                      className="group flex items-center gap-2 hover:text-red-600 transition-colors duration-200"
                    >
                      Tanggal Follow Up
                      <SortIcon column="tanggal_followup" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                        {item.nomor_Indihome}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mr-3 group-hover:from-red-200 group-hover:to-red-300 transition-all duration-200">
                          <Users className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {item.nama_Pelanggan}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.email_Pelanggan}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        {item.noTlp_Pelanggan}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.layanan?.nama_layanan || "Layanan tidak ditemukan"}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div>
                            {new Date(item.createdAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(item.updatedAt).toLocaleTimeString(
                              "id-ID",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedData(item);
                          setShowDetailModal(true);
                        }}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-xl transition-all duration-200 group-hover:scale-110"
                        title="Lihat Detail"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Data tidak ditemukan
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Tidak ada data completed yang sesuai dengan filter atau kata
                kunci pencarian Anda
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-gray-600">
              Menampilkan {startIndex + 1}-
              {Math.min(
                startIndex + itemsPerPage,
                filteredAndSortedData.length
              )}{" "}
              dari {filteredAndSortedData.length} data completed
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                      currentPage === i + 1
                        ? "text-white bg-gradient-to-r from-red-600 to-red-700 shadow-md"
                        : "text-gray-500 bg-white border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <DetailModal />
    </div>
  );
};
