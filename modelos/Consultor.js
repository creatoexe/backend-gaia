import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Consultor = sequelize.define(
  "Consultor",
  {
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

    rol: {
      type: DataTypes.ENUM("consultor", "admin"),
      allowNull: false
    },

    telefono: {
      type: DataTypes.STRING,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: "consultores",
    timestamps: true
  }
);

export default Consultor;