import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Cliente = sequelize.define("Cliente", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: false ,
    maxlength: 100
  },
  precio_hora_desarrollo: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },

  precio_hora_soporte: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },

  precio_hora_cambio: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },

  porcentaje_gobierno: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: true
  },
  nota: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: "clientes",
  timestamps: true
});

