import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../../../auth/authService";
import { FaSortUp, FaSortDown, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export const TambahLayanan = () => {
  const [layananList, setLayananList] = useState([]);
  const [namaLayanan, setNamaLayanan] = useState("");
  const [deskripsiLayanan, setDeskripsiLayanan] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [selectedLayananId, setSelectedLayananId] = useState("");
  const [setSelect, isSelected] = useState({
    label: "",
    field_name: "",
    field_type: "",
  });
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [loadingField, setLoadingField] = useState(false);
  // const [namaLayanan, setNamaLayanan] = useState([]);
  // const [deskripsiLayanan, setDeskripsiLayanan] = useState([]);

  useEffect(() => {
    fetchLayanan();
  }, []);

  const fetchLayanan = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/leader/layanan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLayananList(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil data layanan:", error);
      Swal.fire("Gagal", "Gagal mengambil data layanan", "error");
    }
  };

  const tambahLayanan = async () => {
    if (!namaLayanan.trim()) {
      Swal.fire("Peringatan", "Nama layanan tidak boleh kosong.", "warning");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/leader/create-layanan`,
        {
          nama_layanan: namaLayanan,
          deskripsi_layanan: deskripsiLayanan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNamaLayanan("");
      setDeskripsiLayanan("");
      fetchLayanan();
      Swal.fire(
        "Berhasil",
        res.data.message || "Layanan berhasil ditambahkan!",
        "success"
      );
    } catch (error) {
      console.error("Gagal menambahkan layanan:", error);
      const errorMsg =
        error?.response?.data?.message || "Gagal menambahkan layanan.";
      Swal.fire("Error", errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedLayanan = [...layananList].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "ascending" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
  };

  // handle field layanan
  const handleSubmitLayanan = async () => {
    if (
      !selectedLayananId ||
      !setSelect.label ||
      !setSelect.field_name ||
      !setSelect.field_type
    ) {
      return Swal.fire("Error", "Semua Field wajib diisi", "error");
    }
    try {
      setLoadingField(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/leader/${selectedLayananId}/create-field`,
        {
          label: setSelect.label,
          field_name: setSelect.field_name,
          field_type: setSelect.field_type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        text: "Sukses",
        title: "Field Layanan Berhasil Ditambahkan",
        timer: 1500,
      });
      setSelectedLayananId("");
      isSelected({ label: "", field_name: "", field_type: "" });
      setShowFieldForm(false);
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Gagal Menambahkan Field Layanan", "error");
    } finally {
      setLoadingField(false);
    }
  };

  const toggleFieldForm = () => {
    setShowFieldForm(!showFieldForm);
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full flex-grow transition-all duration-300">
      <div className="p-6 bg-white rounded-lg shadow-md m-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Kelola Layanan
        </h2>
        <div className="h-1 w-24 bg-red-600 mb-4"></div>
        <p className="text-sm text-gray-600 mb-6">
          Tambah dan kelola layanan baru di sini!
        </p>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Tambah Layanan Baru
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Layanan
              </label>
              <input
                type="text"
                placeholder="Masukkan nama layanan"
                value={namaLayanan}
                onChange={(e) => setNamaLayanan(e.target.value)}
                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Layanan
              </label>
              <input
                type="text"
                placeholder="Masukkan deskripsi layanan"
                value={deskripsiLayanan}
                onChange={(e) => setDeskripsiLayanan(e.target.value)}
                className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={tambahLayanan}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md disabled:opacity-50 transition-colors duration-200 flex items-center font-medium"
            >
              {loading ? "Menambahkan..." : "Tambah Layanan"}
            </button>
          </div>
        </div>

        {/* Field Layanan Section */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Kelola Field Layanan
            </h3>
            <button
              onClick={toggleFieldForm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center font-medium text-sm"
            >
              <FaPlus className="mr-2" />
              {showFieldForm ? "Tutup Form" : "Tambah Field Layanan"}
            </button>
          </div>

          {showFieldForm && (
            <div className="bg-white p-5 rounded-lg border border-gray-200 mb-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Layanan
                  </label>
                  <select
                    value={selectedLayananId}
                    onChange={(e) => setSelectedLayananId(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">-- Pilih Layanan --</option>
                    {layananList.map((layanan) => (
                      <option key={layanan.id} value={layanan.id}>
                        {layanan.nama_layanan}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Field
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan label field"
                    value={setSelect.label}
                    onChange={(e) =>
                      isSelected({ ...setSelect, label: e.target.value })
                    }
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Field
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama field"
                    value={setSelect.field_name}
                    onChange={(e) =>
                      isSelected({ ...setSelect, field_name: e.target.value })
                    }
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipe Field
                  </label>
                  <select
                    value={setSelect.field_type}
                    onChange={(e) =>
                      isSelected({ ...setSelect, field_type: e.target.value })
                    }
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">-- Pilih Tipe Field --</option>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="textarea">Textarea</option>
                    <option value="select">Select</option>
                    <option value="file">File</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmitLayanan}
                  disabled={loadingField}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50 transition-colors duration-200 flex items-center font-medium"
                >
                  {loadingField ? "Menyimpan..." : "Simpan Field"}
                </button>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 mt-2">
            <p>
              Tambahkan field untuk setiap layanan sesuai kebutuhan. Field ini
              akan menjadi form input saat layanan digunakan.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Daftar Layanan
            </h3>
            <div className="text-sm text-gray-500">
              Total: {layananList.length} layanan
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {layananList.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-base">Belum ada layanan terdaftar.</p>
                <p className="text-sm mt-2">
                  Tambahkan layanan baru menggunakan form di atas.
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        <span>No</span>
                        {getSortIcon("id")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("nama_layanan")}
                    >
                      <div className="flex items-center">
                        <span>Nama Layanan</span>
                        {getSortIcon("nama_layanan")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("deskripsi_layanan")}
                    >
                      <div className="flex items-center">
                        <span>Deskripsi</span>
                        {getSortIcon("deskripsi_layanan")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        <span>Tanggal Dibuat</span>
                        {getSortIcon("createdAt")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedLayanan.map((layanan, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {layanan.nama_layanan}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs overflow-hidden text-ellipsis">
                        {layanan.deskripsi_layanan}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(layanan.createdAt).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-8  00 p-1 rounded-full hover:bg-red-100 transition-colors"
                            title="Hapus"
                          >
                            <FaTrash size={18} />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition-colors"
                            title="Tambah Field"
                            onClick={() => {
                              setSelectedLayananId(layanan.id);
                              setShowFieldForm(true);
                              window.scrollTo({
                                top:
                                  document.querySelector(".bg-gray-50")
                                    .offsetTop - 20,
                                behavior: "smooth",
                              });
                            }}
                          >
                            <FaPlus size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
