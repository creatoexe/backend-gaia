import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaPropuesta = sequelize.define("EtapaPropuesta",{

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
  },
  observaciones:{
    type:DataTypes.TEXT,
    allowNull:true
  }
},{
  tableName:"etapa_propuesta",
  timestamps:false
});
