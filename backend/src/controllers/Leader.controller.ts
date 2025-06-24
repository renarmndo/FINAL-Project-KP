import { Request, Response } from "express";
import Layanan from "../models/Layanan.models";
import LayananField from "../models/LayananFields.models";
import Komplain from "../models/Komplain.model";
import User from "../models/User.model";
import { Op, where } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.Utils";
import XLSX from "xlsx";

const VALID_JENIS_LAYANAN = [
  "tagihan",
  "produk",
  "pelayanan",
  "jaringan",
  "e-bill",
  "lain-lain",
];
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
  // try {
  //   const { nama_layanan, deskripsi_layanan, jenis_layanan } = req.body;
  //   if (!Object.values(jenis_layanan).includes(jenis_layanan)) {
  //     return res.status(400).json({ msg: "Jenis Layanan tidak valid" });
  //   }
  //   if (!nama_layanan || !deskripsi_layanan || !jenis_layanan) {
  //     return res.status(400).json({ msg: "Semua field wajib diisi" });
  //   }
  //   // buat layanan
  //   const field = await Layanan.create({
  //     nama_layanan,
  //     deskripsi_layanan,
  //     jenis_layanan,
  //   });
  //   res.status(201).json({
  //     msg: "Berhasil Menambah Layanan",
  //     data: field,
  //   });
  // } catch (error) {}

  try {
    const { nama_layanan, deskripsi_layanan, jenis_layanan } = req.body;

    // Validasi input kosong
    if (!nama_layanan || !deskripsi_layanan || !jenis_layanan) {
      return res.status(400).json({
        message: "Semua field wajib diisi",
        error: "Missing required fields",
      });
    }

    // Validasi jenis layanan - perbaikan logika
    if (!VALID_JENIS_LAYANAN.includes(jenis_layanan)) {
      return res.status(400).json({
        message: "Jenis Layanan tidak valid",
        error: `Valid options: ${VALID_JENIS_LAYANAN.join(", ")}`,
        received: jenis_layanan,
      });
    }

    // Buat layanan baru
    const newLayanan = await Layanan.create({
      nama_layanan: nama_layanan.trim(),
      deskripsi_layanan: deskripsi_layanan.trim(),
      jenis_layanan: jenis_layanan.trim(),
    });

    res.status(201).json({
      message: "Berhasil Menambah Layanan",
      data: newLayanan,
    });
  } catch (error: any) {
    console.error("Error creating layanan:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation Error",
        error: error.errors.map((err: any) => ({
          field: err.path,
          message: err.message,
          value: err.value,
        })),
      });
    }

    // Handle Sequelize unique constraint errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Data sudah exist",
        error: error.errors.map((err: any) => ({
          field: err.path,
          message: err.message,
          value: err.value,
        })),
      });
    }

    // Handle other Sequelize errors
    if (error.name && error.name.startsWith("Sequelize")) {
      return res.status(400).json({
        message: "Database Error",
        error: error.message,
      });
    }

    // Generic error handler
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message || "Internal server error",
    });
  }
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

// get all komplain by status completed
export const getAllKomplainCompleted: any = async (
  req: Request,
  res: Response
) => {
  try {
    const { start_date, end_date } = req.query;

    const whereCondition: any = {
      status: "completed",
    };

    if (start_date || end_date) {
      whereCondition.createdAt = {};
      if (start_date) {
        whereCondition.createdAt[Op.gte] = new Date(start_date as string);
      }
      if (end_date) {
        whereCondition.createdAt[Op.lte] = new Date(end_date as string);
      }
    }

    const komplainData = await Komplain.findAll({
      where: whereCondition,
      include: [
        {
          model: Layanan,
          as: "layanan",
          attributes: ["id", "nama_layanan"],
        },
        {
          model: User,
          as: "Agent",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "Handler",
          attributes: ["id", "name"],
        },
      ],
    });
    return res.status(200).json({
      msg: "Data komplain dengan status completed berhasil didapatkan",
      data: komplainData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

export const createUser: any = async (req: Request, res: Response) => {
  try {
    const { name, username, password, role } = req.body;

    if (!name || !username || !password || !role) {
      return res.status(400).json({
        msg: "Semua field wajib diisi",
      });
    }
    // chek apakah username ada
    const exisUsername = await User.findOne({
      where: {
        username,
      },
    });

    if (exisUsername) {
      return res.status(400).json({
        msg: "Username sudah terdaftar",
      });
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      role,
    });

    if (user) {
      //  genereate token
      const token = generateToken(res, user.id, user.role);
      return res.status(201).json({
        msg: "Berhasil Membuat User",
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        token,
      });
    } else {
      return res.status(500).json({
        msg: "Invalid, Data terjadi kesalahan pada server",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

// export const reportKomplainCsv: any = async (req: Request, res: Response) => {
//   try {
//     const complainData = await Komplain.findAll({
//       where: { status: "completed" },
//       include: [
//         { model: Layanan, as: "layanan", attributes: ["nama_layanan"] },
//       ],
//       order: [["createdAt", "DESC"]],
//     });

//     if (!complainData || complainData.length === 0) {
//       return res.status(404).json({
//         success: false,
//         msg: "Data komplain tidak ditemukan",
//       });
//     }

//     // format data untuk excel
//     const excelData = complainData.map((item: any) => ({
//       ID: item.id,
//       "Nomor Indihome": item.nomor_Indihome,
//       "Nama Pelanggan": item.nama_Pelanggan,
//       "No Telp Pelanggan": item.noTlp_Pelanggan,
//       "Email Pelanggan": item.email_Pelanggan,
//       "Alamat Pelanggan": item.alamat_Pelanggan,
//       "Jenis Layanan": item.layanan?.nama_layanan || "-",
//       Status: item.status,
//       Prioritas: item.priority,
//       "Agent ID": item.agentId,
//       "Handler ID": item.handlerId || "-",
//       "Data Tambahan": item.data ? JSON.stringify(item.data) : "-",
//       "Tanggal Dibuat": new Date(item.createdAt).toLocaleDateString("id-ID"),
//       "Tanggal Update": new Date(item.updatedAt).toLocaleDateString("id-ID"),
//     }));

//     // Buat worksheet dan workbook
//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Komplain");

//     // Tulis file ke buffer
//     const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

//     // Kirim buffer sebagai file unduhan
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=laporan_komplain.xlsx"
//     );
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     return res.status(200).json({
//       success: true,
//       msg: "Data komplain berhasil didapatkan",
//       data: buffer,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ msg: "Server Error" });
//   }
// };

export const reportKomplainCsv: any = async (req: Request, res: Response) => {
  try {
    const complainData = await Komplain.findAll({
      where: { status: "completed" },
      include: [
        { model: Layanan, as: "layanan", attributes: ["nama_layanan"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!complainData || complainData.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "Data komplain tidak ditemukan",
      });
    }

    // format data untuk excel
    const excelData = complainData.map((item: any) => ({
      ID: item.id,
      "Nomor Indihome": item.nomor_Indihome,
      "Nama Pelanggan": item.nama_Pelanggan,
      "No Telp Pelanggan": item.noTlp_Pelanggan,
      "Email Pelanggan": item.email_Pelanggan,
      "Alamat Pelanggan": item.alamat_Pelanggan,
      "Jenis Layanan": item.layanan?.nama_layanan || "-",
      Status: item.status,
      Prioritas: item.priority,
      "Agent ID": item.agentId,
      "Handler ID": item.handlerId || "-",
      "Data Tambahan": item.data ? JSON.stringify(item.data) : "-",
      "Tanggal Dibuat": new Date(item.createdAt).toLocaleDateString("id-ID"),
      "Tanggal Update": new Date(item.updatedAt).toLocaleDateString("id-ID"),
    }));

    // Buat worksheet dan workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    // Set column widths (opsional, untuk tampilan yang lebih baik)
    const columnWidths = [
      { wch: 10 }, // ID
      { wch: 15 }, // Nomor Indihome
      { wch: 20 }, // Nama Pelanggan
      { wch: 15 }, // No Telp Pelanggan
      { wch: 25 }, // Email Pelanggan
      { wch: 40 }, // Alamat Pelanggan
      { wch: 20 }, // Jenis Layanan
      { wch: 12 }, // Status
      { wch: 10 }, // Prioritas
      { wch: 15 }, // Agent ID
      { wch: 15 }, // Handler ID
      { wch: 30 }, // Data Tambahan
      { wch: 15 }, // Tanggal Dibuat
      { wch: 15 }, // Tanggal Update
    ];
    worksheet["!cols"] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Komplain");

    // Tulis file ke buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Generate filename dengan timestamp
    const filename = `laporan_komplain_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    // Set headers untuk file download
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // PERBAIKAN UTAMA: Gunakan res.send() bukan res.json()
    return res.send(buffer);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
};

export const deleteLayanan: any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // validasi data
    if (!id) {
      res.status(400).json({
        success: false,
        msg: "ID layanan tidak ada",
      });
      return;
    }

    // check apakah layanan ada
    const layanan = await Layanan.findByPk(id);
    if (!layanan) {
      res.status(400).json({
        success: false,
        msg: "Layanan tidak ditemukan",
      });
      return;
    }

    // mulai transaction
    const transaction = await Layanan.sequelize?.transaction();
    try {
      // hapus semua field layanan yang berelasi dengan layanan
      await LayananField.destroy({
        where: {
          layananId: id,
        },
        transaction,
      });
      // hapus layanan
      await Layanan.destroy({
        where: {
          id: id,
        },
        transaction,
      });

      // commit transaction
      await transaction?.commit();
      res.status(200).json({
        success: true,
        msg: "Layanan dan field layanan berhasil dihapus",
      });
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "Terjadi kesalahan pada server",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const editLayanan: any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama_layanan, deskripsi_layanan } = req.body;

    // validasi data
    if (!id) {
      res.status(400).json({
        success: false,
        msg: "ID layanan tidak boleh kosong",
      });
      return;
    }

    // validasi data
    const layanan = await Layanan.findByPk(id);
    if (!layanan) {
      res.status(404).json({
        success: false,
        msg: "Layanan tidak ditemukan",
      });
      return;
    }

    // update layanan
    await Layanan.update(
      {
        nama_layanan,
        deskripsi_layanan,
      },
      {
        where: { id },
      }
    );

    // ambil data yang sudah di update
    const updateLayanan = await Layanan.findByPk(id, {
      include: [
        {
          model: LayananField,
          as: "fields",
        },
      ],
    });
    res.status(200).json({
      success: true,
      msg: "Layanan berhasil di update",
      data: updateLayanan,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Terjadi kesalahan pada server",
    });
  }
};

export const editUser: any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, username, role } = req.body;

    // validasi data
    if (!id) {
      return res.status(400).json({
        msg: "User ID tidak ada",
      });
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(400).json({
        msg: "User tidak terdaftar",
      });
    }

    // update user
    await User.update(
      {
        name,
        username,
        role,
      },
      {
        where: { id },
      }
    );
    const updateUser = await User.findByPk(id);
    res.status(200).json({
      success: true,
      msg: "User berhasil di update",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Terjadi kesalahan pada server",
    });
  }
};
