import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Proceso = sequelize.define("Proceso", {
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
  nombre_proceso: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM("Proyecto Nuevo", "Solicitud de Cambio"),
    allowNull: true,
  },
  estado_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: "estados", key: "id" },
  },
  prioridad: {
    type: DataTypes.ENUM("Bajo", "Medio", "Alto", "Muy Alto"),
    allowNull: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "procesos",
  timestamps: true,
});