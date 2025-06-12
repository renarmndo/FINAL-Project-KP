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
    const layanan = await Layanan.findByPk(id);
    if (!layanan) {
      return res.status(404).json({
        msg: "Layanan Tidak Ditemukan",
      });
    }
    await layanan.destroy({
      force: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Terjadi Kesalahan Pada Server",
    });
  }
};

export const editLayanan: any = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama_layanan, deskripsi_layanan } = req.body;

    // validasi data

    // update data
    const layanan = await Layanan.findByPk(id);
    if (!layanan) {
      return res.status(404).json({
        msg: "Layanan Tidak Ditemukan",
      });
    }

    // update data
    await layanan.update({
      nama_layanan,
      deskripsi_layanan,
    });

    return res.status(200).json({
      msg: "Layanan Berhasil Diupdate",
      data: layanan,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Terjadi Kesalahan pada server",
    });
  }
};
