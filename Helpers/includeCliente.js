import { Proyecto,UsuarioCliente,Estados, Pais, Ciudad, Rubro } from "../modelos/relations.js";

export const INCLUDE_CLIENTE = [
  {
    model:      Proyecto,
    as:         "proyectos",
    attributes: ["id", "nombre", "activo", "createdAt"],
  },
  { model: Estados, as: "estadoObj", attributes: ["id", "nombre"] },
  {
    model:      UsuarioCliente,
    as:         "usuarios",
    attributes: ["id", "nombre", "email", "telefono", "cargo", "activo"],
  },
  { model: Pais, as: "pais", attributes: ["id", "nombre", "codigo_iso"] },
  { model: Ciudad, as: "ciudad", attributes: ["id", "nombre"] },
  { model: Rubro, as: "rubro", attributes: ["id", "nombre"] },
];