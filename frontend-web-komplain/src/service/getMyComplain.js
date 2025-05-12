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
