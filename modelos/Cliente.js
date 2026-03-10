import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Cliente = sequelize.define("Cliente", {

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
    allowNull: false
  },

  telefono: {
    type: DataTypes.STRING
  },

  empresa: {
    type: DataTypes.STRING
  }

}, {
  tableName: "clientes",
  timestamps: true
});

export default Cliente;