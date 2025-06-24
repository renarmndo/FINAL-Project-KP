import express from "express";
import { protect, authorized } from "../middleware/Auth.Middleware";
import {
  createField,
  getAllFields,
  getAllKomplainCompleted,
  createUser,
  reportKomplainCsv,
  deleteLayanan,
  editLayanan,
  editUser,
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

// report to csv
router.get("/report-csv", authorized("leader"), reportKomplainCsv);

// delete layanan
router.delete("/layanan/:id/delete", authorized("leader"), deleteLayanan);

// edit layanan
router.patch("/layanan/:id/edit", authorized("leader"), editLayanan);

// edit user
router.patch("/user/:id/edit", authorized("leader"), editUser);

export default router;
