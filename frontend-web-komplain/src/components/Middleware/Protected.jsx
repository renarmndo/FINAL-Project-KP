// import { Navigate } from "react-router-dom";

// export const ProtectedRoute = ({ children, requiredRole }) => {
//   const token = localStorage.getItem("token");
//   const userRole = localStorage.getItem("role");

//   if (!token) {
//     //   jika token tidak ada
//     return <Navigate to={"/login"} replace />;
//   }

//   if (requiredRole && userRole !== requiredRole) {
//     return <Navigate to={"/login"} replace />;
//     // jika role tidak sesuai, redirect ke dashboard yang sesuai
//     if (userRole === "leader") {
//       return <Navigate to={"/dashboard/leader"} replace />;
//     } else if (userRole === "team_fu") {
//       return <Navigate to={"/dashboard/team-fu"} replace />;
//     } else if (userRole === "agent") {
//       return <Navigate to={"/dashboard"} replace />;
//     } else {
//       return <Navigate to={"/login"} replace />;
//     }
//   }
//   return children;
// };

import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Kalau belum login
  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // Kalau role tidak sesuai
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/404" replace />;
  }

  return children;
};
