// import React from "react";
// import { Sidebar } from "lucide-react";

// export const MainLayout = ({ children }) => {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="ml-64 p-6 w-full">{children}</div>
//     </div>
//   );
// };

import { Sidebar } from "../layout/Sidebar";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-4 w-full">
        <Outlet /> {/* Tempat render konten berdasarkan route */}
      </div>
    </div>
  );
};
