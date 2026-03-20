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
}, {
  tableName: "clientes",
  timestamps: true
});

