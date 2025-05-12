import { useState, useEffect } from "react";
import {
  Users,
  Mail,
  Bell,
  Calendar,
  FileText,
  Settings,
  Menu,
  X,
} from "lucide-react";

export const LeaderDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Animasi loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Update waktu setiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format waktu
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format tanggal
  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  // Toggle menu mobile

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            Memuat Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header kanan atas */}
      <div className="flex justify-end items-center p-4">
        <div className="hidden md:block text-right mr-4">
          <div className="text-gray-500">{formatDate(currentTime)}</div>
          <div className="text-lg font-semibold">{formatTime(currentTime)}</div>
        </div>
        <div className="relative mr-4">
          <Bell
            size={20}
            className="text-gray-600 hover:text-blue-500 cursor-pointer"
          />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            3
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar bisa kamu tambahkan di sini */}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {/* Animation Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">
                  Sistem Komplain Customers
                </h3>
                <p className="text-red-600 mb-4">
                  PT Transkom Integrasi Mandiri
                </p>
              </div>
              <div className="w-full md:w-1/2 relative h-48">
                {/* Animasi kantor */}
              </div>
            </div>
          </div>

          {/* Additional Animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tugas Hari Ini */}
            <div className="bg-white p-4 rounded-lg shadow-sm overflow-hidden">
              <div className="flex justify-between">
                <h3 className="font-medium">Tugas Hari Ini</h3>
                <span className="text-red-500">5 item</span>
              </div>
              <div className="mt-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                  <FileText size={16} />
                </div>
                <div className="ml-3 flex-1">
                  <div className="h-2 bg-gray-200 rounded">
                    <div className="h-2 bg-green-500 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rapat */}
            <div className="bg-white p-4 rounded-lg shadow-sm overflow-hidden">
              <div className="flex justify-between">
                <h3 className="font-medium">Rapat</h3>
                <span className="text-orange-500">2 hari ini</span>
              </div>
              <div className="mt-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                  <Calendar size={16} />
                </div>
                <div className="ml-3 flex-1">
                  <div className="h-2 bg-gray-200 rounded">
                    <div className="h-2 bg-orange-500 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pesan */}
            <div className="bg-white p-4 rounded-lg shadow-sm overflow-hidden">
              <div className="flex justify-between">
                <h3 className="font-medium">Pesan</h3>
                <span className="text-red-500">9 baru</span>
              </div>
              <div className="mt-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                  <Mail size={16} />
                </div>
                <div className="ml-3 flex-1">
                  <div className="h-2 bg-gray-200 rounded">
                    <div className="h-2 bg-red-500 rounded w-4/5 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
