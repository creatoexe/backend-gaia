import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Pais = sequelize.define("Pais", {
  id:        { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre:    { type: DataTypes.STRING(100), allowNull: false, unique: true },
  codigo_iso:{ type: DataTypes.CHAR(3), allowNull: true },
}, { tableName: "paises", timestamps: false });