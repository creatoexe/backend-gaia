import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaLevantamiento = sequelize.define("EtapaLevantamiento",{

   id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },

  proceso_id : {
    type:DataTypes.UUID,
    allowNull:false,
    references:{
      model:"procesos",
      key:"id"
    },
    onDelete:"CASCADE",
    onUpdate:"CASCADE"
  },

  fecha_levantamiento:{
    type:DataTypes.DATE
  },
  observaciones:{
    type:DataTypes.TEXT,
    allowNull:true
  }
},{
  tableName:"etapa_levantamiento",
  timestamps:false
});
