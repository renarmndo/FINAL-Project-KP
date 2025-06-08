import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { databaseConnection } from "../config/database.config";
import Layanan from "./Layanan.models";

interface LayananFieldAttributes {
  id: string;
  layananId: string;
  label: string;
  field_name: string;
  field_type: "text" | "number" | "textarea";
  is_required: boolean;
}

interface LayananFieldCreationAttributes
  extends Optional<LayananFieldAttributes, "id"> {}

class LayananField
  extends Model<LayananFieldAttributes, LayananFieldCreationAttributes>
  implements LayananFieldAttributes
{
  public id!: string;
  public layananId!: string;
  public label!: string;
  public field_name!: string;
  public field_type!: "text" | "number" | "textarea";
  public is_required!: boolean;
}

LayananField.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    layananId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    field_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    field_type: {
      type: DataTypes.ENUM("text", "number", "textarea"),
      allowNull: false,
    },
    is_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: databaseConnection,
    tableName: "layanan_fields",
    timestamps: true,
  }
);

Layanan.hasMany(LayananField, {
  foreignKey: "layananId",
  as: "fields",
});
LayananField.belongsTo(Layanan, {
  foreignKey: "layananId",
  as: "layanan",
});

export default LayananField;
