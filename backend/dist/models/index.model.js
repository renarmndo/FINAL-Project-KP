"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Komplain = exports.User = void 0;
const Komplain_model_1 = __importDefault(require("./Komplain.model"));
exports.Komplain = Komplain_model_1.default;
const User_model_1 = __importDefault(require("./User.model"));
exports.User = User_model_1.default;
const syncDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Promise.all([
            Komplain_model_1.default.sync({ alter: true }),
            User_model_1.default.sync({ alter: true }),
        ]);
        console.log(`Tabel Database Berhasil Dibuat`);
    }
    catch (error) {
        console.log(`Gagal membuat tabel`, error);
    }
});
syncDatabase();
