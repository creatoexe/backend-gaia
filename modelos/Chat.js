import { DataTypes } from "sequelize";
import { sequelize }  from "../config/database.js";

export const Chat = sequelize.define("Chat", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  consultor_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "consultores", key: "id" }
  },

  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: "Nueva conversación"
  },

  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }

}, {
  tableName: "chats",
  timestamps: true
});
