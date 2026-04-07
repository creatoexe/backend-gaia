import { DataTypes } from "sequelize";
import { sequelize }  from "../config/database.js";

export const Mensaje = sequelize.define("Mensaje", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  chat_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "chats", key: "id" }
  },

  rol: {
    type: DataTypes.ENUM("user", "assistant", "system"),
    allowNull: false
  },

  contenido: {
    type: DataTypes.TEXT("long"),
    allowNull: false
  },

  indice_orden: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  tokens: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  }

}, {
  tableName: "mensajes",
  timestamps: true,
  indexes: [
    { fields: ["chat_id", "indice_orden"] }
  ]
});
