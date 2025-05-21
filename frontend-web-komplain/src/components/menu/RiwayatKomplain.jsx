import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// Servive
import { API_URL } from "../../auth/authService";

export const RiwayatKomplain = () => {
  const [komplain, setKomplain] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKomplain = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/komplain/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setKomplain(response.data.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal Mendapatkan Data",
          text: "Terjadi Kesalahan saat mengambil Data",
        });
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchKomplain();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    if (!status) return "text-gray-400"; // fallback default
    const s = status.toLowerCase();
    if (s === "processing") return "text-yellow-500";
    if (s === "completed") return "text-green-500";
    return "text-red-500";
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-semibold mb-6">Riwayat Komplain </h1>
      {loading ? (
        <p className="text-gray-500">Memuat Data.....</p>
      ) : (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    Handler
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(komplain) &&
                komplain.filter(
                  (k) => k.status?.trim().toLowerCase() === "completed"
                ).length > 0 ? (
                  komplain
                    .filter(
                      (item) =>
                        item.status?.trim().toLowerCase() === "completed"
                    )
                    .map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-red-50 transition-colors cursor-pointer duration-300"
                      >
                        <td className="px-6 py-4 break-words text-sm">
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
                        <td>{item.handlerId.name}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      Tidak ada data komplain dengan status "success".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
