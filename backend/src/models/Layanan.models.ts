import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import User from "./User.model";
import { databaseConnection } from "../config/database.config";

interface LayananAtributes {
  id: string;
  nama_layanan: string;
  deskripsi_layanan: string;
  jenis_layanan: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LayananCreationAttributes extends Optional<LayananAtributes, "id"> {}

class Layanan
  extends Model<LayananAtributes, LayananCreationAttributes>
  implements LayananAtributes
{
  public id!: string;
  public nama_layanan!: string;
  public deskripsi_layanan!: string;
  public jenis_layanan!: string;
  public readonly createdAt?: Date | undefined;
  public readonly updatedAt?: Date | undefined;
}

Layanan.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    nama_layanan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deskripsi_layanan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    jenis_layanan: {
      type: DataTypes.ENUM(
        "tagihan",
        "produk",
        "pelayanan",
        "jaringan",
        "e-bill",
        "lain-lain"
      ),
      allowNull: false,
    },
  },
  {
    sequelize: databaseConnection,
    tableName: "layanan",
    timestamps: true,
  }
);

export default Layanan;
