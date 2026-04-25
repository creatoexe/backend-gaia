import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

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
  estado_id: {
  type: DataTypes.UUID,
  allowNull: true,
  references: { model: "estados", key: "id" },
},
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  precio_hora_desarrollo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  precio_hora_soporte: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  precio_hora_cambio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  porcentaje_gobierno: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
}, {
  tableName: "proyectos",
  timestamps: true,
});