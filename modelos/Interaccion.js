import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Interaccion = sequelize.define("Interaccion",{

  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },

  proceso_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "procesos",
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },

  consultor_id:{
    type:DataTypes.UUID,
    allowNull:false,
    references:{
      model:"consultores",
      key:"id"
    },
    onDelete:"CASCADE",
    onUpdate:"CASCADE"
  },

  tipo:{
    type:DataTypes.STRING
  },

  descripcion:{
    type:DataTypes.TEXT,
    allowNull:true,
    maxlength:500
  },

  fecha:{
    type:DataTypes.DATE
  }

},{
  tableName:"interaccion",
  timestamps:false
});
