import { API_URL } from "../auth/authService";
import axios from "axios";

export const getMyComplain = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${API_URL}/komplain/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteKomplain = async (id) => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`${API_URL}/komplain/agent/${id}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const editKomplain = async (id, data) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.patch(
      `${API_URL}/komplain/agent/${id}/edit`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getMyResponse = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${API_URL}/komplain/agent/${id}/response`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

// get all komplain leader
export const getKomplainByLeader = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/leader/komplain-completed`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
    // http://localhost:5000/webKp/leader/komplain-completed
  } catch (error) {
    console.log(error);
  }
};

export const responseKomplain = async (
  komplainId,
  jawaban,
  catatanInternal
) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${API_URL}/teamfu/komplain/${komplainId}/handler`,
      {
        jawaban: jawaban,
        catatanInternal: catatanInternal,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
