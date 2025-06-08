import express from "express";
import { protect, authorized } from "../middleware/Auth.Middleware";
import {
  createKomplain,
  getAllComplains,
  getComplainById,
  followUpKomplain,
  getMyKomplain,
  editKomplain,
  deleteKomplain,
} from "../controllers/Komplain.controller";
import {
  getLayanan,
  getAllFieldsByLayananId,
  getResponseById,
} from "../controllers/Agent.controller";
const router = express.Router();

// Routes Komplain
router.use(protect);

// routes

router.get("/", getAllComplains);
router.get("/me", getMyKomplain);
router.get("/:id", getComplainById);
router.patch("/:id/followUp", authorized("team_fu"), followUpKomplain);
router.post("/create-komplain", authorized("agent"), createKomplain);

// get layanan input leader
router.get("/agent/layanan", authorized("agent"), getLayanan);
router.get(
  "/agent/layanan/:layananId/field",
  authorized("agent"),
  getAllFieldsByLayananId
);

router.patch("/agent/:id/edit", authorized("agent"), editKomplain);
router.delete("/agent/:id/delete", authorized("agent"), deleteKomplain);

// get response
router.get("/agent/:id/response", authorized("agent"), getResponseById);

export default router;
