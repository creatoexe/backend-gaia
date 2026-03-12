import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const EtapaPropuesta = sequelize.define("EtapaPropuesta",{

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

  nivel_detalle:{
    type:DataTypes.STRING
  },

  fecha_entrega_propuesta:{
    type:DataTypes.DATE
  },

  valor_presupuestado:{
    type:DataTypes.DECIMAL
  },

  horas_presupuestadas:{
    type:DataTypes.INTEGER
  }

},{
  tableName:"etapa_propuesta",
  timestamps:false
});

export default EtapaPropuesta;