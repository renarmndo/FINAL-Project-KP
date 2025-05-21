import express from "express";
import { protect, authorized } from "../middleware/Auth.Middleware";
import {
  createKomplain,
  getAllComplains,
  getComplainById,
  followUpKomplain,
  getLayanan,
  // exportKomplainToCsv,
  getMyKomplain,
} from "../controllers/Komplain.controller";
const router = express.Router();

// Routes Komplain
router.use(protect);

// routes

router.get("/", getAllComplains);
router.get("/me", getMyKomplain);
router.get("/:id", getComplainById);
router.patch("/:id/followUp", authorized("team_fu"), followUpKomplain);
router.post("/", authorized("agent"), createKomplain);
router.get("/layanan", authorized("agent"), getLayanan);
// router.get("/export/csv", authorized("leader"), exportKomplainToCsv);

export default router;
