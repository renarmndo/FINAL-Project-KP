import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model";
import dotenv from "dotenv";

dotenv.config();

interface DocededToken {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookie
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        msg: "Not Authorized, please Again",
      });
    }

    //   verifikasi token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DocededToken;

    //   Get user from database
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        msg: "User not Found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      msg: "Terjadi Kesalahan pada server",
      error: error,
    });
  }
};

export const authorized: any = (...role: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        msg: "Not Authorized, please Login",
      });
    }
    if (!role.includes(req.user.role)) {
      return res.status(403).json({
        msg: "Hak akses dilindungi, anda tidak dapat mengakses halaman ini",
      });
    }
    next();
  };
};
