import React, { useEffect, useState } from "react";
import axios from "axios";
import { editLayanan } from "../../../service/Index";

export const EditLayanan = ({ layanan, onSubmit, onCancel }) => {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskiprsi] = useState("");

  useEffect(() => {
    if (layanan) {
      setNama(layanan.nama_layanan);
    }
  }, []);
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-all duration-300">
        <div className="flex min-h-full items-center justify-center p-4">
          <h1 className="text-2xl font-red">POP UP EDIT LAYANAN</h1>
        </div>
      </div>
    </div>
  );
};
