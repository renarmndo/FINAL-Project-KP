import React, { useEffect } from "react";
import Swal from "sweetalert2";

export const ResponseKomplain = ({
  isOpen,
  onClose,
  complaint,
  responseData,
  loading,
}) => {
  console.log("ResponseKomplain props:", { isOpen, complaint, responseData });

  // Fungsi untuk mengecek apakah response data valid
  const hasValidResponseData = () => {
    console.log("Checking responseData:", responseData);

    if (!responseData) {
      console.log("No responseData");
      return false;
    }

    // Cek apakah responseData adalah object dan bukan array kosong
    if (typeof responseData !== "object" || Array.isArray(responseData)) {
      console.log("ResponseData is not a valid object");
      return false;
    }

    // Cek apakah ada jawaban atau properties penting lainnya
    const hasValidData = !!(
      responseData.jawaban ||
      responseData.message ||
      (responseData.id && responseData.komplainId)
    );

    console.log("Has valid data:", hasValidData);
    console.log("jawaban:", responseData.jawaban);
    console.log("message:", responseData.message);
    console.log("id:", responseData.id);
    console.log("komplainId:", responseData.komplainId);

    return hasValidData;
  };

  // Effect untuk menangani SweetAlert ketika popup dibuka
  useEffect(() => {
    if (isOpen) {
      console.log("Checking response data validity:", hasValidResponseData());

      // Jika tidak ada response data atau kosong
      if (!hasValidResponseData()) {
        console.log("No valid response data, showing SweetAlert");

        Swal.fire({
          title: "Belum Ada Tanggapan",
          text: "Komplain Anda masih dalam proses peninjauan. Tim kami akan segera memberikan tanggapan.",
          icon: "info",
          confirmButtonText: "Mengerti",
          confirmButtonColor: "#3085d6",
          backdrop: true,
          allowOutsideClick: false,
        }).then(() => {
          //   onClose(); // Tutup popup setelah SweetAlert ditutup
        });
      }
    }
  }, [isOpen, responseData, onClose]);

  if (!isOpen) {
    console.log("Popup not open, returning null");
    return null;
  }

  // Jika loading
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Memuat tanggapan...</span>
          </div>
        </div>
      </div>
    );
  }

  // Jika ada response data, tampilkan popup normal
  if (hasValidResponseData()) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Tanggapan Komplain</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Info Komplain */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Komplain Anda:
              </h3>
              <p className="text-gray-600 text-sm">
                ID: #{complaint?.id || responseData?.komplainId || "N/A"}
              </p>
              <p className="text-gray-700 mt-1">
                {complaint?.subject || complaint?.title || "Tidak ada subjek"}
              </p>
            </div>

            {/* Status */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 mr-2">
                  Status:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    responseData.status === "completed" ||
                    responseData.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : responseData.status === "in_progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {responseData.status === "completed" ||
                  responseData.status === "resolved"
                    ? "Diselesaikan"
                    : responseData.status === "in_progress"
                    ? "Dalam Proses"
                    : "Ditinjau"}
                </span>
              </div>
            </div>

            {/* Tanggal Response */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Tanggal Tanggapan:</span>{" "}
                {responseData.createdAt || responseData.responseDate
                  ? new Date(
                      responseData.createdAt || responseData.responseDate
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : new Date().toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
              </p>
            </div>

            {/* Penanggung Jawab */}
            <div className="mb-6">
              <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {responseData.responder?.name?.charAt(0) || "A"}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">
                    {responseData.responder?.name || "Tim Follow Up"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {responseData.responder?.position ||
                      "PT Transkom Integrasi Mandiri"}
                  </p>
                </div>
              </div>
            </div>

            {/* Isi Tanggapan */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Tanggapan:</h4>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                <p className="text-gray-700 leading-relaxed">
                  {responseData.jawaban ||
                    responseData.message ||
                    `Terima kasih atas komplain yang Anda sampaikan. Kami telah meninjau masalah yang Anda alami dan akan segera mengambil tindakan yang diperlukan. 
                   
                   Tim kami akan terus memantau situasi ini untuk memastikan tidak terjadi lagi di masa mendatang. Jika Anda memiliki pertanyaan lebih lanjut atau memerlukan bantuan tambahan, jangan ragu untuk menghubungi kami.
                   
                   Kami mohon maaf atas ketidaknyamanan yang telah terjadi dan berterima kasih atas kesabaran Anda.`}
                </p>
              </div>
            </div>

            {/* Catatan Internal (jika ada dan bukan 'not') */}
            {responseData.catatanInternal &&
              responseData.catatanInternal !== "not" && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Catatan:</h4>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-gray-700">
                      {responseData.catatanInternal}
                    </p>
                  </div>
                </div>
              )}

            {/* Tindakan yang Diambil */}
            {responseData.actions && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Tindakan yang Diambil:
                </h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {responseData.actions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rating & Feedback */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-800 mb-3">
                Bagaimana tanggapan kami?
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="text-2xl hover:text-yellow-400 transition-colors duration-200"
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Berikan Feedback
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Tutup
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Cetak Tanggapan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
