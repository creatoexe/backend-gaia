import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Interaccion = sequelize.define("Interaccion",{

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

  tipo:{
    type:DataTypes.STRING
  },

  descripcion:{
    type:DataTypes.TEXT
  },

  fecha:{
    type:DataTypes.DATE
  }

},{
  tableName:"interaccion",
  timestamps:false
});

export default Interaccion;