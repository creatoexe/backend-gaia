import { Consultor } from "../modelos/relations.js";

export const ESTADOS_TERMINALES = ["Cerrado", "Cancelado"];

export const ESTADOS_BLOQUEADOS_DESTINO = ["Pendiente"];

export const INCLUDE_ESTADO = [
  { model: Consultor, as: "consultor", attributes: ["id", "nombre", "rol"] },
];
