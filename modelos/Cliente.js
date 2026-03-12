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

  tipo_cliente: {
    type: DataTypes.ENUM("Nuevo" , "Actual"),
    defaultValue: "Nuevo"
  },

}, {
  tableName: "clientes",
  timestamps: true
});

export default Cliente;