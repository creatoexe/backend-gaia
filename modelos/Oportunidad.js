import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Oportunidad = sequelize.define("Oportunidad", {

  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },

  cliente_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "clientes",
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },

  nombre_proceso:{
    type:DataTypes.STRING
  },

  tipo_proceso:{
    type:DataTypes.ENUM(
      "Automatización",
      "Consultoría",
      "Implementación",
      "Desarrollo",
      "Integración"
    )
  },
  estatus:{
    type:DataTypes.ENUM(
      "Lead",
      "Contactado",
      "Levantamiento",
      "Estimacion",
      "Propuesta",
      "En Aprobacion",
      "Aprobado",
      "cerrado",
      "Stand BY",
      "Facturada"
    )
  },

  probabilidad_aprobacion:{
    type:DataTypes.STRING
  },

  prioridad:{
    type:DataTypes.ENUM(
      "Bajo",
      "Medio",
      "Muy Alto",
      "Alto"
    )
  },

  plazo_inicio:{
    type:DataTypes.DATE
  },

  fecha_lead:{
    type:DataTypes.DATE
  },

  fecha_contactado:{
    type:DataTypes.DATE
  },

  accion_responsable:{
    type:DataTypes.STRING
  }

},{
  tableName:"oportunidad",
  timestamps:true
});

export default Oportunidad;