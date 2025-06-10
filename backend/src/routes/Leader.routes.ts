import express from "express";
import { protect, authorized } from "../middleware/Auth.Middleware";
import {
  createField,
  getAllFields,
  getAllKomplainCompleted,
  createUser,
} from "../controllers/Leader.controller";
import { createFieldLayanan } from "../controllers/Leader.controller";

const router = express.Router();

router.use(protect);

router.get("/layanan", authorized("leader"), getAllFields);
router.post("/create-layanan", authorized("leader"), createField);

// create fileds
router.post("/:id/create-field", authorized("leader"), createFieldLayanan);

// get all komplain
router.get(
  "/komplain-completed",
  authorized("leader"),
  getAllKomplainCompleted
);

router.post("/create-user/leader", authorized("leader"), createUser);

export default router;
