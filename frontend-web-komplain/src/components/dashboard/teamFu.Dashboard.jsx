import React, { useEffect, useState } from "react";
import axios from "axios";

export const TeamFuDashboard = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "http://localhost:5000/webKp/teamfu/komplain",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // hitung total halaman
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // dapatkan data berdasarkan halaman saat ini
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    komplain: 12,
    selesai: 9,
    prosess: 10,
  };
  return (
    <div className="min-h-screen items-center bg-gray-100 p-6">
      <div className="max-w-4xl w-full overflow-hidden p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-red-500">
            <h2 className="text-md font-semibold text-gray-700">
              Daftar Komplain
            </h2>
            <p className="mt-2 text-xl font-bold text-red-500">
              {stats.komplain}
            </p>
            <p className="text-sm text-gray-500 mt-1">Jumlah Data Komplain</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500">
            <h2 className="text-md font-semibold text-gray-700">
              Selesai Dikerjakan
            </h2>
            <p className="mt-2 text-xl font-bold text-green-500">
              {stats.selesai}
            </p>
            <p className="text-sm text-gray-500 mt-1">Jumlah data selesai</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500">
            <h2 className="text-md font-semibold text-gray-700">
              Data Dalam Prosess
            </h2>
            <p className="mt-2 text-xl font-bold text-green-500">
              {stats.selesai}
            </p>
            <p className="text-sm text-gray-500 mt-1">Jumlah data selesai</p>
          </div>
        </div>
      </div>

      {/* TABEL */}
      <div className="p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Aktifitas Terbaru
        </h2>
        <table className="min-w-full table-fixed divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="w1/6 px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                MSISDN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                Judul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                Keterangan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                Prioritas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                Tanggal
              </th>
            </tr>
          </thead>

          <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
            {currentData.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-red-50 transition-colors duration-150"
              >
                <td className="px-5 py-3">{item.msisdn}</td>
                <td className="px-5 py-3 font-medium">{item.title}</td>
                <td
                  className="px-5 py-3 max-w-xs truncate"
                  title={item.description}
                >
                  {item.description}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      item.status === "pending"
                        ? "bg-red-100 text-red-700"
                        : item.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : item.status === "processing"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-3 font-semibold">
                  <span
                    className={`capitalize ${
                      item.priority === "tinggi"
                        ? "text-red-600"
                        : item.priority === "sedang"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {item.priority}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{item.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <div className="text-gray-600">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, data.length)} dari{" "}
            {data.length}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "bg-red-100 text-red-600 hover:bg-red-200"
              }`}
            >
              Sebelumnya
            </button>

            <span className="px-3 py-1 rounded bg-red-50 text-red-600 font-semibold">
              {currentPage}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "bg-red-100 text-red-600 hover:bg-red-200"
              }`}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
