import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../auth/authService";
import Swal from "sweetalert2";
import { User } from "lucide-react";

const TambahDataKomplain = ({ onClose, onSuccess }) => {
  const [layananList, setLayananList] = useState([]);
  const [selectedLayanan, setSelectedLayanan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nomor_Indihome: "",
    nama_Pelanggan: "",
    noTlp_Pelanggan: "",
    email_Pelanggan: "",
    alamat_Pelanggan: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/komplain`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: response.data.msg || "Data Komplain Berhasil Terkirim",
        timer: 1500,
        showCancelButton: false,
        timerProgressBar: true,
      });

      onSuccess(response.data.data);
      onClose();

      // reset form
      setFormData({
        nomor_Indihome: "",
        nama_Pelanggan: "",
        noTlp_Pelanggan: "",
        email_Pelanggan: "",
        alamat_Pelanggan: "",
      });
    } catch (error) {
      const msg = error?.response?.data?.msg || "Terjadi Kesalahan Pada Server";
      Swal.fire({
        icon: "error",
        title: "Opps..",
        text: msg,
      });
    }
  };

  // Ambil data layanan dari API
  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/komplain`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLayananList(response.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil data layanan:", error);
      }
    };

    fetchLayanan();
  }, []);

  // Fungsi ketika card layanan diklik
  const handleCardClick = (layanan) => {
    setSelectedLayanan(layanan);
    setShowForm(true);
  };

  // Callback setelah submit berhasil
  const handleSuccess = (data) => {
    console.log("Komplain berhasil diajukan:", data);
    setShowForm(false); // Tutup form setelah sukses
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 ">
      <div className="mt-2 p-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Form Input Data Komplain
        </h1>
        <p className="text-gray-500 text-sm">
          Process Komplain request from customer
        </p>
      </div>
      <div className="bg-white rounded-lg w-full p-6 shadow">
        <div className="flex items-center mb-6 gap-2">
          <User size={30} className="text-red-500" />
          <h1 className="text-xl font-semibold text-gray-800">
            Customer Information
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nomor_Indihome"
            placeholder="Nomor Indihome"
            value={formData.nomor_Indihome}
            onChange={handleChange}
            className="w-full p-3 border border-red-300 rounded focus:outline-red-500"
          />
          <input
            type="text"
            name="nama_Pelanggan"
            placeholder="Nama Pelanggan"
            value={formData.nama_Pelanggan}
            onChange={handleChange}
            className="w-full p-3 border border-red-300 rounded focus:outline-red-500"
          />
          <input
            type="text"
            name="noTlp_Pelanggan"
            placeholder="No Telepon Pelanggan"
            value={formData.noTlp_Pelanggan}
            onChange={handleChange}
            className="w-full p-3 border border-red-300 rounded focus:outline-red-500"
          />
          <input
            type="email"
            name="email_Pelanggan"
            placeholder="Email Pelanggan"
            value={formData.email_Pelanggan}
            onChange={handleChange}
            className="w-full p-3 border border-red-300 rounded focus:outline-red-500"
          />
          <textarea
            name="alamat_Pelanggan"
            placeholder="Alamat Pelanggan"
            value={formData.alamat_Pelanggan}
            onChange={handleChange}
            className="w-full p-3 border border-red-300 rounded focus:outline-red-500"
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
          >
            Kirim
          </button>
        </form>
      </div>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Pilih Layanan
        </h1>

        {/* Daftar Card Layanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {layananList.length > 0 ? (
            layananList.map((layanan) => (
              <div
                key={layanan.id}
                onClick={() => handleCardClick(layanan)}
                className="bg-white p-4 rounded shadow hover:shadow-md cursor-pointer transition"
              >
                <h2 className="text-lg font-bold text-gray-700">
                  {layanan.nama}
                </h2>
                <p className="text-sm text-gray-500">{layanan.deskripsi}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Belum ada layanan tersedia.</p>
          )}
        </div>

        {/* Form Input Komplain - Muncul jika showForm = true */}
        {showForm && selectedLayanan && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Form Komplain untuk Layanan:{" "}
              <span className="font-normal">{selectedLayanan.nama}</span>
            </h2>
            <TambahDataKomplain
              onClose={() => setShowForm(false)}
              onSuccess={handleSuccess}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TambahDataKomplain;
