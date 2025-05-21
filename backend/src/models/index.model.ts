import User from "./User.model";
import Complaint from "./Komplain.model";
import Respons from "./Response.model";
import { databaseConnection, connectionDb } from "../config/database.config";

const syncDatabase = async () => {
  try {
    await connectionDb();

    // **Sync semua model**
    await databaseConnection.sync({ alter: true });
    console.log("✅ Database tables synced!");
  } catch (error) {
    console.error("❌ Error syncing database:", error);
  }
};

export { User, Complaint, Respons, syncDatabase };
