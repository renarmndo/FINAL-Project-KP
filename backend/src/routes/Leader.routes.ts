import express from "express";
import { protect, authorized } from "../middleware/Auth.Middleware";
import { createField, getAllFields } from "../controllers/Leader.controller";
import { createFieldLayanan } from "../controllers/Leader.controller";

const router = express.Router();

router.use(protect);

router.get("/layanan", authorized("leader"), getAllFields);
router.post("/create-layanan", authorized("leader"), createField);

// create fileds
router.post("/:id/create-field", authorized("leader"), createFieldLayanan);

export default router;
