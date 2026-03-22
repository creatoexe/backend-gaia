import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
export const EtapaPreliminarConsultor = sequelize.define("EtapaPreliminarConsultor", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  etapa_preliminar_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "etapa_preliminar",
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
  tableName: "etapa_preliminar_consultor",
  timestamps: false,
   indexes: [
  {
    unique: true,
    fields: ["etapa_preliminar_id", "consultor_id"],
    name: "uniq_lev_cons"
  }]
});