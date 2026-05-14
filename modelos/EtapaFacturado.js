import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EtapaFacturado = sequelize.define("EtapaFacturado", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  proceso_id: {
    type: DataTypes.UUID, allowNull: false,
    references: { model: "procesos", key: "id" },
    onDelete: "CASCADE", onUpdate: "CASCADE"
  },
  numero_factura:    { type: DataTypes.STRING,  allowNull: true },
  fecha_factura:     { type: DataTypes.DATE,    allowNull: true },
  valor_facturado:   { type: DataTypes.DECIMAL, allowNull: true },
  fecha_vencimiento: { type: DataTypes.DATE,    allowNull: true },
  estado_cobro: {
    type: DataTypes.ENUM("Pendiente", "Pagado", "Vencido", "Anulado"),
    allowNull: true, defaultValue: "Pendiente"
  },
  observaciones:  { type: DataTypes.TEXT, allowNull: true },
  proximos_pasos: { type: DataTypes.TEXT, allowNull: true },
  estado_id: {
    type: DataTypes.UUID, allowNull: true,
    references: { model: "estados", key: "id" }
  },
}, { tableName: "etapa_facturado", timestamps: false });