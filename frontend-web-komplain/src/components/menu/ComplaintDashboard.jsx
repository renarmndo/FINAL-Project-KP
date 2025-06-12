import React, { useState, useEffect } from "react";
import {
  X,
  AlertCircle,
  Send,
  Search,
  Menu,
  Bell,
  User,
  ChevronDown,
  Pencil,
  Trash2,
  Plus,
  Filter,
  Download,
  ArrowRight,
  CheckCircle,
  Clock,
  Inbox,
  Eye,
} from "lucide-react";

import { getUser } from "../../auth/authService";
import {
  getMyComplain,
  deleteKomplain,
  editKomplain,
} from "../../service/getMyComplain";
import { EditKomplainPopUp } from "../../assets/popup/agent/EditKomplainPopUp";
import Swal from "sweetalert2";

export const ComplaintDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [komplain, setKomplain] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedKomplain, setSelectedKomplain] = useState(null);
  const [setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
  });
  const [selectedRow, setSelectedRow] = useState(null);

  const user = getUser();

  // Pindahkan fetchDataKomplain ke dalam komponen agar bisa diakses di semua fungsi
  const fetchDataKomplain = async () => {
    setLoading(true);
    try {
      const data = await getMyComplain();
      setKomplain(data);
      console.log("Ini adalah komplain saya", data);
      calculateStats(data);
    } catch (error) {
      console.error("Gagal Mendapatkan Data", error);
    } finally {
      setLoading(false);
    }
  };

  // handle popup

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calculate dashboard statistics
  const calculateStats = (data) => {
    const stats = {
      total: data.length, // Fix: tambahkan total calculation
      pending: data.filter((item) => item.status === "pending").length,
      processing: data.filter((item) => item.status === "processing").length,
      completed: data.filter((item) => item.status === "completed").length,
    };
    setDashboardStats(stats);
  };

  // get data komplain
  useEffect(() => {
    fetchDataKomplain();
  }, []);

  // Filter komplain berdasarkan status dan search query
  const filteredKomplain = komplain.filter((item) => {
    const matchesSearch =
      item.nomor_Indihome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama_Pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.noTlp_Pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email_Pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alamat_Pelanggan.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === "all") return matchesSearch;
    return item.status === filterStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-600"; // fallback default
    const s = status.toLowerCase();
    if (s === "processing") return "bg-yellow-100 text-yellow-700";
    if (s === "completed") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  const getStatusIcon = (status) => {
    if (!status) return <Clock size={14} />;
    const s = status.toLowerCase();
    if (s === "processing") return <Clock size={14} />;
    if (s === "completed") return <CheckCircle size={14} />;
    return <Inbox size={14} />;
  };

  const getStatusText = (status) => {
    if (!status || status === "pending") return "Belum Dikerjakan";
    if (status === "completed") return "Sudah di-respons";
    if (status === "processing") return "Sedang Diproses";
    if (status === "rejected") return "Di Tolak";
    return "Status Belum Diverifikasi";
  };

  const handleRowClick = (item) => {
    setSelectedRow(selectedRow?.id === item.id ? null : item);
  };

  // Fix: edit delete functions
  const handleEdit = (komplainItem) => {
    console.log("Edit komplain:", komplainItem); // Debug log

    // Validasi status - tidak bisa edit jika sedang processing atau completed
    const status = komplainItem.status?.toLowerCase();
    if (status === "completed" || status === "processing") {
      Swal.fire({
        title: "Tidak Dapat Diedit",
        text: `Komplain dengan status "${komplainItem.status}" tidak dapat diedit.`,
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }
    // Jika status pending, lanjutkan ke edit
    setSelectedKomplain(komplainItem);
    setShowModal(true);
  };

  const handleDelete = async (komplain) => {
    const status = komplain.status?.toLowerCase();
    if (status === "completed" || status === "processing") {
      Swal.fire({
        title: "Tidak Dapat Dihapus",
        text: `Komplain dengan status "${komplain.status}" tidak dapat dihapus.`,
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Yakin ingin menghapus komplain ini?",
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteKomplain(komplain.id); // ✅ Menggunakan komplain.id untuk API call
        await fetchDataKomplain();
        Swal.fire("Berhasil!", "Komplain telah dihapus.", "success");
      } catch (error) {
        console.error("Gagal menghapus komplain:", error);

        const message =
          error.response?.data?.msg ||
          "Gagal menghapus komplain. Silakan coba lagi.";

        Swal.fire("Gagal", message, "error");
      }
    }
  };
  const handleUpdate = async (updatedData) => {
    try {
      await editKomplain(updatedData.id, updatedData); // Fungsi API untuk update data

      setShowModal(false);
      setSelectedKomplain(null);
      await fetchDataKomplain(); // Refresh data

      // Tampilkan popup sukses
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Komplain berhasil diupdate.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Gagal mengupdate komplain:", error);

      // Tampilkan popup error
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal mengupdate komplain. Silakan coba lagi.",
      });
    }
  };

  return (
    <div className="w-full flex h-screen bg-gray-50">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                className="md:hidden mr-4 text-gray-600 hover:text-gray-900"
                onClick={toggleMenu}
              >
                <Menu size={24} />
              </button>
              <h2 className="text-lg font-medium text-gray-800">
                Dashboard Komplain
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-1 rounded-full hover:bg-gray-100 relative">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              </div>

              <div className="border-l border-gray-300 h-6 mx-2"></div>

              <div className="relative">
                <button className="flex items-center text-sm rounded-full py-1 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100">
                  <User size={16} className="mr-2" />
                  <span className="font-medium">{user?.role || "Agent"}</span>
                  <ChevronDown size={14} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Komplain
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {dashboardStats.total}
                  </h3>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Inbox size={20} className="text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowRight size={14} className="text-blue-500 mr-1" />
                <span className="text-gray-600">Data keseluruhan</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Belum Dikerjakan
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {dashboardStats.pending}
                  </h3>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock size={20} className="text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowRight size={14} className="text-red-500 mr-1" />
                <span className="text-gray-600">Butuh perhatian segera</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Sedang Diproses
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {dashboardStats.processing}
                  </h3>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock size={20} className="text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowRight size={14} className="text-yellow-500 mr-1" />
                <span className="text-gray-600">Dalam pengerjaan</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Sudah Selesai
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {dashboardStats.completed}
                  </h3>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowRight size={14} className="text-green-500 mr-1" />
                <span className="text-gray-600">Komplain teratasi</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 border-b border-gray-200">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Daftar Data Komplain
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Kelola semua keluhan pelanggan
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari komplain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full md:w-auto"
                  />
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                </div>

                <div className="flex space-x-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Belum Dikerjakan</option>
                    <option value="processing">Sedang Diproses</option>
                    <option value="rejected">Di Tolak</option>
                    <option value="completed">Sudah Selesai</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Complaints Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Memuat data...</p>
                  </div>
                </div>
              ) : filteredKomplain.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Msisdn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Pelanggan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Layanan Komplain
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No Telepon
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email Pelanggan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alamat Pelanggan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tindakan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredKomplain.map((item) => (
                      <React.Fragment key={item.id}>
                        <tr
                          className={`hover:bg-red-50 transition-colors cursor-pointer ${
                            selectedRow?.id === item.id ? "bg-red-50" : ""
                          }`}
                          onClick={() => handleRowClick(item)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.nomor_Indihome}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item.nama_Pelanggan}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item.layanan?.nama_layanan}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {item.noTlp_Pelanggan}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {item.email_Pelanggan}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {item.alamat_Pelanggan}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                item.status
                              )}`}
                            >
                              <span className="flex items-center">
                                {getStatusIcon(item.status)}
                                <span className="ml-1">
                                  {getStatusText(item.status)}
                                </span>
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button className="p-1 rounded-full hover:bg-blue-100 transition-colors">
                                <Eye size={18} className="text-blue-600" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Fix: prevent row click
                                  handleEdit(item); // Fix: pass item instead of komplain
                                }}
                                className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                              >
                                <Pencil size={18} className="text-blue-600" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Fix: prevent row click
                                  handleDelete(item); // Fix: pass item.id
                                }}
                                className="p-1 rounded-full hover:bg-red-100 transition-colors"
                              >
                                <Trash2 size={18} className="text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {selectedRow?.id === item.id && (
                          <tr className="bg-red-50">
                            <td colSpan="8" className="px-6 py-4">
                              {" "}
                              {/* Fix: colSpan should match number of columns */}
                              <div className="text-sm text-gray-700">
                                <div className="font-medium mb-2">
                                  Detail Komplain:
                                </div>
                                <p className="mb-2">{item.description}</p>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-xs text-gray-500">
                                      No. Telepon
                                    </div>
                                    <div>{item.noTlp_Pelanggan || "-"}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500">
                                      Email
                                    </div>
                                    <div>{item.email_Pelanggan || "-"}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500">
                                      Alamat
                                    </div>
                                    <div>{item.alamat_Pelanggan || "-"}</div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              ) : (
                // Pesan ketika tidak ada data
                <div className="text-center py-12 bg-white">
                  <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-700 mb-1">
                    Data komplain kosong
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {searchQuery || filterStatus !== "all"
                      ? "Tidak ada data yang cocok dengan kriteria pencarian"
                      : "Belum ada komplain yang diajukan oleh pelanggan."}
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <Plus size={16} className="mr-2" />
                    Ajukan Komplain Baru
                  </button>
                </div>
              )}
            </div>

            {filteredKomplain.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Menampilkan {filteredKomplain.length} dari {komplain.length}{" "}
                  komplain
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-4 py-2 border border-gray-300 bg-gray-100 rounded-md text-sm">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Fix: modal edit - gunakan showModal dan selectedKomplain */}
      {showModal && selectedKomplain && (
        <EditKomplainPopUp
          komplain={selectedKomplain} // Fix: pass data komplain yang dipilih
          onClose={() => {
            setShowModal(false);
            setSelectedKomplain(null);
          }}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default ComplaintDashboard;
