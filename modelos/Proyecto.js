import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const TARIFA_HORA = 10;

export const Proyecto = sequelize.define("Proyecto", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cliente_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "clientes", key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  horas_estimadas: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  costo_estimado: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: null,
  },
  estado_actual: {
    type: DataTypes.ENUM(
      "Lead",
      "Pendiente",
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
    ),
    allowNull: false,
    defaultValue: "Pendiente",
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  precio_hora_desarrollo: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },

  precio_hora_soporte: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },

  precio_hora_cambio: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },

  porcentaje_gobierno: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: true
  },
}, {
  tableName: "proyectos",
  timestamps: true,
 hooks: {
  beforeSave(proyecto) {
    const tarifa = proyecto.precio_hora_desarrollo != null
      ? parseFloat(proyecto.precio_hora_desarrollo)
      : TARIFA_HORA; 
    if (proyecto.horas_estimadas != null) {
      proyecto.costo_estimado = parseFloat((proyecto.horas_estimadas * tarifa).toFixed(2));
    } else {
      proyecto.costo_estimado = null;
    }
    proyecto.activo = proyecto.estado_actual === "Lead";
  },
},
});