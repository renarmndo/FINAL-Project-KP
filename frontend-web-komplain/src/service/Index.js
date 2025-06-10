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
