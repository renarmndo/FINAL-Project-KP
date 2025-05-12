import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const databaseConnection = new Sequelize(
  process.env.DB_NAME || "db_Kp",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectionDb = async () => {
  try {
    await databaseConnection.authenticate();
    console.log(`Database Connection Has been successfully`);
  } catch (error) {
    console.error(error);
  }
};

export { databaseConnection, connectionDb };
