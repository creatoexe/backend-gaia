import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const EtapaAprobacion = sequelize.define("EtapaAprobacion",{

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

  aprobado:{
    type:DataTypes.BOOLEAN
  },

  fecha_aprobacion:{
    type:DataTypes.DATE
  },

  motivo_rechazo:{
    type:DataTypes.STRING
  },

  fecha_rechazo:{
    type:DataTypes.DATE
  }

},{
  tableName:"etapa_aprobacion",
  timestamps:false
});

export default EtapaAprobacion;