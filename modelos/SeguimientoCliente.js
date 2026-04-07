import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const SeguimientoCliente = sequelize.define("SeguimientoCliente", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cliente_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  consultor_id: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: "Consultor interno que realizó el seguimiento",
  },
  usuario_cliente_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: "Contacto del cliente con quien se interactuó",
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fecha_proxima_accion: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  medio: {
    type: DataTypes.ENUM(
      "email",
      "telefono",
      "videollamada",
      "presencial",
      "whatsapp",
      "linkedin",
      "otro"
    ),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM(
      "llamada",
      "reunion",
      "negociacion",
      "contacto",
      "demo",
      "propuesta",
      "seguimiento",
      "otro"
    ),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: "Resumen detallado de la interacción",
  },
  resultado: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Resultado o conclusión del contacto",
  },
  estado: {
    type: DataTypes.ENUM("programado", "completado", "cancelado"),
    allowNull: false,
    defaultValue: "programado",
  },
  contexto_seguimiento: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: "seguimientos_clientes",
  timestamps: true,
});
