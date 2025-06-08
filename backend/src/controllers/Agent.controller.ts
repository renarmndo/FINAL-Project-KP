import { Request, Response } from "express";
import Layanan from "../models/Layanan.models";
import LayananField from "../models/LayananFields.models";
import ResponseModel from "../models/Response.model";

export const getLayanan: any = async (req: Request, res: Response) => {
  try {
    const layananList = await Layanan.findAll({
      attributes: ["id", "nama_layanan", "deskripsi_layanan"], // field yang dikirim
      order: [["createdAt", "DESC"]], // opsional: urutkan dari terbaru
    });

    return res.status(200).json({
      status: "success",
      data: layananList,
    });
  } catch (error) {
    console.error("Error fetching layanan:", error);
    return res.status(500).json({
      status: "error",
      msg: "Gagal mengambil data layanan",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllFieldsByLayananId: any = async (
  req: Request,
  res: Response
) => {
  try {
    const { layananId } = req.params;
    const fiedList = await LayananField.findAll({
      where: {
        layananId,
      },
      attributes: ["label", "field_name", "field_type"],
    });
    if (!fiedList || fiedList.length === 0) {
      return res.status(404).json({
        msg: "Error,Field tidak ditemukan untuk layanan ini",
      });
    }

    return res.status(200).json({
      msg: "Berhasil mendapatkan field",
      data: fiedList,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server Error",
    });
  }
};

// input data field list
export const getResponseById: any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await ResponseModel.findOne({
      where: { komplainId: id },
    });
    if (!response) {
      return res.status(404).json({
        msg: "Komplain ini belum diresponse Oleh pihak team kami",
      });
    }
    return res.status(200).json({
      msg: "Berhasil mendapatkan response",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Server Error",
    });
  }
};
