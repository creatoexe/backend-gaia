import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const EtapaLevantamiento = sequelize.define("EtapaLevantamiento",{

   id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },

  oportunidad_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "oportunidad",
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },

  consultor_id:{
    type:DataTypes.UUID,
    allowNull:false
  },

  fecha_levantamiento:{
    type:DataTypes.DATE
  }

},{
  tableName:"etapa_levantamiento",
  timestamps:false
});

export default EtapaLevantamiento;