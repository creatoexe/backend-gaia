import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const AsignacionHerramientas = sequelize.define("asignacion_herramienta", {
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
    herramienta_rpa_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "herramientas_rpa",
            key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    cod_licencia: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fecha_asignacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_expiracion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM("Activa", 
            "Suspendida","Expirada", "Revocada"),
        defaultValue: "Activa"
    },
    motivo_cambio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    asignado_por: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model:"consultores",
            key:"id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    }
}, {
    tableName: "asignacion_herramienta",
    timestamps: true
});