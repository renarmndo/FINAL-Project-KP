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
} from "lucide-react";

import { API_URL, getUser } from "../../auth/authService";
import { getMyComplain } from "../../service/getMyComplain";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const ComplaintDashboard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [komplain, setKomplain] = useState([]);
  const [titleOptions, setTitleOptions] = useState([
    "Kesalahan Jaringan",
    "Pulsa Tidak Masuk",
    "Internet Lambat",
    "SMS Tidak Terkirim",
    "Tagihan Tidak Sesuai",
  ]);

  const [formData, setFormData] = useState({
    msisdn: "",
    title: "",
    description: "",
    priorty: "low",
  });

  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const user = getUser();

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

  // get data komplain
  useEffect(() => {
    const fetchDataKomplain = async () => {
      try {
        const data = await getMyComplain();
        console.log(data);
        setKomplain(data);
      } catch (error) {
        console.error("Gagal Mendapatkan Data", error);
      }
    };
    fetchDataKomplain();
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    if (!isPopupOpen) {
      setFormData({
        msisdn: "",
        title: "",
        description: "",
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectTitle = (title) => {
    setFormData({
      ...formData,
      title,
    });
    setIsSelectOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ⬅️ Wajib untuk mencegah URL berubah!
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/komplain`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Komplain Berhasil Terkirim",
        timer: 1500,
        showConfirmButton: false, // ✅ boolean, bukan string
        timerProgressBar: true, // opsional biar ada bar countdown
      });

      // ⬇ Tambahkan data komplain baru ke list (biar gak perlu refresh)
      setKomplain((prev) => [...prev, response.data.data]);
      setIsPopupOpen(false);

      setFormData({
        msisdn: "",
        title: "",
        description: "",
        priorty: "low",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi Kesalahan saat mengirim komplain",
        confirmButtonColor: "#d33",
      });
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "text-gray-400"; // fallback default
    const s = status.toLowerCase();
    if (s === "processing") return "text-yellow-500";
    if (s === "completed") return "text-green-500";
    return "text-red-500";
  };

  return (
    <div className="flex h-screen bg-gray-50 p-4">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button className="md:hidden mr-2" onClick={toggleMenu}>
                <Menu size={24} />
              </button>
              <h2 className="text-lg font-medium text-gray-800">
                Dashboard Komplain
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-1 rounded-full hover:bg-gray-100">
                <Bell size={20} className="text-gray-600" />
              </button>
              <button className="flex items-center text-sm bg-red-50 text-red-700 rounded-full py-1 px-3 py-2 hover:bg-red-100">
                <User size={16} className="mr-1" />
                <span>{user?.role}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Daftar Data Komplain
              </h1>
              <p className="text-gray-600">Kelola semua keluhan pelanggan</p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari komplain..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
              <button
                onClick={togglePopup}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center"
              >
                <span>Tambah Komplain</span>
              </button>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w1/6 px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      MSISDN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      Judul
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(komplain) && komplain.length > 0 ? (
                    komplain.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-red-50 transition-colors cursor-pointer duration-300"
                      >
                        <td className="text-gray-800 px-6 py-4 break-words text-sm">
                          {item.msisdn}
                        </td>
                        <td className="px-6 py-4 break-words text-sm">
                          {item.title}
                        </td>
                        <td className="px-6 py-4 break-words text-sm">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 break-words text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {formatDate(item.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={"5"}
                        className="text-center py-4 text-gray-500"
                      >
                        Tidak ada data komplain.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Complaint Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl p-6 relative">
            <button
              onClick={togglePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tambah Komplain Baru
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MSISDN (Nomor Telepon)
                </label>
                <input
                  type="number"
                  name="msisdn"
                  placeholder="e.g. 08764532112"
                  value={formData.msisdn}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Komplain
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {formData.title || "Pilih judul komplain"}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isSelectOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isSelectOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      {titleOptions.map((title, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelectTitle(title)}
                          className="px-3 py-2 hover:bg-red-50 cursor-pointer"
                        >
                          {title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  placeholder="Jelaskan detail permasalahan..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={togglePopup}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
