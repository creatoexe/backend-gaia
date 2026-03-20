import {
  Proyecto,
  HerramientaRpa,
  Consultor,
  EtapaLevantamiento,
  EtapaEstimacion,
  EtapaPropuesta,
  EtapaPreliminar,
  EtapaAprobacion,
  EtapaEjecucion,
  Interaccion,
}                    from "../modelos/relations.js";

export const INCLUDE_PROCESO = [
  { model: Proyecto,        as: "proyecto",    attributes: ["id", "nombre"] },
  { model: HerramientaRpa,  as: "herramienta", attributes: ["id", "nombre"] },
  { model: EtapaLevantamiento, as: "levantamiento",
    include: [{ model: Consultor, as: "consultor", attributes: ["id", "nombre"] }] },
  { model: EtapaEstimacion,    as: "estimacion",
    include: [{ model: Consultor, as: "consultor", attributes: ["id", "nombre"] }] },
  { model: EtapaPropuesta,     as: "propuesta",
    include: [{ model: Consultor, as: "consultor", attributes: ["id", "nombre"] }] },
  { model: EtapaPreliminar,    as: "preliminar"    },
  { model: EtapaAprobacion,    as: "aprobacion"    },
  { model: EtapaEjecucion,     as: "ejecucion",
    include: [{ model: Consultor, as: "consultor", attributes: ["id", "nombre"] }] },
  { model: Interaccion,        as: "interacciones",
    include: [{ model: Consultor, as: "consultor", attributes: ["id", "nombre"] }],
    order:   [["fecha", "DESC"]] },
];

export const ESTATUS_VALIDOS = [
  "Lead", "Contactado", "Levantamiento", "Estimacion",
  "Propuesta", "En Aprobacion", "Aprobado", "Rechazado",
  "En Ejecución", "Cerrado", "Stand BY", "Facturada",
];

export const TIPOS_VALIDOS  = ["Automatización", "Consultoría", "Implementación", "Desarrollo", "Integración"];
export const TIPOS_INTERACCION = ["Llamada", "Email", "Reunión", "Demo", "WhatsApp"];
