import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.model";
import { generateToken } from "../utils/generateToken.Utils";
import { containsInjectionPatterns } from "../security/sqlInjection";

// Register
export const register: any = async (req: Request, res: Response) => {
  try {
    const { name, username, password, role } = req.body;

    //   check if users exist
    const usersExist = await User.findOne({
      where: {
        username,
      },
    });

    if (usersExist) {
      return res.status(400).json({
        msg: "User Already Exist",
      });
    }

    //   hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user new
    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      role,
    });
    if (user) {
      //   Generate token
      const token = generateToken(res, user.id, user.role);
      return res.status(201).json({
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        token,
      });
    } else {
      return res.status(400).json({
        msg: "Invalid, Data tidak lengkap",
      });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      msg: "terjadi Kesalahan Pada Server",
    });
  }
};
// Login User
export const loginUser: any = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    // console.log("request body:", req.body);

    // handle error

    // jika username dan password tidak ada
    if (!username && !password) {
      return res.status(400).json({
        msg: "Username dan Password tidak boleh kosong",
      });
    }

    if (!username) {
      return res.status(400).json({
        msg: "Username tidak boleh kosong",
      });
    }

    if (!password) {
      return res.status(400).json({
        msg: "Password tidak boleh kosong",
      });
    }

    // validasi user
    const usernameRegex = /^[a-zA-Z0-9_]{4,30}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        msg: "Username tidak valid. Gunakan Hanya Huruf,Angka dan underscore (4-30 karakter)",
      });
    }

    // validasi password tidak boleh kosong
    if (containsInjectionPatterns(password)) {
      return res.status(400).json({
        msg: "Password yang anda masukkan mengandung karakter yang tidak diperbolehkan!",
      });
    }

    //

    //   check for user
    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        msg: "User Tidak Ditemukan atau Belum terdaftar",
      });
    }

    //   check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        msg: "Password Salah!",
      });
    }

    //   generate token
    const token = generateToken(res, user.id, user.role);
    return res.status(200).json({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: "Terjadi kesalahan Pada Server",
      error: error,
    });
  }
};

// Logout user
export const logoutUser: any = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      msg: "Logout Berhasil",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Terjadi Kesalahan Pada Server",
      error: error,
    });
  }
};

// Get profile
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ["password"],
      },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        msg: "User Not Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: "Server Error",
      error: error,
    });
  }
};
