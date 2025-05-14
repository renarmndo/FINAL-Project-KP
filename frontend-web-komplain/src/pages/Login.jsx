import React, { useState } from "react";
import { login } from "../auth/authService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IoLogIn } from "react-icons/io5";
import { IoEye, IoEyeOff } from "react-icons/io5";

export const Login = () => {
  const [credentials, setCredential] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredential({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login(credentials.username, credentials.password);
      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: `Selamat Datang, ${response.name}`,
        timer: 1500,
        showConfirmButton: false,
      });
      // redirect
      const userRole = response.role;
      if (userRole === "leader") {
        navigate("/dashboard/leader");
      } else if (userRole === "team_fu") {
        navigate("/dashboard/team-fu");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: "Username atau Password Salah",
          timer: 1500,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle Logout

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        {/* Logo atau Avatar Placeholder */}
        <div className="text-center">
          <div className="flex justify-center">
            <img src="../../public/assets/img/logo.png" width={150} alt="" />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Menampung Komplain Pelanggan di Seluruh Nusantara
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={credentials.username}
                onChange={handleChange}
              />
            </div>
            <div className="mt-4 relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-2 top-2 text-xl text-gray-500"
              >
                {showPassword ? <IoEyeOff /> : <IoEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Ingat Saya
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-red-600 hover:text-red-500"
              >
                Lupa Password?
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
            >
              <span className="w-full flex items-center gap-2 justify-center">
                <IoLogIn size={20} />
                Login
              </span>
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Belum punya akun?{" "}
            <a href="#" className="text-red-600 hover:underline">
              Hubungi admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
