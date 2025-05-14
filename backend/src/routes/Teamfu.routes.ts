import express from "express";
import { getKomplain } from "../controllers/teamfu.controller";
import { protect, authorized } from "../middleware/Auth.Middleware";

const router = express.Router();

router.use(protect);

//routes

router.get("/komplain", getKomplain, authorized("team_fu"));

export default router;
