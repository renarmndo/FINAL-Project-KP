import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import Komplain from "./Komplain.model";
import User from "./User.model";
import { databaseConnection } from "../config/database.config";

interface ResponseAttributes {
  id: string;
  komplainId: string;
  handlerId: string | null;
  jawaban: string;
  catatanInternal?: string;
  status: "pending" | "processing" | "completed" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

interface ResponseCreationAttributes
  extends Optional<ResponseAttributes, "id" | "catatanInternal" | "status"> {}

class Response
  extends Model<ResponseAttributes, ResponseCreationAttributes>
  implements ResponseAttributes
{
  public id!: string;
  public komplainId!: string;
  public handlerId!: string | null;
  public jawaban!: string;
  public catatanInternal?: string;
  public status!: "pending" | "processing" | "completed" | "rejected";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Response.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    komplainId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Komplain,
        key: "id",
      },
    },
    handlerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    jawaban: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    catatanInternal: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "processing", "completed", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize: databaseConnection,
    tableName: "respons",
    timestamps: true,
  }
);

// relasi
Response.belongsTo(Komplain, {
  foreignKey: "komplainId",
  as: "komplain",
});

Response.belongsTo(User, {
  foreignKey: "handlerId",
  as: "handler",
});

Komplain.hasMany(Response, {
  foreignKey: "komplainId",
  as: "responses",
});

export default Response;
