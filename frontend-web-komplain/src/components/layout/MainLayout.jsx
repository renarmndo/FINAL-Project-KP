import { useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className={`h-screen bg-gray-100 grid ${
        isSidebarOpen ? "grid-cols-[16rem_1fr]" : "grid-cols-[4rem_1fr]"
      } transition-all duration-300 ease-in-out`}
    >
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="overflow-auto w-full bg-gray-100 min-w-0">
        <div className="p-4 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
