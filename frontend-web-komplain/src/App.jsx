import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/Middleware/Protected.jsx";
import { AgentDasboard } from "./components/dashboard/agent.Dashboard.jsx";
import { TeamFuDashboard } from "./components/dashboard/teamFu.Dashboard.jsx";
import { LeaderDashboard } from "./components/dashboard/leader.Dashboard.jsx";
import { MainLayout } from "./components/layout/MainLayout.jsx";
import { NotFound } from "./pages/NotFound.jsx";

// Agent
import { ComplaintDashboard } from "./components/menu/ComplaintDashboard.jsx";
import { RiwayatKomplain } from "./components/menu/RiwayatKomplain.jsx";
import TambahDaftarKomplain from "./components/menu/agent/tambahDataKomplain.jsx";

// Leader
import { ListPengguna } from "./components/menu/Leader/ListPengguna.jsx";
import { KomplainDashboard } from "./components/menu/Leader/KomplainDashboard.jsx";
import { PengaturanDashboard } from "./components/menu/Leader/PengaturanDashboard.jsx";
import { EkportDashboard } from "./components/menu/Leader/EkportDashboard.jsx";
import { TambahLayanan } from "./components/menu/Leader/TambahLayanan.jsx";

// Team Fu
import { DaftarKomplain } from "./components/menu/team_fu/DaftarKomplain.jsx";
import { FollowUpData } from "./components/menu/team_fu/FollowUpData.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          token && role ? (
            <Navigate
              to={
                role === "leader"
                  ? "/dashboard/leader"
                  : role === "team_fu"
                  ? "/dashboard/team-fu"
                  : "/dashboard"
              }
              replace
            />
          ) : (
            <Login />
          )
        }
      />

      <Route element={<MainLayout />}>
        {/* Agent */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="agent">
              <AgentDasboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/agent/new-komplain"
          element={
            <ProtectedRoute requiredRole="agent">
              <ComplaintDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/agent/riwayat-komplain"
          element={
            <ProtectedRoute requiredRole="agent">
              <RiwayatKomplain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/agent/buat-komplain"
          element={
            <ProtectedRoute requiredRole="agent">
              <TambahDaftarKomplain />
            </ProtectedRoute>
          }
        />

        {/* Team FU */}
        <Route
          path="/dashboard/team-fu"
          element={
            <ProtectedRoute requiredRole="team_fu">
              <TeamFuDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/team-fu/komplain-list"
          element={
            <ProtectedRoute requiredRole="team_fu">
              <DaftarKomplain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/team-fu/follow-up"
          element={
            <ProtectedRoute requiredRole="team_fu">
              <FollowUpData />
            </ProtectedRoute>
          }
        />

        {/* Leader */}
        <Route
          path="/dashboard/leader"
          element={
            <ProtectedRoute requiredRole="leader">
              <LeaderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/leader/users"
          element={
            <ProtectedRoute requiredRole="leader">
              <ListPengguna />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/leader/komplain"
          element={
            <ProtectedRoute requiredRole="leader">
              <KomplainDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/leader/settings"
          element={
            <ProtectedRoute requiredRole="leader">
              <PengaturanDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/leader/eksport-menu"
          element={
            <ProtectedRoute requiredRole="leader">
              <EkportDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/leader/layanan"
          element={
            <ProtectedRoute requiredRole="leader">
              <TambahLayanan />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Not Found */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
