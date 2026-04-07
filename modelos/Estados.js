import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Estados = sequelize.define("Estados", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: "estados",
  timestamps: true,
});