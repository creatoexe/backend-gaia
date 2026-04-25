import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const InteraccionLevantamientoConsultor = sequelize.define("InteraccionLevantamientoConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  interaccion_levantamiento_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "interaccion_levantamiento", key: "id" },
    onDelete: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE"
  },
}, {
  tableName: "interaccion_levantamiento_consultor", timestamps: false,
  indexes: [{ unique: true, name: "uniq_ilc_inter_cons", fields: ["interaccion_levantamiento_id", "consultor_id"] }]
});