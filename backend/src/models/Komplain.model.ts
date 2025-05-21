import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import User from "./User.model";
import Layanan from "./Layanan.models";
import { databaseConnection } from "../config/database.config";

interface KomplainAtributes {
  id: string;
  nomor_Indihome: string;
  nama_Pelanggan: string;
  noTlp_Pelanggan: string;
  email_Pelanggan: string;
  alamat_Pelanggan: string;
  layananId: string;
  data: Record<string, any>;
  priority: "high" | "medium" | "low";
  status: "pending" | "processing" | "completed";
  agentId: string;
  handlerId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface KomplainCreationAttributes
  extends Optional<KomplainAtributes, "id" | "handlerId"> {}

class Komplain
  extends Model<KomplainAtributes, KomplainCreationAttributes>
  implements KomplainAtributes
{
  public id!: string;
  public nomor_Indihome!: string;
  public nama_Pelanggan!: string;
  public noTlp_Pelanggan!: string;
  public email_Pelanggan!: string;
  public alamat_Pelanggan!: string;
  public layananId!: string;
  public data!: Record<string, any>;
  public priority!: "high" | "medium" | "low";
  public status!: "pending" | "processing" | "completed";

  public agentId!: string;
  public handlerId?: string | null;

  public readonly createdAt!: Date | undefined;
  public readonly updatedAt!: Date | undefined;
}

Komplain.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    nomor_Indihome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_Pelanggan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    noTlp_Pelanggan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email_Pelanggan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamat_Pelanggan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    layananId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "layanan",
        key: "id",
      },
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      allowNull: false,
      defaultValue: "medium",
    },
    status: {
      type: DataTypes.ENUM("pending", "processing", "completed"),
      allowNull: false,
      defaultValue: "pending",
    },
    agentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
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
  },
  {
    sequelize: databaseConnection,
    tableName: "komplain",
    timestamps: true,
  }
);

// Define assosiaton
Komplain.belongsTo(User, {
  foreignKey: "agentId",
  as: "Agent",
});

Komplain.belongsTo(Layanan, {
  foreignKey: "layananId",
  as: "layanan",
});

Komplain.belongsTo(User, {
  foreignKey: "handlerId",
  as: "Handler",
});

User.hasMany(Komplain, {
  foreignKey: "agentId",
  as: "SubmittedKomplain",
});

Layanan.hasMany(Komplain, {
  foreignKey: "layananId",
  as: "komplain",
});

export default Komplain;
