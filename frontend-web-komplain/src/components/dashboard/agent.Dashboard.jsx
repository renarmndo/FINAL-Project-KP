import React, { useState, useEffect } from "react";

export const AgentDasboard = () => {
  const [loading, setLoading] = useState(true);
  const [animatedCards, setAnimatedCards] = useState([]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
      // Animate cards one by one
      setTimeout(() => {
        [0, 1, 2, 3].forEach((index) => {
          setTimeout(() => {
            setAnimatedCards((prev) => [...prev, index]);
          }, index * 150);
        });
      }, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "Manajemen komplain",
      description: "Kelola dan proses komplain pelanggan dengan efisien",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      color: "bg-red-50 text-red-600 border-red-100",
    },
    {
      title: "Tracking Real-time",
      description:
        "Pantau status komplain secara real-time dengan notifikasi otomatis",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      color: "bg-gray-50 text-gray-600 border-gray-200",
    },
    {
      title: "Analisis & Laporan",
      description:
        "Dashboard analytics untuk monitoring performa dan trend komplain",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: "bg-red-50 text-red-600 border-red-100",
    },
    {
      title: "Komunikasi Terintegrasi",
      description: "Platform komunikasi terpusat untuk koordinasi tim agent",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      color: "bg-gray-50 text-gray-600 border-gray-200",
    },
  ];

  const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-red-100 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Memuat Sistem Agent
        </h3>
        <p className="text-gray-600">Menyiapkan dashboard untuk Anda...</p>
        <div className="flex justify-center mt-4 space-x-1">
          <div
            className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-16">
              <LoadingAnimation />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row">
              {/* Left Section - Welcome */}
              <div className="bg-gradient-to-br from-red-600 via-red-500 to-red-700 text-white p-12 lg:w-2/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                <div className="relative z-10">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-4 animate-fade-in">
                      Selamat Datang, Agent!
                    </h2>
                    <p className="text-red-100 text-lg leading-relaxed">
                      Sistem manajemen komplain pelanggan yang dirancang khusus
                      untuk membantu Anda memberikan pelayanan terbaik kepada
                      pelanggan PT Transkom Integrasi Mandiri
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: "⚡", text: "Respon cepat & efisien" },
                      { icon: "📊", text: "Dashboard real-time" },
                      { icon: "🔄", text: "Tracking otomatis" },
                      { icon: "📈", text: "Analytics mendalam" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 animate-slide-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                          <span className="text-lg">{item.icon}</span>
                        </div>
                        <span className="text-red-50">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Section - Features */}
              <div className="p-12 lg:w-3/5 bg-white/40">
                <div className="text-center lg:text-left mb-10">
                  <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-red-600 bg-clip-text text-transparent">
                    Agent Dashboard
                  </h1>
                  <p className="text-red-600 font-semibold text-lg mb-2">
                    Sistem Komplain Pelanggan
                  </p>
                  <p className="text-gray-600">
                    Portal khusus agent untuk mengelola dan menangani komplain
                    pelanggan
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`
                        group bg-white border-2 hover:shadow-xl rounded-xl p-6 
                        transition-all duration-500 cursor-pointer transform hover:-translate-y-1
                        ${
                          animatedCards.includes(index)
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-8"
                        }
                        ${feature.color}
                      `}
                      style={{
                        transitionDelay: animatedCards.includes(index)
                          ? "0ms"
                          : `${index * 150}ms`,
                      }}
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div
                          className={`
                          p-4 rounded-xl transition-transform duration-300 group-hover:scale-110
                          ${feature.color}
                        `}
                        >
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-red-600 transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-100 py-6 px-6 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} PT Transkom Integrasi Mandiri.
            Semua hak dilindungi.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Agent Portal v2.0 - Designed for Excellence
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};
