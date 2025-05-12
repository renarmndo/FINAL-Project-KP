import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.model";

// Get All users basedon role

export const getUsers: any = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;

    let where: any = {};
    if (role) {
      where.role = role;
    }

    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
      where,
    });
    res.status(200).json({
      msg: "Berhasil Mendapatkan Data User",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Server Error",
      error: error,
    });
  }
};

// Get user by id
export const getUserById: any = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password"],
      },
    });
    if (!user) {
      return res.status(404).json({
        msg: "User Not Found",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Terjadi Kesalahan Pada Server",
      error: error,
    });
  }
};

// Create New User
export const createUser: any = async (req: Request, res: Response) => {
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

    // if (req.user.role === "team_fu") {
    //   //   team fu hanya boleh membuat role agent
    //   if (role !== "agent") {
    //     return res.status(403).json({
    //       msg: "Team Fu can only create Agent accounts",
    //     });
    //   }
    // } else if (req.user.role === 'leader') {
    //     // Leader boleh menambahkan agenr dan team_fu
    // }

    // //   Validasi role permissions
    if (req.user.role === "team_fu" && role !== "agent") {
      return res.status(403).json({
        msg: "Team Fu can only create Agent accounts",
      });
    }

    //   hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // create user
    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      role,
    });
    if (user) {
      return res.status(201).json({
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      });
    } else {
      return res.status(400).json({
        msg: "Invalid user Data",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Server Error",
      error: error,
    });
  }
};

// Update User
export const updateUser: any = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, username, password, role } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    //   Only leader can update role
    if (role && req.user.role !== "leader") {
      return res.status(403).json({ msg: "Only leader can update user role" });
    }
    //   updae fields
    if (name) user.name = name;
    if (username) user.username = username;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
    }
    if (role && req.user.role === "leader") {
      user.role = role;
    }
    await user.save();

    res.status(200).json({
      msg: "Berhasil mengubah data user",
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Terjadi Kesalahan Pada Server",
    });
  }
};

// Delete User
export const deleteUser: any = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        msg: "User Not Found",
      });
    }

    await user.destroy();

    res.status(200).json({
      msg: "User deleted SuccessFully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Terjadi Kesalahan Pada Server",
      error: error,
    });
  }
};
