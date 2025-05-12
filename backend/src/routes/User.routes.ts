import express from "express";
import { protect, authorized } from "../middleware/Auth.Middleware";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/User.controller";

const router = express.Router();

// semua routes pakai protec
router.use(protect);
// Routes User
router.get("/", authorized("leader", "team_fu"), getUsers);
router.get("/:id", authorized("leader", "team_fu"), getUserById);
router.post("/", authorized("leader", "team_fu"), createUser);
router.put("/:id", authorized("leader"), updateUser);
router.delete("/:id", authorized("leader"), deleteUser);

export default router;
