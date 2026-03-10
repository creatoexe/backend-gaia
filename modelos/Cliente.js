const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cliente = sequelize.define("Cliente", {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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

module.exports = Cliente;