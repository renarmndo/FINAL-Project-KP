import React, { useEffect, useState } from "react";
import {
  X,
  AlertCircle,
  Send,
  Search,
  Menu,
  Bell,
  User,
  ChevronDown,
  Trash2,
  Pencil,
} from "lucide-react";

// Service
import { API_URL } from "../../../auth/authService";
import axios from "axios";

// Style
import Swal from "sweetalert2";

export const ListPengguna = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.data);
      console.log(res.data);
    } catch (error) {
      console.log("Gagal Mengambil Data User", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengambil data pengguna",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete Data
  const handlerDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Kamu Yakin?",
      text: "User akan dihapus secara permanent",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "User telah dihapus",
        });

        // refresh data
        fetchUsers();
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message?.includes(
            "a foreign key constraint fails"
          )
        ) {
          Swal.fire({
            icon: "error",
            title: "Gagal Menghapus",
            text: "User ini masih memiliki data komplain terkait. Hapus data komplain terlebih dahulu.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Terjadi kesalahan saat menghapus user.",
          });
        }
      }
    }
  };

  // Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/user/${selectedUser.id}`,
        {
          nama: selectedUser.name,
          username: selectedUser.username,
          role: selectedUser.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "User berhasil diupdate",
      });

      // Refresh data
      fetchUsers();
      closeModal();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat update user.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({
      ...selectedUser,
      [name]: value,
    });
  };

  // Filter Data
  const filteredUsers = selectedRole
    ? users.filter((user) => user.role === selectedRole)
    : users;

  // Function to open edit modal
  const openEditModal = (user) => {
    setSelectedUser({ ...user });
    setModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 p-4">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-gray-800">
                Dashboard User
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-1 rounded-full hover:bg-gray-100">
                <Bell size={20} className="text-gray-600" />
              </button>
              <button className="flex items-center text-sm bg-red-50 text-red-700 rounded-full py-1 px-3 hover:bg-red-100">
                <User size={16} className="mr-1" />
                <span>{users[0]?.role || "Admin"}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Daftar Data Pengguna
              </h1>
              <p className="text-gray-600">Kelola Semua Data Pengguna</p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <select
                  id="tableSelector"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Semua Role</option>
                  <option value="leader">Leader</option>
                  <option value="team_fu">Team FU</option>
                  <option value="agent">Agent</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center whitespace-nowrap">
                <span>Tambah User Baru</span>
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="w-1/5 px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6">
                        <div className="flex justify-center items-center py-10">
                          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-red-50 transition-colors"
                      >
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900 capitalize">
                          {user.role}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900">
                          <div className="flex space-x-4">
                            <button
                              onClick={() => handlerDeleteUser(user.id)}
                              className="p-1 rounded-full text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-1 rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Tidak Ada Data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Modal - Improved */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
              {/* Background overlay with blur effect */}
              <div
                className="fixed inset-0 z-40 bg-black opacity-50 backdrop-blur-sm transition-opacity"
                onClick={closeModal}
                aria-hidden="true"
              ></div>

              {/* Modal panel - improved styling */}
              <div className="relative z-50 bg-white rounded-lg shadow-2xl sm:max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out">
                {/* Modal header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-t-lg px-6 py-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Pencil size={18} className="mr-2" />
                    Edit User
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-red-100 rounded-full p-1 hover:bg-red-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal body */}
                <div className="px-6 pt-5 pb-4">
                  {selectedUser && (
                    <form onSubmit={handleUpdate}>
                      <div className="mb-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nama
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={selectedUser.name || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="username"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={selectedUser.username || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="role"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Role
                        </label>
                        <select
                          id="role"
                          name="role"
                          value={selectedUser.role || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          required
                        >
                          <option value="leader">Leader</option>
                          <option value="team_fu">Team FU</option>
                          <option value="agent">Agent</option>
                        </select>
                      </div>
                    </form>
                  )}
                </div>

                {/* Modal footer */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex flex-col sm:flex-row-reverse sm:justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg px-5 py-2.5 bg-red-600 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors shadow-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                        Menyimpan...
                      </span>
                    ) : (
                      "Simpan Perubahan"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 px-5 py-2.5 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors shadow-sm"
                    disabled={loading}
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
