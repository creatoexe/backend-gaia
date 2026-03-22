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

  email: {
    type: DataTypes.STRING,
    allowNull: true
  },

  telefono: {
    type: DataTypes.STRING,
    allowNull: true ,
    maxlength: 20
  },

  empresa: {
    type: DataTypes.STRING,
    allowNull: false ,
    maxlength: 100
  },
   //  NUEVOS CAMPOS

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

  descuento_gobierno: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: true
  },

  nota_gobierno: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: "clientes",
  timestamps: true
});

