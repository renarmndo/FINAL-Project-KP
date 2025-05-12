import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import User from "./User.model";
import { databaseConnection } from "../config/database.config";

interface KomplainAtributes {
  id: string;
  msisdn: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "processing" | "completed";
  agentId: string;
  handlerId?: string;
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
  public msisdn!: string;
  public title!: string;
  public description!: string;
  public priority!: "low" | "medium" | "high";
  public status!: "pending" | "processing" | "completed";
  public agentId!: string;
  public handlerId?: string;

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
    msisdn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
      type: DataTypes.STRING,
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
Komplain.belongsTo(User, {
  foreignKey: "handlerId",
  as: "Handler",
});

User.hasMany(Komplain, {
  foreignKey: "agentId",
  as: "SubmittedKomplain",
});

User.hasMany(Komplain, {
  foreignKey: "handlerId",
  as: "HandlerKomplain",
});

export default Komplain;
