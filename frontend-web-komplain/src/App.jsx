import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/Middleware/Protected.jsx";
import { AgentDasboard } from "./components/dashboard/agent.Dashboard.jsx";
import { TeamFuDashboard } from "./components/dashboard/teamFu.Dashboard.jsx";
import { LeaderDashboard } from "./components/dashboard/leader.Dashboard.jsx";
import { MainLayout } from "./components/layout/MainLayout.jsx";
import { NotFound } from "./pages/NotFound.jsx";

// Menu Sidebar
import { ComplaintDashboard } from "./components/menu/ComplaintDashboard.jsx";
import { RiwayatKomplain } from "./components/menu/RiwayatKomplain.jsx";

// Leader Menu
import { ListPengguna } from "./components/menu/Leader/ListPengguna.jsx";
import { KomplainDashboard } from "./components/menu/Leader/KomplainDashboard.jsx";
import { PengaturanDashboard } from "./components/menu/Leader/PengaturanDashboard.jsx";

// Role Team_fu
import { DaftarKomplain } from "./components/menu/team_fu/DaftarKomplain.jsx";
import { FollowUpData } from "./components/menu/team_fu/FollowUpData.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* Login route tanpa layout */}
      <Route
        path="/login"
        element={
          localStorage.getItem("token") && localStorage.getItem("role") ? (
            <Navigate
              to={
                localStorage.getItem("role") === "leader"
                  ? "/dashboard/leader"
                  : localStorage.getItem("role") === "team_fu"
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

      {/* Route yang menggunakan MainLayout */}
      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="agent">
              <AgentDasboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/team-fu"
          element={
            <ProtectedRoute requiredRole="team_fu">
              <TeamFuDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/leader"
          element={
            <ProtectedRoute requiredRole="leader">
              <LeaderDashboard />
            </ProtectedRoute>
          }
        />

        {/* Menu Sidebar */}
        <Route
          path="/dashboard/agent/new-komplain"
          element={
            <ProtectedRoute requiredRole={"agent"}>
              <ComplaintDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/agent/riwayat-komplain"
          element={
            <ProtectedRoute requiredRole={"agent"}>
              <RiwayatKomplain />
            </ProtectedRoute>
          }
        />

        {/* Leader Menu */}
        <Route
          path="/dashboard/leader/users"
          element={
            <ProtectedRoute requiredRole={"leader"}>
              <ListPengguna />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/leader/komplain"
          element={
            <ProtectedRoute requiredRole={"leader"}>
              <KomplainDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/leader/settings"
          element={
            <ProtectedRoute>
              <PengaturanDashboard />
            </ProtectedRoute>
          }
        />

        {/* Team Fu */}
        <Route
          path="/dashboard/team-fu/komplain-list"
          element={
            <ProtectedRoute requiredRole={"team_fu"}>
              <DaftarKomplain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/team-fu/follow-up"
          element={
            <ProtectedRoute requiredRole={"team_fu"}>
              <FollowUpData />
            </ProtectedRoute>
          }
        />
      </Route>
      {/* Catch-all untuk halaman tidak ditemukan */}
      <Route path="404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
