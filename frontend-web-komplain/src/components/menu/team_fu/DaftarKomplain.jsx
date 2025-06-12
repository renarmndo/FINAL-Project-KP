import React, { useEffect, useState } from "react";
import {
  responseKomplain,
  rejectedKomplain,
} from "../../../service/getMyComplain";
import Swal from "sweetalert2";

export const DaftarKomplain = () => {
  const [dataKomplain, setDataKomplain] = useState([]);
  const [selectedKomplain, setSelectedKomplain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;
  const [jawaban, setJawaban] = useState("");
  const [catatanInternal, setCatatanInternal] = useState("");

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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setDataKomplain(result.data || []);
        console.log("Ini Datanya", result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);

        // Sample data for demonstration
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to refresh data after response
  const refreshData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/webKp/teamfu/komplain",
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("token") || ""}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setDataKomplain(result.data || []);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // state response komplain
  const handleBalasanSubmit = async () => {
    if (!selectedKomplain || !selectedKomplain.id) {
      Swal.fire("Gagal", "Silahakan pilih komplain terlebih dahulu.", "error");
      return;
    }

    // Check if complaint is already completed or rejected
    if (
      selectedKomplain.status === "completed" ||
      selectedKomplain.status === "rejected"
    ) {
      Swal.fire({
        title: "Tidak Dapat Merespon",
        text: `Komplain ini sudah ${
          selectedKomplain.status === "completed" ? "selesai" : "ditolak"
        } dan tidak dapat diberikan response lagi.`,
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (!jawaban.trim()) {
      Swal.fire("Gagal", "Jawaban tidak boleh kosong", "error");
      return;
    }

    try {
      // Show loading
      Swal.fire({
        title: "Mengirim Response...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await responseKomplain(selectedKomplain.id, jawaban, catatanInternal);

      // Update status locally for real-time update
      setDataKomplain((prevData) =>
        prevData.map((item) =>
          item.id === selectedKomplain.id
            ? { ...item, status: "completed" }
            : item
        )
      );

      // Also update the selected komplain
      setSelectedKomplain((prev) => ({ ...prev, status: "completed" }));

      // Close modal and reset form
      setShowModal(false);
      setJawaban("");
      setCatatanInternal("");

      Swal.fire("Berhasil", "Respon komplain berhasil dikirim.", "success");

      // Refresh data from server to ensure consistency
      await refreshData();

      setSelectedKomplain(null);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.msg || "Terjadi kesalahan saat mengirim respon.",
        "error"
      );
    }
  };

  // Handle reject komplain
  const handleRejectKomplain = async () => {
    if (!selectedKomplain || !selectedKomplain.id) {
      Swal.fire("Gagal", "Silahakan pilih komplain terlebih dahulu.", "error");
      return;
    }

    // Check if complaint is already completed or rejected
    if (
      selectedKomplain.status === "completed" ||
      selectedKomplain.status === "rejected"
    ) {
      Swal.fire({
        title: "Tidak Dapat Menolak",
        text: `Komplain ini sudah ${
          selectedKomplain.status === "completed" ? "selesai" : "ditolak"
        } sebelumnya.`,
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (!catatanInternal.trim()) {
      Swal.fire(
        "Gagal",
        "Catatan internal harus diisi untuk menolak komplain",
        "error"
      );
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Konfirmasi Penolakan",
      text: "Apakah Anda yakin ingin menolak komplain ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Tolak",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      // Show loading
      Swal.fire({
        title: "Menolak Komplain...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await rejectedKomplain(selectedKomplain.id, catatanInternal);

      // Update status locally for real-time update
      setDataKomplain((prevData) =>
        prevData.map((item) =>
          item.id === selectedKomplain.id
            ? { ...item, status: "rejected" }
            : item
        )
      );

      // Also update the selected komplain
      setSelectedKomplain((prev) => ({ ...prev, status: "rejected" }));

      // Close modal and reset form
      setShowModal(false);
      setJawaban("");
      setCatatanInternal("");

      Swal.fire("Berhasil", "Komplain berhasil ditolak.", "success");

      // Refresh data from server to ensure consistency
      await refreshData();

      setSelectedKomplain(null);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.msg || "Terjadi kesalahan saat menolak komplain.",
        "error"
      );
    }
  };

  // Filter and search logic
  const filteredData = dataKomplain.filter((item) => {
    const matchesSearch =
      (item.nama_pelanggan || item.nama_Pelanggan || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.nomor_Indohome?.includes(searchTerm) ||
      item.no_telepon?.includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = {
    total: dataKomplain.length,
    pending: dataKomplain.filter((item) => item.status === "pending").length,
    processing: dataKomplain.filter((item) => item.status === "processing")
      .length,
    completed: dataKomplain.filter((item) => item.status === "completed")
      .length,
    rejected: dataKomplain.filter((item) => item.status === "rejected").length,
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDetailClick = (komplain) => {
    setSelectedKomplain(komplain);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data komplain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Daftar Komplain
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Kelola dan pantau semua komplain pelanggan
              </p>
              {error && (
                <div className="mt-2 px-3 py-1 bg-yellow-100 border border-yellow-300 rounded-md text-sm text-yellow-800">
                  <span className="font-medium">Info:</span> Menggunakan data
                  demo (API: {error})
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-400">
            <h3 className="text-sm font-medium text-gray-600">Total</h3>
            <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-400">
            <h3 className="text-sm font-medium text-gray-600">Pending</h3>
            <p className="text-2xl font-bold text-orange-500">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-400">
            <h3 className="text-sm font-medium text-gray-600">Dalam Proses</h3>
            <p className="text-2xl font-bold text-yellow-500">
              {stats.processing}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-400">
            <h3 className="text-sm font-medium text-gray-600">Selesai</h3>
            <p className="text-2xl font-bold text-green-500">
              {stats.completed}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-400">
            <h3 className="text-sm font-medium text-gray-600">Ditolak</h3>
            <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Komplain
              </label>
              <input
                type="text"
                placeholder="Cari berdasarkan nama, nomor indihome, telepon, atau deskripsi..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Status
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Dalam Proses</option>
                <option value="completed">Selesai</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-50 to-white border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-red-700 uppercase tracking-wider">
                    Msisdn
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-red-700 uppercase tracking-wider">
                    Nama Pelanggan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-red-700 uppercase tracking-wider">
                    No Telepon
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-red-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-red-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-red-700 uppercase tracking-wider">
                    Handler
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-red-700 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-red-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-400 mb-4"
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
                        <p className="text-lg font-medium">
                          Tidak ada data komplain
                        </p>
                        <p className="text-sm">
                          Belum ada komplain yang sesuai dengan filter yang
                          dipilih
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-red-25 hover:bg-opacity-20 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">
                        {item.nomor_Indihome}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.nama_Pelanggan}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.noTlp_Pelanggan}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                        {item.email_Pelanggan}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "pending"
                              ? "bg-orange-100 text-orange-800 border border-orange-200"
                              : item.status === "completed"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : item.status === "rejected"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : item.status === "processing"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          {item.status === "pending"
                            ? "Pending"
                            : item.status === "processing"
                            ? "Revised"
                            : item.status === "completed"
                            ? "Approved"
                            : item.status === "rejected"
                            ? "Rejected"
                            : item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                        {item.Handler?.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDetailClick(item)}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors duration-200"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - sama seperti sebelumnya */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Menampilkan{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  -{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredData.length)}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium">{filteredData.length}</span>{" "}
                  hasil
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      currentPage === 1
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-red-600 bg-white border border-red-200 hover:bg-red-50"
                    }`}
                  >
                    Sebelumnya
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            currentPage === page
                              ? "bg-red-600 text-white"
                              : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      currentPage === totalPages
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-red-600 bg-white border border-red-200 hover:bg-red-50"
                    }`}
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail */}
      {showModal && selectedKomplain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detail Komplain
                </h3>
                <button
                  onClick={() => setShowModal(false)}
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

            {/* Modal Body */}
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Msisdn
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">
                      {selectedKomplain.nomor_Indohome ||
                        selectedKomplain.nomor_Indihome}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nama Pelanggan
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedKomplain.nama_Pelanggan}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      No Telepon
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedKomplain.noTlp_Pelanggan}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tanggal
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(selectedKomplain.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                        selectedKomplain.status === "pending"
                          ? "bg-orange-100 text-orange-800"
                          : selectedKomplain.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : selectedKomplain.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedKomplain.status === "pending"
                        ? "Pending"
                        : selectedKomplain.status === "processing"
                        ? "Proses"
                        : selectedKomplain.status === "completed"
                        ? "Selesai"
                        : selectedKomplain.status === "rejected"
                        ? "Ditolak"
                        : selectedKomplain.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Prioritas
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize mt-1 ${
                        selectedKomplain.priority === "low"
                          ? "bg-red-100 text-red-800"
                          : selectedKomplain.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedKomplain.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Deskripsi Komplain
                  </label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">
                      {selectedKomplain.layanan?.nama_layanan ||
                        "Tidak ada deskripsi"}
                    </p>
                  </div>
                </div>

                {/* Show response form only if status is not completed or rejected */}
                {selectedKomplain.status !== "completed" &&
                  selectedKomplain.status !== "rejected" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Berikan Response
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          rows="4"
                          placeholder="Tulis balasan untuk komplain ini..."
                          value={jawaban}
                          onChange={(e) => setJawaban(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catatan Internal
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          rows="4"
                          placeholder="Tulis catatan internal (opsional untuk respon, wajib untuk penolakan)..."
                          value={catatanInternal}
                          onChange={(e) => setCatatanInternal(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                {/* Show previous response if completed */}
                {selectedKomplain.status === "completed" &&
                  selectedKomplain.response && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Respon Sebelumnya
                      </label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-900">
                          {selectedKomplain.response}
                        </p>
                      </div>
                    </div>
                  )}

                {/* Show rejection note if rejected */}
                {selectedKomplain.status === "rejected" &&
                  selectedKomplain.catatanInternal && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Catatan Penolakan
                      </label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-900">
                          {selectedKomplain.catatanInternal}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setJawaban("");
                    setCatatanInternal("");
                    setSelectedKomplain(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
                >
                  Tutup
                </button>
                {selectedKomplain.status !== "completed" &&
                  selectedKomplain.status !== "rejected" && (
                    <>
                      <button
                        onClick={handleRejectKomplain}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                      >
                        Tolak Komplain
                      </button>
                      <button
                        onClick={handleBalasanSubmit}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                      >
                        Kirim Respon
                      </button>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarKomplain;
