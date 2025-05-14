import { useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } h-screen fixed transition-all duration-300`}
      >
        <Sidebar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isOpen={isSidebarOpen}
        />
      </div>

      <div
        className={`${
          isSidebarOpen ? "ml-64" : "ml-20"
        } flex-1 h-screen overflow-y-auto transition-all duration-300`}
      >
        <Outlet />
      </div>
    </div>
  );
};
