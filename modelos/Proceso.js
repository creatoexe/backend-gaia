import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Proceso = sequelize.define("Proceso", {

  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true
  },

  proyecto_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "proyectos",
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },

  nombre_proceso:{
    type:DataTypes.STRING,
    allowNull: false
  },

  tipo:{
    type:DataTypes.ENUM("Proyecto Nuevo", "Solicitud de Cambio"),
    allowNull: true
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
      "Rechazado",
      "En Ejecución",
      "Cerrado",
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
  },

  herramienta_rpa_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "herramientas_rpa",
      key: "id"
    },
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
  }

},{
  tableName:"procesos",
  timestamps:true
});