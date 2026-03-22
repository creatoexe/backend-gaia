import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
export const EtapaEstimacionConsultor = sequelize.define("EtapaEstimacionConsultor", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  etapa_estimacion_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "etapa_estimacion",
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
  tableName: "etapa_estimacion_consultor",
  timestamps: false,
  indexes: [
  {
    unique: true,
    fields: ["etapa_estimacion_id", "consultor_id"],
    name: "uniq_lev_cons"
  }]
});