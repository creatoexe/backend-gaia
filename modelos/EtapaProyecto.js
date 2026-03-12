import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const EtapaProyecto = sequelize.define("EtapaProyecto",{

   id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },

  oportunidad_id:{
    type:DataTypes.UUID,
    allowNull:false
  },

  consultor_responsable_id:{
    type:DataTypes.UUID,
    allowNull:false
  },

  fecha_inicio_proyecto:{
    type:DataTypes.DATE
  },

  fecha_cierre_facturacion:{
    type:DataTypes.DATE
  },

  horas_reales:{
    type:DataTypes.INTEGER
  }

},{
  tableName:"etapa_proyecto",
  timestamps:false
});

export default EtapaProyecto;