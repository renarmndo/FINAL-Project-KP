import React, { useState } from "react";
import { login } from "../auth/authService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const Login = () => {
  const [credentials, setCredential] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Handle Logout

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-red-700">
            Sistem Complain Customers
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Silakan Masukan Accunt Anda
          </p>
        </div>
        <form action="" className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label>Username</label>
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={credentials.username}
                onChange={handleChange}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="password"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
            <div className="mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-tranparent text-sm font-medium rounded-md text-white ${
                  loading ? "bg-red-500" : "bg-red-700 hover:bg-red-900"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                {loading ? "Memprosess.." : "Login"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
