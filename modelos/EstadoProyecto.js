import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EstadoProyecto = sequelize.define("EstadoProyecto", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  proyecto_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "proyectos", key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  estado: {
    type: DataTypes.ENUM(
      "Pendiente",
      "En Análisis",
      "En Revisión",
      "Aprobado",
      "Activo",
      "Pausado",
      "Cerrado",
      "Cancelado"
    ),
    allowNull: false,
  },
  observacion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  consultor_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: "consultores", key: "id" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "estado_proyecto",
  timestamps: true,
});