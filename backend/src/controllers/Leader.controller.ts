import { Request, Response } from "express";
import Layanan from "../models/Layanan.models";
import LayananField from "../models/LayananFields.models";

export const getAllFields: any = async (req: Request, res: Response) => {
  try {
    const fields = await Layanan.findAll();
    res.status(200).json({
      data: fields,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

export const createField: any = async (req: Request, res: Response) => {
  try {
    const { nama_layanan, deskripsi_layanan } = req.body;
    const field = await Layanan.create({ nama_layanan, deskripsi_layanan });
    res.status(201).json({
      msg: "Berhasil Menambah Layanan",
      data: field,
    });
  } catch (error) {}
};

// Tambah layanan field
export const createFieldLayanan: any = async (req: Request, res: Response) => {
  try {
    const { label, field_name, field_type } = req.body;
    const layananId = req.params.id;

    // Cek apakah layanan dengan ID tersebut ada
    const layanan = await Layanan.findByPk(layananId);
    if (!layanan) {
      return res.status(404).json({ msg: "ILayanan tidak ditemukan" });
    }

    const field = await LayananField.create({
      layananId,
      label,
      field_name,
      field_type,
      is_required: false,
    });
    res.status(201).json({
      msg: "Berhasil Menambah Layanan Field",
      data: field,
    });
  } catch (error) {
    console.log("error");
    return res.status(500).json({ msg: "Server Error" });
  }
};

// id: string;
// layananId: string;
// label: string;
// field_name: string;
// field_type: "text" | "number" | "textarea";
// is_required: boolean;
