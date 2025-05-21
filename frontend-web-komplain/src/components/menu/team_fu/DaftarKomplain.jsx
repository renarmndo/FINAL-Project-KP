import React, { useEffect, useState } from "react";
import axios from "axios";

export const DaftarKomplain = () => {
  const [dataKomplain, setDataKomplain] = useState([]);
  const [selectedKomplain, setSelectedKomplain] = useState(null);
  const [balasan, setBalasan] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = axios.get("http://localhost:5000/webKp/teamfu/komplain", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDataKomplain(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-red-500">
        Daftar Komplain
      </h2>
      <div>
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
        </table>
      </div>
    </div>
  );
};
