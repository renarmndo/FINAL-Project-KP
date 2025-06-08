import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  AlertCircle,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
} from "lucide-react";

export const EditKomplainPopUp = ({ komplain, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: "",
    nomor_Indihome: "",
    nama_Pelanggan: "",
    noTlp_Pelanggan: "",
    email_Pelanggan: "",
    alamat_Pelanggan: "",
    priority: "medium",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load data komplain ke form saat popup dibuka
  useEffect(() => {
    if (komplain) {
      setFormData({
        id: komplain.id || "",
        nomor_Indihome: komplain.nomor_Indihome || "",
        nama_Pelanggan: komplain.nama_Pelanggan || "",
        noTlp_Pelanggan: komplain.noTlp_Pelanggan || "",
        email_Pelanggan: komplain.email_Pelanggan || "",
        alamat_Pelanggan: komplain.alamat_Pelanggan || "",
        priority: komplain.priority || "medium",
      });
    }
  }, [komplain]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nomor_Indihome.trim()) {
      newErrors.nomor_Indihome = "Nomor Indihome wajib diisi";
    }

    if (!formData.nama_Pelanggan.trim()) {
      newErrors.nama_Pelanggan = "Nama pelanggan wajib diisi";
    }

    if (!formData.noTlp_Pelanggan.trim()) {
      newErrors.noTlp_Pelanggan = "Nomor telepon wajib diisi";
    } else if (
      !/^\d{10,15}$/.test(formData.noTlp_Pelanggan.replace(/[\s-]/g, ""))
    ) {
      newErrors.noTlp_Pelanggan = "Format nomor telepon tidak valid";
    }

    if (!formData.email_Pelanggan.trim()) {
      newErrors.email_Pelanggan = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_Pelanggan)) {
      newErrors.email_Pelanggan = "Format email tidak valid";
    }

    if (!formData.alamat_Pelanggan.trim()) {
      newErrors.alamat_Pelanggan = "Alamat wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error updating komplain:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Edit Data Komplain</h2>
                <p className="text-red-100 text-sm">
                  Perbarui informasi komplain pelanggan
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Info Card */}
          {komplain?.createdAt && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-red-700">
                <Calendar size={16} />
                <span className="text-sm font-medium">
                  Komplain dibuat pada: {formatDate(komplain.createdAt)}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="mr-2 text-red-600" size={20} />
                Informasi Pelanggan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nomor Indihome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Indihome *
                  </label>
                  <input
                    type="text"
                    name="nomor_Indihome"
                    value={formData.nomor_Indihome}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                      errors.nomor_Indihome
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Masukkan nomor Indihome"
                  />
                  {errors.nomor_Indihome && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.nomor_Indihome}
                    </p>
                  )}
                </div>

                {/* Nama Pelanggan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Pelanggan *
                  </label>
                  <input
                    type="text"
                    name="nama_Pelanggan"
                    value={formData.nama_Pelanggan}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                      errors.nama_Pelanggan
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Masukkan nama pelanggan"
                  />
                  {errors.nama_Pelanggan && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.nama_Pelanggan}
                    </p>
                  )}
                </div>

                {/* Nomor Telepon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-1" />
                    Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    name="noTlp_Pelanggan"
                    value={formData.noTlp_Pelanggan}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                      errors.noTlp_Pelanggan
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Masukkan nomor telepon"
                  />
                  {errors.noTlp_Pelanggan && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.noTlp_Pelanggan}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-1" />
                    Email Pelanggan *
                  </label>
                  <input
                    type="email"
                    name="email_Pelanggan"
                    value={formData.email_Pelanggan}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                      errors.email_Pelanggan
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Masukkan email pelanggan"
                  />
                  {errors.email_Pelanggan && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.email_Pelanggan}
                    </p>
                  )}
                </div>
              </div>

              {/* Alamat */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Alamat Pelanggan *
                </label>
                <textarea
                  name="alamat_Pelanggan"
                  value={formData.alamat_Pelanggan}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors resize-none ${
                    errors.alamat_Pelanggan
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Masukkan alamat lengkap pelanggan"
                />
                {errors.alamat_Pelanggan && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.alamat_Pelanggan}
                  </p>
                )}
              </div>
            </div>

            {/* Complaint Details Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="mr-2 text-red-600" size={20} />
                Detail Komplain
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioritas
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  >
                    <option value="">Pilih Prioritas</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors flex items-center justify-center ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
