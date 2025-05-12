"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const User_model_1 = __importDefault(require("./User.model"));
const database_config_1 = __importDefault(require("../config/database.config"));
class Komplain extends sequelize_1.Model {
}
Komplain.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: () => (0, uuid_1.v4)(),
        primaryKey: true,
    },
    msisdn: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    priority: {
        type: sequelize_1.DataTypes.ENUM("low", "medium", "high"),
        allowNull: false,
        defaultValue: "medium",
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("pending", "processing", "completed"),
        allowNull: false,
        defaultValue: "pending",
    },
    agentId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: User_model_1.default,
            key: "id",
        },
    },
    handler: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: User_model_1.default,
            key: "id",
        },
    },
}, {
    db: database_config_1.default,
    tableName: "komplain",
    timestamps: true,
});
// Define assosiaton
Komplain.belongsTo(User_model_1.default, {
    foreignKey: "agentId",
    as: "Agent",
});
Komplain.belongsTo(User_model_1.default, {
    foreignKey: "handlerId",
    as: "Handler",
});
User_model_1.default.hasMany(Komplain, {
    foreignKey: "agentId",
    as: "SubmittedKomplain",
});
User_model_1.default.hasMany(Komplain, {
    foreignKey: "handlerId",
    as: "HandlerKomplain",
});
exports.default = Komplain;
