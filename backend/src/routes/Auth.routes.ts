import express from "express";
import { protect, authorized } from "../middleware/Auth.Middleware";
import {
  register,
  loginUser,
  logoutUser,
} from "../controllers/Auth.controller";

const router = express.Router();

// Middleware
// router.use(protect, authorized);
// Routes Auth
router.post("/register", register);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
// router.post("");

export default router;
