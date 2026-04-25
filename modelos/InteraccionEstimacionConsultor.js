import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const InteraccionEstimacionConsultor = sequelize.define("InteraccionEstimacionConsultor", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  interaccion_estimacion_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "interaccion_estimacion", key: "id" },
    onDelete: "CASCADE"
  },
  consultor_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "consultores", key: "id" },
    onDelete: "CASCADE"
  },
}, {
  tableName: "interaccion_estimacion_consultor", timestamps: false,
  indexes: [{ unique: true, name: "uniq_iec_inter_cons", fields: ["interaccion_estimacion_id", "consultor_id"] }]
});