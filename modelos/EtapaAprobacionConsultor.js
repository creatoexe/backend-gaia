import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
export const EtapaAprobacionConsultor = sequelize.define("EtapaAprobacionConsultor", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  etapa_aprobacion_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "etapa_aprobacion",
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
  tableName: "etapa_aprobacion_consultor",
  timestamps: false,
    uniqueKeys: {
    uniq_lev_cons: {
      fields: ["etapa_aprobacion_id", "consultor_id"]
    }
  }
});