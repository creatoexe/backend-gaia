import {
  Cliente,
  Area,
  UsuarioCliente,
  ProyectoUsuarioRol,
  AsignacionHerramientas,
  HerramientaRpa,
  Consultor,
  EstadoProyecto,
}                    from "../modelos/relations.js";


export const INCLUDE_PROYECTO = [
  { model: Cliente, as: "cliente", attributes: ["id", "nombre", "empresa","precio_hora_desarrollo" , "precio_hora_soporte" , "precio_hora_cambio" , "porcentaje_gobierno"] },
  { model: Area,    as: "areas",   attributes: ["id", "nombre"], through: { attributes: [] } },
  {
    model:   UsuarioCliente,
    as:      "miembros",
    attributes: ["id", "nombre", "email", "cargo"],
    through: { model: ProyectoUsuarioRol, attributes: ["rol_id", "activo", "nota"] },
  },
  {
    model:   AsignacionHerramientas,
    as:      "herramientas",
    include: [{ model: HerramientaRpa, as: "herramienta", attributes: ["id", "nombre", "fabricante"] }],
  },
  {
    model:   EstadoProyecto,
    as:      "historial_estados",
    include: [{ model: Consultor, as: "consultor", attributes: ["id", "nombre"] }],
    order:   [["fecha", "ASC"]],
  },
];
