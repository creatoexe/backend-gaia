import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaEjecucionConsultor = sequelize.define("EtapaEjecucionConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  etapa_ejecucion_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "etapa_ejecucion", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  }
}, {
  tableName: "etapa_ejecucion_consultor",
  timestamps: false,
  indexes: [{ unique: true, fields: ["etapa_ejecucion_id", "consultor_id"], name: "uniq_ejec_cons" }]  
});