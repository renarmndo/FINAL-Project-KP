import { API_URL } from "../auth/authService";
import axios from "axios";

export const createUser = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API_URL}/leader/create-user/leader`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const reportKomplain = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/leader/report-csv`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Buat URL object dari blob response
    const url = window.URL.createObjectURL(new Blob([res.data]));

    // Buat element anchor untuk trigger download
    const link = document.createElement("a");
    link.href = url;

    // Set filename (bisa ambil dari response header atau set manual)
    const filename = `laporan_komplain_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    link.setAttribute("download", filename);

    // Tambahkan ke DOM, click, lalu hapus
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup URL object
    window.URL.revokeObjectURL(url);

    return { success: true, message: "File berhasil didownload" };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// rejected komplain
export const rejectedKomplain = async (komplainId, catatanInternal) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.patch(
      `${API_URL}/teamfu/komplain/${komplainId}/rejected`,
      {
        catatanInternal: catatanInternal,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
