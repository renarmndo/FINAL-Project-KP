import { Request, Response } from "express";
import Layanan from "../models/Layanan.models";
import LayananField from "../models/LayananFields.models";
import Komplain from "../models/Komplain.model";
import User from "../models/User.model";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.Utils";

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
