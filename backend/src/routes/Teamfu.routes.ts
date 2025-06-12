import express from "express";
import {
  getKomplain,
  assignHandler,
  responseKomplain,
  komplainRejected,
  getDataById,
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

router.patch(
  "/komplain/:komplainId/rejected",
  authorized("team_fu"),
  komplainRejected
);

// get komplain by handler
router.get("/komplain/handler", authorized("team_fu"), getDataById);

export default router;
