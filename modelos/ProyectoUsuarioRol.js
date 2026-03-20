import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const ProyectoUsuarioRol = sequelize.define("proyecto_usuario_rol", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
    usuario_cliente_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "usuario_cliente",
            key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    rol_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "roles",
            key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    fecha_asignacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    nota: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: "proyecto_usuario_rol",
    timestamps: true
});