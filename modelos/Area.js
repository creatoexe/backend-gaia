import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Area = sequelize.define("areas", {

  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },

  nombre:{
    type:DataTypes.STRING,
    allowNull:false
  },

  descripcion:{
    type:DataTypes.TEXT,
    allowNull:true
  },

  activo:{
    type:DataTypes.BOOLEAN,
    defaultValue:true
}}, {
    tableName: "areas",
    timestamps: true
});