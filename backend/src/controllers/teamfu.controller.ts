import { Request, Response } from "express";
import User from "../models/User.model";
import Komplain from "../models/Komplain.model";
import ResponseKomplain from "../models/Response.model";

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

// Handler Komplain
export const assignHandler: any = async (req: Request, res: Response) => {
  try {
    const { komplainId } = req.params;
    const handlerId = req.user.id;
    const komplain = await Komplain.findByPk(komplainId);

    if (!komplainId) {
      return res.status(404).json({
        msg: "Komplain Not Found",
      });
    }

    // update handler
    await komplain?.update({
      handlerId,
      status: "processing",
    });

    return res.status(200).json({
      msg: "Komplain Accepted",
      data: komplain,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Server Error",
    });
  }
};

export const responseKomplain: any = async (req: Request, res: Response) => {
  try {
    const { komplainId } = req.params;
    const { jawaban, catatanInternal } = req.body;
    const handlerId = req.user?.id;

    if (!handlerId) {
      return res.status(401).json({
        msg: "Not Authorized",
      });
    }

    const newResponse = await ResponseKomplain.create({
      komplainId,
      handlerId,
      jawaban,
      catatanInternal,
      status: "completed",
    });

    await Komplain.update(
      {
        status: "completed",
      },
      {
        where: {
          id: komplainId,
        },
      }
    );

    return res.status(200).json({
      msg: "Berhasil menambahkan response",
      data: newResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "terjadi kesalahan pada server",
    });
  }
};
