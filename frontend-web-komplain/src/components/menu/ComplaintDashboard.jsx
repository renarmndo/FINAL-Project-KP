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
} from "lucide-react";

import { getUser } from "../../auth/authService";
import { getMyComplain } from "../../service/getMyComplain";
import TambahDataKomplain from "./agent/tambahDataKomplain";

export const ComplaintDashboard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [komplain, setKomplain] = useState([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [komplainList, setKomplainList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = getUser();

  // handle popup
  const handleTambahKomplain = (komplainBaru) => {
    setKomplainList((prev) => [...prev, komplainBaru]);
  };

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

  const getStatusColor = (status) => {
    if (!status) return "text-gray-400"; // fallback default
    const s = status.toLowerCase();
    if (s === "processing") return "text-yellow-500";
    if (s === "completed") return "text-green-500";
    return "text-red-500";
  };

  return (
    <div className="w-full flex h-screen bg-gray-50 p-4">
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
            </div>
          </div>

          {/* Complaints Table */}
          <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w1/6 px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      No Indihome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      Nama Pelanggan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      No Telepon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      Email Pelanggan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      Alamat Pelanggan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      Action
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
                            {item.status === "pending"
                              ? "Belum Dikerjakan"
                              : item.status === "completed"
                              ? "Sudah di-respons"
                              : "Status Belum Diverifikasi"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-4 py-4 break-words text-sm">
                          <div className="flex gap-2">
                            <button>
                              <Pencil
                                size={15}
                                className="text-blue-500 cursor-pointer"
                              />
                            </button>
                            <button>
                              <Trash2
                                size={15}
                                className="text-red-500 cursor-pointer"
                              />
                            </button>
                          </div>
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
      {isModalOpen && (
        <TambahDataKomplain
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleTambahKomplain}
        />
      )}
    </div>
  );
};
