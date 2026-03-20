import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const ProyectoArea = sequelize.define("ProyectoArea", {

  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },

  proyecto_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "proyectos",
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },
  
  area_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "areas",
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  }
}, {
    tableName: "proyecto_area",
    timestamps: true
}); 