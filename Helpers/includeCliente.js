import { Proyecto,UsuarioCliente } from "../modelos/relations.js";

export const INCLUDE_CLIENTE = [
  {
    model:      Proyecto,
    as:         "proyectos",
    attributes: ["id", "nombre", "activo", "createdAt"],
  },
  {
    model:      UsuarioCliente,
    as:         "usuarios",
    attributes: ["id", "nombre", "email", "telefono", "cargo", "activo"],
  },
];