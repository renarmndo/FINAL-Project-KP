import { Request, Response } from "express";
import Komplain from "../models/Komplain.model";
import { Op } from "sequelize";
import { Parser } from "json2csv";
import User from "../models/User.model";
import Layanan from "../models/Layanan.models";

// gET aLL Complains
export const getAllComplains: any = async (req: Request, res: Response) => {
  try {
    const {
      nomor_Indihome,
      nama_Pelanggan,
      noTlp_Pelanggan,
      email_Pelanggan,
      alamat_Pelanggan,
      layananId,
      priority,
      status,
      startDate,
      endDate,
    } = req.query;

    const userRole = req.user.role;
    const userId = req.user.id;

    let where: any = {};

    //   Apply filters
    if (status) where.status = status;
    if (priority) where.priority = priority;

    //   Date filters
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [
          new Date(startDate as string),
          new Date(endDate as string),
        ],
      };
    } else if (startDate) {
      where.createdAt = {
        [Op.gte]: new Date(startDate as string),
      };
    } else if (endDate) {
      where.createdAt = {
        [Op.lte]: new Date(endDate as string),
      };
    }

    //   Role based filtering
    if (userRole === "agent") {
      where.agentId = userId;
    } else if (userRole === "team_fu") {
      // Semua bisa dilihat oleh team_fu
    }

    const komplain = await Komplain.findAll({
      where,
      include: [
        { model: User, as: "Agent", attributes: ["id", "name", "username"] },
        { model: User, as: "handler", attributes: ["id", "name", "username"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const komplainData = komplain.map((item: any) => ({
      id: item.id,
      nomor_Indihome: item.nomor_Indihome,
      nama_Pelanggan: item.nama_Pelanggan,
      noTlp_Pelanggan: item.noTlp_Pelanggan,
      email_Pelanggan: item.email_Pelanggan,
      alamat_Pelanggan: item.alamat_Pelanggan,
      layanan: item.Layanan
        ? {
            id: item.Layanan.id,
            name: item.Layanan.name,
          }
        : null,
      priority: item.priority,
      status: item.status,
      agent: item.Agent
        ? {
            id: item.Agent.id,
            name: item.Agent.name,
            username: item.Agent.username,
          }
        : null,
      handler: item.Handler
        ? {
            id: item.Handler.id,
            name: item.Handler.name,
            username: item.Handler.username,
          }
        : null,
    }));

    res.status(200).json({
      msg: "Berhasil mendapatkan Komplain",
      data: komplainData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Terjadi Kesalahan Pada Server",
    });
  }
};

// Get Complain By id
export const getComplainById: any = async (req: Request, res: Response) => {
  try {
    const komplainId = req.params.id;
    const komplain = await Komplain.findByPk(komplainId, {
      include: [
        { model: User, as: "Agent", attributes: ["id", "name", "username"] },
        { model: User, as: "Handler", attributes: ["id", "name", "username"] },
      ],
    });
    if (!komplain) {
      return res.status(404).json({
        msg: "Komplain Not Found",
      });
    }

    //   check if users has permission to view this komplain
    if (req.user.role === "agent" && komplain.agentId !== req.user.id) {
      return res.status(403).json({
        msg: "Not authorized to view this komplain",
      });
    }
    res.status(200).json({
      msg: "Berhasil mendapatkan Komplain",
      data: komplain,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error,
      msg: "Terjadi Kesalahan Pada Server",
    });
  }
};

export const createKomplain: any = async (req: Request, res: Response) => {
  try {
    const {
      nomor_Indihome,
      nama_Pelanggan,
      noTlp_Pelanggan,
      email_Pelanggan,
      alamat_Pelanggan,
      layananId,
      priority,
      fields, // ambil fields dari body
    } = req.body;

    const agentId = req.user.id;

    // validasi data wajib
    if (
      !nomor_Indihome ||
      !nama_Pelanggan ||
      !noTlp_Pelanggan ||
      !email_Pelanggan ||
      !alamat_Pelanggan ||
      !layananId ||
      !priority ||
      !agentId
    ) {
      return res.status(400).json({ message: "Semua Data wajib diisi" });
    }

    const existingMsisdn = await Komplain.findOne({
      where: { nomor_Indihome },
    });

    if (existingMsisdn) {
      return res.status(400).json({
        msg: "Nomor indihome Sudah terdaftar",
      });
    }

    // simpan komplain + field tambahan
    const komplain = await Komplain.create({
      nomor_Indihome,
      nama_Pelanggan,
      noTlp_Pelanggan,
      email_Pelanggan,
      alamat_Pelanggan,
      layananId,
      agentId,
      priority: priority || "medium",
      status: "pending",
      data: fields || {}, // <-- ini bagian yang ditambahkan
    });

    return res.status(201).json({
      message: "Komplain berhasil dibuat",
      data: komplain,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Terjadi Kesalahan saat menambahkan Komplain",
    });
  }
};
export const followUpKomplain: any = async (req: Request, res: Response) => {
  try {
    const komplainId = req.params.id;
    const user = req.user;
    const { status } = req.body;

    if (user.role !== "team_fu") {
      return res
        .status(403)
        .json({ message: "Hanya team_fu yang bisa follow-up" });
    }

    const komplain = await Komplain.findByPk(komplainId);

    if (!komplain) {
      return res.status(404).json({ message: "Komplain tidak ditemukan" });
    }

    // Validasi status hanya boleh salah satu dari 3
    const allowedStatus = ["pending", "processing", "completed"];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    // Update handlerId dan status (jika dikirim)
    komplain.handlerId = user.id;
    if (status) komplain.status = status;

    await komplain.save();

    res.status(200).json({
      message: "Komplain berhasil difollow-up",
      data: komplain,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Update Komplain
export const updateKomplain: any = async (req: Request, res: Response) => {
  try {
    const komplainId = req.params.id;
    const { status } = req.body;
    const komplain = await Komplain.findByPk(komplainId);

    if (!komplain) {
      return res.status(404).json({
        msg: "Komplain Data Not Found",
      });
    }

    //   Update status
    komplain.status = status;

    //   if status is processing set handler to current User
    if (status === "processing") {
      komplain.handlerId = req.user.id;
    }
    await komplain.save();

    res.status(200).json({
      msg: "Berhasil mengubah komplain",
      data: komplain,
    });
  } catch (error) {}
};

// export komplain to csv
// export const exportKomplainToCsv: any = async (req: Request, res: Response) => {
//   try {
//     const { startDate, endDate, status } = req.query;
//     let where: any = {};

//     //   Apply filters
//     if (status) where.status = status;

//     //   date filters
//     if (startDate && endDate) {
//       where.createdAt = {
//         [Op.between]: [
//           new Date(startDate as string),
//           new Date(endDate as string),
//         ],
//       };
//     } else if (startDate) {
//       where.createdAt = { [Op.gte]: new Date(startDate as string) };
//     } else if (endDate) {
//       where.createdAt = { [Op.lte]: new Date(endDate as string) };
//     }

//     const komplain = await Komplain.findAll({
//       where,
//       include: [
//         { model: User, as: "Agent", attributes: ["name"] },
//         { model: User, as: "Handler", attributes: ["name"] },
//       ],
//       raw: true,
//       nest: true,
//     });

//     //   transform komplain to csv
//     const formattedData: any = komplain.map((item) => ({
//       id: item.id,
//       msisdn: item.msisdn,
//       title: item.title,
//       description: item.description,
//       priority: item.priority,
//       status: item.status,
//       submittedBy: item.agentId,
//       handlerBy: item.handlerId,
//       createdAt: new Date(item.createdAt ?? "").toLocaleString(),
//       updatedAt: new Date(item.updatedAt ?? "").toLocaleString(),
//     }));

//     //   Configure the csv parser
//     const json2csvParser = new Parser({
//       fields: [
//         { label: "ID", value: "id" },
//         { label: "Msisdn", value: "msisdn" },
//         { label: "Title", value: "title" },
//         { label: "Description", value: "description" },
//         { label: "Priority", value: "priority" },
//         { label: "Status", value: "status" },
//         { label: "Submitted By", value: "submittedBy" },
//         { label: "Handled By", value: "handledBy" },
//         { label: "Created At", value: "createdAt" },
//         { label: "Updated At", value: "updatedAt" },
//       ],
//     });
//     const csv = json2csvParser.parse(formattedData);

//     //   set hedaers for file download
//     res.header("Content-Type", "text/cvs");
//     res.attachment(
//       `komplain-report-${new Date().toISOString().split("T")[0]}.csv`
//     );
//     res.status(200).json(csv);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       msg: "Server Error",
//     });
//   }
// };

// Get Komplain By Agent
export const getMyKomplain: any = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let komplainList;

    // Query berbeda berdasarkan role user
    if (userRole === "agent") {
      // Agent hanya bisa melihat komplain yang dia ajukan
      komplainList = await Komplain.findAll({
        where: { agentId: userId },
        include: [
          { model: User, as: "Agent", attributes: ["id", "name", "username"] },
          {
            model: User,
            as: "Handler",
            attributes: ["id", "name", "username"],
          },
        ],
        order: [["createdAt", "DESC"]], // Urutkan dari terbaru
      });
    } else if (userRole === "handler") {
      // Handler bisa melihat komplain yang ditugaskan kepadanya
      komplainList = await Komplain.findAll({
        where: { handlerId: userId },
        include: [
          { model: User, as: "Agent", attributes: ["id", "name", "username"] },
          {
            model: User,
            as: "Handler",
            attributes: ["id", "name", "username"],
          },
        ],
        order: [["createdAt", "DESC"]], // Urutkan dari terbaru
      });
    } else if (userRole === "admin") {
      // Admin bisa melihat semua komplain
      komplainList = await Komplain.findAll({
        include: [
          { model: User, as: "Agent", attributes: ["id", "name", "username"] },
          {
            model: User,
            as: "Handler",
            attributes: ["id", "name", "username"],
          },
        ],
        order: [["createdAt", "DESC"]], // Urutkan dari terbaru
      });
    } else {
      // Role tidak dikenal/tidak memiliki akses
      return res.status(403).json({
        msg: "Tidak memiliki akses untuk melihat data komplain",
      });
    }

    // Cek jika data kosong
    if (komplainList.length === 0) {
      return res.status(200).json({
        msg: "Belum ada data komplain tersimpan",
        data: [],
      });
    }

    // Kembalikan data komplain
    return res.status(200).json({
      msg: "Berhasil mendapatkan data komplain",
      data: komplainList,
    });
  } catch (error) {
    console.error("Error in getMyKomplain:", error);
    return res.status(500).json({
      msg: "Terjadi kesalahan pada server",
      error: error,
    });
  }
};

// get layanan input leader

// delete komplain
export const deleteKomplain: any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // validation

    // check apakah ada komplain
    const existingKomplain = await Komplain.findByPk(id);
    if (!existingKomplain) {
      return res.status(404).json({
        msg: "Komplain Tidak Ditemukan",
      });
    }

    // jika komplain sedang dikerjkan
    if (existingKomplain.status === "processing") {
      return res.status(403).json({
        msg: "Komplain tidak bisa dihapus karena sedang diproses",
      });
    }

    // hapus komplain
    await existingKomplain.destroy();
    return res.status(200).json({
      msg: "Komplain Berhasil Dihapus",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Terjadi Kesalahan Pada Server",
    });
  }
};

export const editKomplain: any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatData = req.body;

    // validasi apakah komplain ada
    const existingKomplain = await Komplain.findByPk(id);
    if (!existingKomplain) {
      return res.status(404).json({
        msg: "Komplain tidak ditemukan",
      });
    }

    // lakukan update
    await existingKomplain.update(updatData);
    return res.status(200).json({
      msg: "Komplain berhasil diupdate",
      data: existingKomplain,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Terjadi Kesalahan Pada Server",
    });
  }
};
