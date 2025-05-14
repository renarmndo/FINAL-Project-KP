import { Request, Response } from "express";
import Komplain from "../models/Komplain.model";

export const getKomplain = async (req: Request, res: Response) => {
  try {
    const komplain = await Komplain.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      msg: "Berhasil Mendapatkan Data Komplain",
      data: komplain,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Terjadi Kesalahan Pada Server",
    });
  }
};
