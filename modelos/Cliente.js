import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Cliente = sequelize.define("Cliente", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  empresa: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },

  pais_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: "paises",   key: "id" },
  },
  ciudad_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: "ciudades", key: "id" },
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },

  rubro_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: "rubros",   key: "id" },
  },
 estado_id: {
  type: DataTypes.UUID,
  allowNull: true,
  references: { model: "estados", key: "id" },
},
  referido_por: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: "Nombre de la persona o entidad que lo refirió",
  },

  precio_hora_desarrollo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.0,
  },
  precio_hora_soporte: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.0,
  },
  precio_hora_cambio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.0,
  },
  porcentaje_gobierno: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0.0,
  },

  nota: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName:  "clientes",
  timestamps: true,
});