import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Consultor = sequelize.define(
  "Consultor",
  {
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

    especialidad: {
      type: DataTypes.STRING
    },

    telefono: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: "consultores",
    timestamps: true
  }
);

export default Consultor;