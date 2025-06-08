import jwt from "jsonwebtoken";
import { Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (res: Response, userId: string, role: string) => {
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRED || "15s";
  if (!secretKey) {
    throw new Error("Token is not defined");
  }
  const token = jwt.sign(
    {
      id: userId,
      role,
    },
    secretKey
  );

  // set jwt an HTTP only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return token;
};
