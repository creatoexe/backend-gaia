import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const UsuarioCliente = sequelize.define("usuario_cliente", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true,
        maxlength: 20
    },
    linkedin: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cargo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: "usuario_cliente",
    timestamps: true
});