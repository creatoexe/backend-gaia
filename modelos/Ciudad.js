import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Ciudad = sequelize.define("Ciudad", {
  id:      { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre:  { type: DataTypes.STRING(120), allowNull: false },
  pais_id: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: "ciudades", timestamps: false });