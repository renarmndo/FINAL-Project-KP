import { Request, Response } from "express";
import User from "../models/User.model";
import Komplain from "../models/Komplain.model";
import Layanan from "../models/Layanan.models";
import ResponseKomplain from "../models/Response.model";

export const getKomplain = async (req: Request, res: Response) => {
  try {
    const komplain = await Komplain.findAll({
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["password"],
      },
      include: [
        // { model: User, as: "Agent" },
        { model: User, as: "Handler", attributes: ["name", "username"] },
        { model: Layanan, as: "layanan" },
      ],
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

    const komplain = await Komplain.findByPk(komplainId);

    if (!komplain) {
      return res.status(404).json({
        msg: "Komplain Not Found",
      });
    }

    // Cek apakah komplain sudah completed (tidak bisa diresponse lagi)
    if (komplain.status === "completed") {
      return res.status(400).json({
        msg: "Komplain ini sudah diresponse oleh Team",
      });
    }

    const existingResponse = await ResponseKomplain.findOne({
      where: {
        komplainId,
      },
    });

    let responseData;

    if (existingResponse) {
      // Update existing response (baik yang rejected maupun yang lain)
      await existingResponse.update({
        handlerId,
        jawaban,
        catatanInternal,
        status: "completed",
      });
      responseData = existingResponse;
    } else {
      // Buat response baru jika belum ada
      responseData = await ResponseKomplain.create({
        komplainId,
        handlerId,
        jawaban,
        catatanInternal,
        status: "completed",
      });
    }

    // Update status komplain menjadi completed
    const [updated] = await Komplain.update(
      { status: "completed", handlerId: handlerId },
      {
        where: {
          id: komplainId,
        },
      }
    );

    if (updated === 0) {
      return res.status(404).json({
        msg: "Komplain Not Found",
      });
    }

    return res.status(200).json({
      msg: "Berhasil menambahkan response",
      data: responseData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "terjadi kesalahan pada server",
    });
  }
};

export const komplainRejected: any = async (req: Request, res: Response) => {
  try {
    const { komplainId } = req.params;
    const { catatanInternal } = req.body;
    const handlerId = req.user?.id;
    if (!handlerId) {
      return res.status(401).json({
        msg: "Not Authorized",
      });
    }

    // ambil komplain
    const komplain = await Komplain.findByPk(komplainId);

    if (!komplain) {
      return res.status(404).json({
        msg: "Komplain Not Found",
      });
    }

    if (komplain.status === "completed") {
      return res.status(400).json({
        msg: "Komplain ini sudah diresponse oleh Team Fu",
      });
    }

    // update status komplain
    await Komplain.update(
      {
        status: "rejected",
        handlerId,
      },
      {
        where: { id: komplainId },
      }
    );
    if (catatanInternal) {
      await ResponseKomplain.create({
        komplainId,
        handlerId: handlerId,
        jawaban: "Komplain Ditolak",
        catatanInternal,
        status: "rejected",
      });
    }

    // ambil data
    const updatedKomplain = await Komplain.findByPk(komplainId, {
      include: [
        {
          model: ResponseKomplain,
          as: "responses",
        },
      ],
    });

    return res.status(200).json({
      msg: "Berhasil menolak Komplain",
      data: updatedKomplain,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Terjadi Kesalahan Pada Server",
    });
  }
};

export const getDataById: any = async (req: Request, res: Response) => {
  try {
    const handlerId = req?.user.id;

    if (!handlerId) {
      return res.status(400).json({ msg: "Belum ada data yang diresponse" });
    }

    const komplain = await Komplain.findAll({
      where: {
        handlerId: handlerId, // filter hanya yang cocok
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "Handler",
          attributes: ["name"],
        },
        {
          model: Layanan,
          as: "layanan",
        },
      ],
    });

    res.status(200).json({
      msg: "Berhasil Mendapatkan Data Komplain Berdasarkan handlerId",
      data: komplain,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Terjadi Kesalahan Pada Server" });
  }
};
