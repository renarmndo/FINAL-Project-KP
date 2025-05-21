import express from "express";
import cookie from "cookie-parser";
import cookieParser from "cookie-parser";
import { connectionDb } from "./config/database.config";
import cors from "cors";
// import { syncDatabase } from "./models/index.model";

// Routes
import AuthRoutes from "./routes/Auth.routes";
import UserRoutes from "./routes/User.routes";
import KomplainRoutes from "./routes/Komplain.routes";
import TeamfuRoutes from "./routes/Teamfu.routes";
import LeaderRoutes from "./routes/Leader.routes";
// import User from "./models/User.model";
// import bcrypt from "bcryptjs";

require("dotenv").config();

// Database connection
const app = express();

// Middlewarea
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(cookieParser());

// Routes
app.use("/webKp/auth", AuthRoutes);
app.use("/webKp/user", UserRoutes);
app.use("/webKp/komplain", KomplainRoutes);
app.use("/webKp/teamfu", TeamfuRoutes);
app.use("/webKp/leader", LeaderRoutes);

app.listen(process.env.DB_PORT, () => {
  console.log(`Server Running in port ${process.env.DB_PORT}`);
  connectionDb();
});

// add new user not auth
// (async () => {
//   const existing = await User.findOne({ where: { username: "leader_1" } });

//   if (!existing) {
//     const hashedPassword = await bcrypt.hash("123456", 10); // ganti dengan password aman ya
//     await User.create({
//       name: "Leader Backup",
//       username: "leader_1",
//       password: hashedPassword,
//       role: "leader",
//     });

//     console.log("✅ User leader berhasil dibuat!");
//   } else {
//     console.log("ℹ️ User sudah ada, tidak dibuat ulang.");
//   }
// })();

// syncDatabase();

export default app;
