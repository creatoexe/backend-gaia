import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const ProcesoHerramienta = sequelize.define("ProcesoHerramienta", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  proceso_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "procesos", key: "id" },
    onDelete: "CASCADE",
  },
  herramienta_rpa_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "herramientas_rpa", key: "id" },
    onDelete: "CASCADE",
  },
}, {
  tableName: "proceso_herramientas",
  timestamps: false,
});