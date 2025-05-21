import express from "express";
import {
  getKomplain,
  assignHandler,
  responseKomplain,
} from "../controllers/teamfu.controller";
import { protect, authorized } from "../middleware/Auth.Middleware";

const router = express.Router();

router.use(protect);

//routes

router.get("/komplain", authorized("team_fu"), getKomplain);
router.put(
  "/komplain/:komplainId/hanlder",
  authorized("team_fu"),
  assignHandler
);

router.post(
  "/komplain/:komplainId/handler",
  authorized("team_fu"),
  responseKomplain
);

export default router;
