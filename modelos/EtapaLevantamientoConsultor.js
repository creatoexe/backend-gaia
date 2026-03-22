import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
export const EtapaLevantamientoConsultor = sequelize.define("EtapaLevantamientoConsultor", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  etapa_levantamiento_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "etapa_levantamiento",
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },

  consultor_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "consultores",
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  }

}, {
  tableName: "etapa_levantamiento_consultor",
  timestamps: false,
 
  indexes: [
  {
    unique: true,
    fields: ["etapa_levantamiento_id", "consultor_id"],
    name: "uniq_lev_cons"
  }]
});