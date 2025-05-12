"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const database_config_1 = __importDefault(require("./config/database.config"));
// import createTabke from "./models/index.model";
require("dotenv").config();
// Database connection
const app = (0, express_1.default)();
// Middlewarea
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.listen(process.env.DB_PORT, () => {
  console.log(`Server Running in port ${process.env.DB_PORT}`);
  (0, database_config_1.default)();
});
// Membuat tabel dan relasi
exports.default = app;
