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
  UserPlus,
  Filter,
  RefreshCw,
  Shield,
} from "lucide-react";
import { TambahUser } from "../../../assets/popup/leader/TambahUser";

// Service
import { API_URL } from "../../../auth/authService";
import axios from "axios";

// Style
import Swal from "sweetalert2";

export const ListPengguna = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const openModalCreate = () => {
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

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
      setUsers(res.data.data || []);
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

  const refreshData = async () => {
    setRefreshing(true);
    await fetchUsers();
    setTimeout(() => setRefreshing(false), 500); // Add slight delay for better UX
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
      backdrop: `rgba(0,0,0,0.4)`,
      showClass: {
        popup: `animate__animated animate__fadeInUp animate__faster`,
      },
      hideClass: {
        popup: `animate__animated animate__fadeOutDown animate__faster`,
      },
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
          timer: 1500,
          showConfirmButton: false,
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

  const handleUserAdded = (newUser) => {
    // Opsi 1: Refresh semua data dari server (lebih aman)
    fetchUsers();

    // Opsi 2: Tambahkan user baru ke state (lebih cepat)
    // setUsers(prevUsers => [...prevUsers, newUser]);
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
        timer: 1500,
        showConfirmButton: false,
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
  const filteredUsers = users.filter((user) => {
    const roleMatch = selectedRole ? user.role === selectedRole : true;
    const searchMatch = searchTerm
      ? user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return roleMatch && searchMatch;
  });

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

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "leader":
        return "bg-red-100 text-red-800 border-red-200";
      case "team_fu":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "agent":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format role name for display
  const formatRoleName = (role) => {
    switch (role) {
      case "leader":
        return "Leader";
      case "team_fu":
        return "Team FU";
      case "agent":
        return "Agent";
      default:
        return role;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold text-gray-800">
                Dashboard User
              </h2>
              <div className="h-6 w-0.5 bg-gray-200 hidden md:block"></div>
              <span className="text-sm text-gray-500 hidden md:block">
                Kelola User sistem
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative cursor-pointer group">
                <div className="relative">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </div>
                <div className="absolute right-0 w-64 mt-2 bg-white rounded-lg shadow-lg py-2 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">
                      Notifikasi
                    </p>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm text-gray-700 font-medium">
                        Pengguna baru terdaftar
                      </p>
                      <p className="text-xs text-gray-500">5 menit yang lalu</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">Admin</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Shield className="mr-2 text-red-500" size={24} />
                  Daftar Data User
                </h1>
                <p className="text-gray-600 mt-1">
                  Kelola semua pengguna yang terdaftar di sistem
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={refreshData}
                  className="flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                  disabled={refreshing}
                >
                  <RefreshCw
                    size={16}
                    className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
                  />
                  <span>{refreshing ? "Memuat..." : "Refresh"}</span>
                </button>
                <button
                  onClick={openModalCreate}
                  className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm hover:shadow"
                >
                  <UserPlus size={16} className="mr-2" />
                  <span>Tambah User Baru</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari nama atau username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="relative md:w-48">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Filter size={18} className="text-gray-400" />
                  </div>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="pl-10 w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="">Semua Role</option>
                    <option value="leader">Leader</option>
                    <option value="team_fu">Team FU</option>
                    <option value="agent">Agent</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-700">
                    Total User:{" "}
                    <span className="text-red-600 font-semibold">
                      {filteredUsers.length}
                    </span>
                  </h3>
                  {searchTerm || selectedRole ? (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedRole("");
                      }}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center"
                    >
                      <X size={14} className="mr-1" />
                      Reset Filter
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Tanggal Dibuat
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="5">
                          <div className="flex justify-center items-center py-16">
                            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 border border-gray-200">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {user.username}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full inline-flex items-center border ${getRoleBadgeColor(
                                user.role
                              )}`}
                            >
                              {formatRoleName(user.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center space-x-3">
                              <button
                                onClick={() => openEditModal(user)}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors border border-transparent hover:border-blue-200"
                                title="Edit"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handlerDeleteUser(user.id)}
                                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors border border-transparent hover:border-red-200"
                                title="Hapus"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <AlertCircle
                              size={40}
                              className="text-gray-300 mb-2"
                            />
                            <p className="text-gray-500 font-medium">
                              Tidak Ada Data Ditemukan
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              {searchTerm || selectedRole
                                ? "Coba ubah filter pencarian"
                                : "Belum ada data pengguna tersedia"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length > 0 && !loading && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Menampilkan {filteredUsers.length} dari {users.length}{" "}
                      pengguna
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          {/* Background overlay with blur effect */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
            aria-hidden="true"
          ></div>

          {/* Modal Content */}
          <div className="relative z-50 bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-xl px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white flex items-center">
                <Pencil size={18} className="mr-2" />
                Edit User
              </h3>
              <button
                onClick={closeModal}
                className="text-white hover:text-red-100 rounded-full p-1 hover:bg-red-700/50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pt-6 pb-4">
              {selectedUser && (
                <form onSubmit={handleUpdate}>
                  <div className="space-y-4">
                    <div>
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                    <div>
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Role
                      </label>
                      <div className="relative">
                        <select
                          id="role"
                          name="role"
                          value={selectedUser.role || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors appearance-none"
                          required
                        >
                          <option value="leader">Leader</option>
                          <option value="team_fu">Team FU</option>
                          <option value="agent">Agent</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ChevronDown size={18} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border border-gray-300 px-5 py-2.5 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg px-5 py-2.5 bg-red-600 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-sm"
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
            </div>
          </div>
        </div>
      )}

      {/* modal tambah user*/}
      <TambahUser
        isCreateOpen={isCreateModalOpen}
        OnCreateClose={closeCreateModal}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};
