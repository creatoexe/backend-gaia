import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaPropuestaConsultor = sequelize.define("EtapaPropuestaConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  etapa_propuesta_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "etapa_propuesta", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  }
}, {
  tableName: "etapa_propuesta_consultor",
  timestamps: false,  
  indexes: [{ unique: true, fields: ["etapa_propuesta_id", "consultor_id"], name: "uniq_prop_cons" }]  
});