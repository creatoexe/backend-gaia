import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const EtapaEstimacion = sequelize.define("EtapaEstimacion",{

  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },

  oportunidad_id:{
    type:DataTypes.UUID,
    allowNull:false
  },

  consultor_id:{
    type:DataTypes.UUID,
    allowNull:false
  },

  fecha_estimacion:DataTypes.DATE

},{
  tableName:"etapa_estimacion",
  timestamps:true
});

export default EtapaEstimacion;