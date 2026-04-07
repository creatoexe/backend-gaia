import { Estados } from "../modelos/relations.js";

export const getEstadoId = async (nombre) => {
  const estado = await Estados.findOne({ where: { nombre } });
  if (!estado) throw new Error(`Estado '${nombre}' no encontrado en la tabla estados.`);
  return estado.id;
};

export const resolverEstadoId = async (nombreOId) => {
  if (!nombreOId) return null;
  if (/^[0-9a-f-]{36}$/i.test(nombreOId)) return nombreOId;
  return getEstadoId(nombreOId);
};