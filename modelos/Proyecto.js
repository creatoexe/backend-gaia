import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const TARIFA_HORA = 10;

export const Proyecto = sequelize.define("Proyecto", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cliente_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "clientes", key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  horas_estimadas: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  costo_estimado: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: null,
  },
  estado_actual: {
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
    defaultValue: "Pendiente",
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "proyectos",
  timestamps: true,
  hooks: {
    beforeSave(proyecto) {
      if (proyecto.horas_estimadas != null) {
        proyecto.costo_estimado = parseFloat((proyecto.horas_estimadas * TARIFA_HORA).toFixed(2));
      } else {
        proyecto.costo_estimado = null;
      }
      proyecto.activo = proyecto.estado_actual === "Activo";
    },
  },
});