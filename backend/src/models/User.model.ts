import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { databaseConnection } from "../config/database.config";

interface UserAttributes {
  id: string;
  name: string;
  username: string;
  password: string;
  role: "agent" | "team-fu" | "leader";
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAtributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAtributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string;
  public username!: string;
  public password!: string;
  public role!: "agent" | "team-fu" | "leader";

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("agent", "team_fu", "leader"),
      allowNull: false,
    },
  },
  {
    sequelize: databaseConnection,
    tableName: "users",
    timestamps: true,
  }
);

export default User;
