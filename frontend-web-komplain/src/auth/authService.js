import axios from "axios";
import { jwtDecode } from "jwt-decode";
export const API_URL = "http://localhost:5000/webKp";

export const login = async (username, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, {
    username,
    password,
  });

  //   Simpan token ke localstorage
  if (res.data && res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.id);
    localStorage.setItem("role", res.data.role);
  }
  return res.data;
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const getUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.id,
      role: decoded.role,
      name: decoded.name,
    };
  } catch (error) {
    console.log("Token tidak valid", error);
    return null;
  }
};

export const logOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  window.dispatchEvent(new Event("storage")); // ← trigger update state
};
