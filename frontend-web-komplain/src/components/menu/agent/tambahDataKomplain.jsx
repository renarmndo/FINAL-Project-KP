import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../auth/authService";
import Swal from "sweetalert2";
import {
  User,
  FileText,
  ArrowLeft,
  CheckCircle,
  Settings,
  Building2,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Clock,
  Zap,
} from "lucide-react";

const TambahDataKomplain = () => {
  const [layananList, setLayananList] = useState([]);
  const [selectedLayanan, setSelectedLayanan] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("layanan");
  const [formData, setFormData] = useState({
    nomor_Indihome: "",
    nama_Pelanggan: "",
    noTlp_Pelanggan: "",
    email_Pelanggan: "",
    alamat_Pelanggan: "",
    notes: "",
    layananId: selectedLayanan,
    priority: "medium",
    fields: {},
  });

  // Mengambil data layanan saat komponen dimuat
  useEffect(() => {
    fetchLayanan();
  }, []);

  // Mengambil data field list saat layanan dipilih
  useEffect(() => {
    if (selectedLayanan) {
      fetchFieldList(selectedLayanan.id);
      setFormData((prev) => ({
        ...prev,
        layananId: selectedLayanan.id,
      }));
    }
  }, [selectedLayanan]);

  const fetchLayanan = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/komplain/agent/layanan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLayananList(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data layanan:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal mengambil data layanan. Silakan coba lagi.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFieldList = async (layananId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/komplain/agent/layanan/${layananId}/field`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFormFields(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil field list:", error);
      Swal.fire({
        icon: "warning",
        title: "Informasi",
        text: "Belum ada form tambahan untuk layanan ini!",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLayananClick = (layanan) => {
    setSelectedLayanan(layanan);
    setStep("customer");
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validasi untuk nomor Indihome - hanya angka
    if (name === "nomor_Indihome") {
      // Cek jika ada karakter selain angka
      if (value && !/^\d+$/.test(value)) {
        Swal.fire({
          title: "Input Tidak Valid",
          text: "Nomor Indihome hanya boleh berisi angka!",
          icon: "warning",
          confirmButtonText: "OK",
          timer: 3000,
          timerProgressBar: true,
        });
        return; // Tidak update state jika invalid
      }
    }

    // Validasi untuk nomor telepon - hanya angka
    if (name === "noTlp_Pelanggan") {
      // Cek jika ada karakter selain angka
      if (value && !/^\d+$/.test(value)) {
        Swal.fire({
          title: "Input Tidak Valid",
          text: "Nomor telepon hanya boleh berisi angka!",
          icon: "warning",
          confirmButtonText: "OK",
          timer: 3000,
          timerProgressBar: true,
        });
        return; // Tidak update state jika invalid
      }
    }

    // Update state jika validasi lolos
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleCustomerFormSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.nomor_Indihome ||
      !formData.nama_Pelanggan ||
      !formData.noTlp_Pelanggan
    ) {
      Swal.fire({
        icon: "warning",
        title: "Form Tidak Lengkap",
        text: "Mohon lengkapi semua field yang wajib diisi",
        confirmButtonColor: "#dc2626",
      });
      return;
    }
    setStep("fields");
  };

  console.log("Data yang dikirim : ", formData);

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token");
    console.log(token, "ini tokennya guyas");
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/komplain/create-komplain`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setStep("success");
      setTimeout(() => {
        resetForm();
      }, 7000);
    } catch (error) {
      const msg = error?.response?.data?.msg || "Terjadi Kesalahan Pada Server";
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: msg,
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nomor_Indihome: "",
      nama_Pelanggan: "",
      noTlp_Pelanggan: "",
      email_Pelanggan: "",
      alamat_Pelanggan: "",
      notes: "",
      layananId: "",
      priority: "",
      fields: {},
    });
    setSelectedLayanan(null);
    setFormFields([]);
    setStep("layanan");
  };

  const goBack = () => {
    if (step === "customer") setStep("layanan");
    else if (step === "fields") setStep("customer");
  };

  // Render layanan selection dengan grid yang lebih profesional
  const renderLayananSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Settings className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Pilih Jenis Layanan
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Pilih layanan yang mengalami masalah untuk melanjutkan proses
          pengajuan komplain
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {layananList.map((layanan) => (
          <div
            key={layanan.id}
            onClick={() => handleLayananClick(layanan)}
            className="group relative bg-white border border-gray-200 hover:border-red-300 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 group-hover:from-red-600 group-hover:to-red-700 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4 text-red-600 rotate-180" />
                  </div>
                </div>
              </div>

              <h3 className="text-md font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                {layanan.nama_layanan}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {layanan.deskripsi_layanan}
              </p>

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 group-hover:bg-red-100 transition-colors">
                  <Zap className="w-3 h-3 mr-1" />
                  Pilih Layanan
                </span>
                <div className="text-xs text-gray-400 group-hover:text-red-400 transition-colors">
                  Klik untuk lanjut →
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {layananList.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Tidak Ada Layanan
          </h3>
          <p className="text-gray-500">
            Tidak ada layanan tersedia saat ini. Silakan hubungi administrator.
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
          </div>
          <p className="text-gray-600 text-lg">Memuat data layanan...</p>
        </div>
      )}
    </div>
  );

  // Render customer form dengan desain yang lebih clean
  const renderCustomerForm = () => (
    <div className="space-y-6">
      <button
        onClick={goBack}
        className="inline-flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors duration-200 group"
      >
        <ArrowLeft
          className="mr-2 group-hover:-translate-x-1 transition-transform"
          size={20}
        />
        <span className="font-medium">Kembali ke Pemilihan Layanan</span>
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header dengan gradient */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-8 py-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedLayanan?.nama_layanan}
                </h2>
                <p className="text-red-100 opacity-90 mt-1">
                  {selectedLayanan?.deskripsi_layanan}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Informasi Pelanggan
              </h3>
              <p className="text-gray-600 text-sm">
                Lengkapi data pelanggan dengan benar
              </p>
            </div>
          </div>

          <form onSubmit={handleCustomerFormSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Building2 className="w-4 h-4 mr-2 text-red-600" />
                  MSISDN <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  name="nomor_Indihome"
                  value={formData.nomor_Indihome}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Masukkan nomor msisdn"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <User className="w-4 h-4 mr-2 text-red-600" />
                  Nama Pelanggan <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="nama_Pelanggan"
                  value={formData.nama_Pelanggan}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Phone className="w-4 h-4 mr-2 text-red-600" />
                  No. Telepon <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  name="noTlp_Pelanggan"
                  value={formData.noTlp_Pelanggan}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Contoh: 081234567890"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Mail className="w-4 h-4 mr-2 text-red-600" />
                  Email
                </label>
                <input
                  type="email"
                  name="email_Pelanggan"
                  value={formData.email_Pelanggan}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="contoh@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Zap className="w-4 h-4 mr-2 text-red-600" />
                  Prioritas Komplain
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 bg-white appearance-none shadow-sm hover:border-red-300"
                  required
                >
                  <option value="" disabled>
                    Pilih tingkat prioritas
                  </option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Tentukan urgensi komplain untuk mempercepat penanganan
                  masalah.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <MapPin className="w-4 h-4 mr-2 text-red-600" />
                Alamat Lengkap
              </label>
              <textarea
                name="alamat_Pelanggan"
                value={formData.alamat_Pelanggan}
                onChange={handleChange}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 resize-none bg-gray-50 focus:bg-white"
                rows="4"
                placeholder="Masukkan alamat lengkap termasuk kode pos..."
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <MapPin className="w-4 h-4 mr-2 text-red-600" />
                Deskripsi Komplain
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 resize-none bg-gray-50 focus:bg-white"
                rows="4"
                placeholder="Jelaskan masalah yang dialami..."
              />
            </div>

            <div className="flex justify-end pt-8 border-t border-gray-100">
              <button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    Lanjutkan
                    <ArrowLeft className="ml-2 w-5 h-5 rotate-180" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Render dynamic fields form yang lebih profesional
  const renderFieldsForm = () => (
    <div className="space-y-6">
      <button
        onClick={goBack}
        className="inline-flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors duration-200 group"
      >
        <ArrowLeft
          className="mr-2 group-hover:-translate-x-1 transition-transform"
          size={20}
        />
        <span className="font-medium">Kembali ke Informasi Pelanggan</span>
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-8 py-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedLayanan?.nama_layanan}
                  </h2>
                  <p className="text-red-100 opacity-90 mt-1">
                    {formData.nama_Pelanggan} • {formData.nomor_Indihome}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-red-100 opacity-75">
                  Langkah 3/4
                </div>
                <div className="text-xs text-red-200 opacity-60">
                  Detail Komplain
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Detail Komplain
              </h3>
              <p className="text-gray-600 text-sm">
                Isi form sesuai dengan masalah yang dialami
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {formFields.length > 0 ? (
              <div className="space-y-6">
                {formFields.map((field, index) => (
                  <div
                    key={field.id || `${field.id}-${index}`}
                    className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition-colors"
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      <span className="flex items-center">
                        <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          {index + 1}
                        </span>
                        {/* Gunakan field.label dari backend atau fallback ke field_name */}
                        {field.label || field.field_name}
                        {/* Gunakan field.is_required dari backend */}
                        {field.is_required && (
                          <span className="text-red-500 ml-2">*</span>
                        )}
                      </span>
                    </label>

                    {field.field_type === "text" && (
                      <input
                        type="text"
                        name={field.field_name}
                        value={formData.fields[field.field_name] || ""}
                        onChange={handleFieldChange}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 bg-white"
                        required={field.is_required}
                        placeholder={`Masukkan ${(
                          field.label || field.field_name
                        ).toLowerCase()}...`}
                      />
                    )}

                    {field.field_type === "textarea" && (
                      <textarea
                        name={field.field_name}
                        value={formData.fields[field.field_name] || ""}
                        onChange={handleFieldChange}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 resize-none bg-white"
                        rows="5"
                        required={field.is_required}
                        placeholder={`Jelaskan ${(
                          field.label || field.field_name
                        ).toLowerCase()} secara detail...`}
                      />
                    )}

                    {field.field_type === "number" && (
                      <input
                        type="number"
                        name={field.field_name}
                        value={formData.fields[field.field_name] || ""}
                        onChange={handleFieldChange}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 bg-white"
                        required={field.is_required}
                        placeholder={`Masukkan ${(
                          field.label || field.field_name
                        ).toLowerCase()}...`}
                      />
                    )}

                    {/* Hanya render field type yang didukung oleh backend model */}
                    {field.field_type === "select" && field.options && (
                      <select
                        name={field.field_name}
                        value={formData.fields[field.field_name] || ""}
                        onChange={handleFieldChange}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 bg-white"
                        required={field.is_required}
                      >
                        <option value="">
                          Pilih {field.label || field.field_name}
                        </option>
                        {field.options?.map((option, idx) => (
                          <option key={idx} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {field.field_type === "date" && (
                      <input
                        type="date"
                        name={field.field_name}
                        value={formData.fields[field.field_name] || ""}
                        onChange={handleFieldChange}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 bg-white"
                        required={field.is_required}
                      />
                    )}

                    {field.field_type === "checkbox" && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name={field.id}
                          checked={formData.fields[field.id] || false}
                          onChange={handleFieldChange}
                          className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          required={field.is_required}
                        />
                        <span className="ml-3 text-gray-700">
                          {field.label || field.field_name}
                        </span>
                      </div>
                    )}

                    {/* Tampilkan deskripsi jika ada */}
                    {field.description && (
                      <p className="text-sm text-gray-500 mt-3 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-200">
                        <span className="font-medium text-blue-700">
                          Info:{" "}
                        </span>
                        {field.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                {loading ? (
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
                    </div>
                    <p className="text-gray-600 text-lg">
                      Memuat form komplain...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Siap untuk Submit
                    </h3>
                    <p className="text-gray-600">
                      Tidak ada form tambahan untuk layanan ini. Anda dapat
                      langsung mengirim komplain.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-8 border-t border-gray-100">
              <button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Mengirim Komplain...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 w-5 h-5" />
                    Kirim Komplain
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Render success state yang lebih menarik
  const renderSuccess = () => (
    <div className="text-center">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-2xl mx-auto">
        <div className="p-12">
          {/* Success Icon dengan animasi */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-green-400 rounded-full mx-auto animate-ping opacity-20"></div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Komplain Berhasil Dikirim!
          </h2>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Terima kasih! Komplain untuk layanan{" "}
            <span className="font-semibold text-red-600">
              {selectedLayanan?.nama_layanan}
            </span>{" "}
            telah berhasil dibuat. Tim kami akan segera memproses komplain Anda.
          </p>

          <div className="bg-gradient-to-r from-gray-50 to-red-50 rounded-2xl p-8 text-left mb-8 border border-red-100">
            <h3 className="font-bold text-gray-900 mb-6 text-center flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-600 mr-2" />
              Ringkasan Komplain
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-600 flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-red-500" />
                    Nomor Indihome:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formData.nomor_Indihome}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-600 flex items-center">
                    <User className="w-4 h-4 mr-2 text-red-500" />
                    Nama Pelanggan:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formData.nama_Pelanggan}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-600 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-red-500" />
                    No. Telepon:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formData.noTlp_Pelanggan}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-600 flex items-center">
                    <Settings className="w-4 h-4 mr-2 text-red-500" />
                    Layanan:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {selectedLayanan?.nama_layanan}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="w-6 h-6 text-blue-600 mt-0.5" />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Langkah Selanjutnya
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Komplain akan diproses dalam 1x24 jam</li>
                  <li>• Tim teknis akan menghubungi Anda via telepon</li>
                  <li>• Pantau status komplain melalui dashboard</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={resetForm}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Buat Komplain Baru
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold transition-all duration-200"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header dengan design yang lebih menarik */}
        <div className="text-center mb-12">
          <h1 className="text-2xl lg:text-2xl font-bold text-gray-900 mb-4">
            Form Pengajuan Komplain
          </h1>
          <p className="text-md text-gray-600 max-w-3xl mx-auto">
            Laporkan masalah layanan Anda dengan mudah melalui sistem yang
            Terintegrasi
          </p>
        </div>

        {/* Progress indicator yang lebih elegan */}
        <div className="mb-16">
          <div className="flex items-center justify-center max-w-4xl mx-auto">
            <div className="flex items-center w-full">
              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1">
                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      step === "layanan" ||
                      step === "customer" ||
                      step === "fields" ||
                      step === "success"
                        ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-2xl scale-110"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step === "success" ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : (
                      "1"
                    )}
                  </div>
                  {(step === "customer" ||
                    step === "fields" ||
                    step === "success") && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-700 mt-3 text-center">
                  Pilih Layanan
                </span>
              </div>

              {/* Connector */}
              <div
                className={`flex-1 h-2 mx-4 rounded-full transition-all duration-500 ${
                  step === "customer" || step === "fields" || step === "success"
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : "bg-gray-200"
                }`}
              ></div>

              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1">
                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      step === "customer" ||
                      step === "fields" ||
                      step === "success"
                        ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-2xl scale-110"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step === "success" ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : (
                      "2"
                    )}
                  </div>
                  {(step === "fields" || step === "success") && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-700 mt-3 text-center">
                  Data Pelanggan
                </span>
              </div>

              {/* Connector */}
              <div
                className={`flex-1 h-2 mx-4 rounded-full transition-all duration-500 ${
                  step === "fields" || step === "success"
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : "bg-gray-200"
                }`}
              ></div>

              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1">
                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      step === "fields" || step === "success"
                        ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-2xl scale-110"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step === "success" ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : (
                      "3"
                    )}
                  </div>
                  {step === "success" && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-700 mt-3 text-center">
                  Detail Komplain
                </span>
              </div>

              {/* Connector */}
              <div
                className={`flex-1 h-2 mx-4 rounded-full transition-all duration-500 ${
                  step === "success"
                    ? "bg-gradient-to-r from-red-500 to-green-500"
                    : "bg-gray-200"
                }`}
              ></div>

              {/* Step 4 */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    step === "success"
                      ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-2xl scale-110"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <CheckCircle className="w-8 h-8" />
                </div>
                <span className="text-sm font-semibold text-gray-700 mt-3 text-center">
                  Selesai
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content dengan animasi transisi */}
        <div className="transition-all duration-500 ease-in-out">
          {step === "layanan" && renderLayananSelection()}
          {step === "customer" && renderCustomerForm()}
          {step === "fields" && renderFieldsForm()}
          {step === "success" && renderSuccess()}
        </div>
      </div>
    </div>
  );
};

export default TambahDataKomplain;
