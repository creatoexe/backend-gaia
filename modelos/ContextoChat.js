import { DataTypes } from "sequelize";
import { sequelize }  from "../config/database.js";

export const ContextoChat = sequelize.define("ContextoChat", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  chat_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: { model: "chats", key: "id" },
  },

  resumen: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
    defaultValue: null,
  },

  mensajes_resumidos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

  tokens_acumulados: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  intencion_pendiente: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },

}, {
  tableName: "contextos_chat",
  timestamps: true,
});