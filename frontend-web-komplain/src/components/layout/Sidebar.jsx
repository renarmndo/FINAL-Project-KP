import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  ClipboardList,
  BadgePlus,
  History,
  ListCheck,
  NotebookTabs,
  FileDown,
  FolderCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { logOut, getRole, getUser } from "../../auth/authService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const Sidebar = ({ toggleSidebar, sidebarOpen }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const location = useLocation();
  const userRole = getRole();
  const user = getUser();

  const navigate = useNavigate();

  // Sidebar toogle
  const toogleSideBar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const menuItems = {
    leader: [
      {
        title: "Dashboard",
        path: "/dashboard/leader",
        icon: <Home size={20} />,
      },
      {
        title: "User",
        path: "/dashboard/leader/users",
        icon: <Users size={20} />,
      },
      {
        title: "Komplain",
        path: "/dashboard/leader/komplain",
        icon: <FileText size={20} />,
      },
      {
        title: "Layanan",
        path: "/dashboard/leader/layanan",
        icon: <FolderCheck size={20} />,
      },
      {
        title: "Export Komplain",
        path: "/dashboard/leader/eksport-menu",
        icon: <FileDown size={20} />,
      },
      {
        title: "Pengaturan",
        path: "/dashboard/leader/settings",
        icon: <Settings size={20} />,
      },
    ],
    agent: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <Home size={20} />,
      },
      {
        title: "Daftar Komplain",
        path: "/dashboard/agent/new-komplain",
        icon: <ClipboardList size={20} />,
      },
      {
        title: "Buat Komplain",
        path: "/dashboard/agent/buat-komplain",
        icon: <BadgePlus size={20} />,
      },
      {
        title: "Riwayat Komplain",
        path: "/dashboard/agent/riwayat-komplain",
        icon: <History size={20} />,
      },
    ],
    team_fu: [
      {
        title: "Dashboard",
        path: "/dashboard/team-fu",
        icon: <Home size={20} />,
      },
      {
        title: "Daftar Komplain",
        path: "/dashboard/team-fu/komplain-list",
        icon: <ListCheck size={20} />,
      },
      {
        title: "Follow Up",
        path: "/dashboard/team-fu/follow-up",
        icon: <NotebookTabs size={20} />,
      },
    ],
  };
  // Handle Logout
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Yakin ingin logout?",
      text: "Kamu akan keluar dari sesi ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, logout!",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) {
      setLoading(true);
      setTimeout(() => {
        logOut();
        navigate("/login", { replace: true });
      }, 1000);
    }
  };

  // Mendapatkan menu berdasarkan role
  const currentMenuItems = userRole ? menuItems[userRole] || [] : [];

  return (
    <div
      className={`${
        isMobile ? "fixed inset-0" : "relative"
      } bg-white shadow-lg transition-all duration-300 flex flex-col justify-between ${
        isCollapsed && !isOpen ? "w-16" : "w-64"
      }`}
      style={{ left: isMobile && !isOpen ? "-100%" : "0", height: "100%" }}
    >
      {/* Top section (Logo & Menu) */}
      <div>
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="ml-3 text=xl font-semibold text-red-700">
              <img
                src="../../../public/assets/img/logo.png"
                alt=""
                width={100}
              />
            </span>
          </div>
          <button
            onClick={toogleSideBar}
            className="text-gray-500 hover:text-600 focus:outline-none"
          >
            {isMobile ? (
              isOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )
            ) : isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 px-2">
            {currentMenuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-lg ${
                    location.pathname === item.path
                      ? "bg-red-100 text-red-600"
                      : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                  } transition-colors duration-200`}
                >
                  <div className="flex items-center justify-center">
                    {item.icon}
                  </div>
                  {(!isCollapsed || isOpen) && (
                    <span className="ml-3">{item.title}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom section: Profile + Logout */}
      <div>
        {/* Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
              <User size={20} />
            </div>
            {(!isCollapsed || isOpen) && (
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center p-2 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-red-600"
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
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              <>
                <LogOut size={20} />
                {(!isCollapsed || isOpen) && (
                  <span className="ml-3">Logout</span>
                )}
              </>
            )}
          </button>
          {/* loading */}
        </div>
      </div>
    </div>
  );
};
