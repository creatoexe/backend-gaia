import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const HerramientaRpa = sequelize.define("herramientas_rpa", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fabricante: {
        type: DataTypes.STRING,
        allowNull: true
    },
    version: {
        type: DataTypes.STRING,
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: "herramientas_rpa",
    timestamps: true
});