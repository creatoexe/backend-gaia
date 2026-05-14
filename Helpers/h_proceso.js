import {
  Proyecto, Cliente, HerramientaRpa, Consultor,
  EtapaLevantamiento, InteraccionLevantamiento,
  EtapaEstimacion,   InteraccionEstimacion,
  EtapaPropuesta,
  EtapaPreliminar,
  EtapaAprobacion,   InteraccionAprobacion,
  EtapaAprobado,     InteraccionAprobado,
  EtapaEjecucion,    InteraccionEjecucion,
  EtapaCierre,       InteraccionCierre,
  EtapaFacturado,    InteraccionFacturado,
  Interaccion, Estados,
  EtapaRechazado,
  InteraccionRechazado,
  EtapaStandBy,
  InteraccionStandBy,
} from "../modelos/relations.js";

export const TIPOS_INTERACCION = ["Llamada", "Correo", "Reunión", "Visita", "Otro"];

const cons = {
  model: Consultor, as: "consultores",
  attributes: ["id", "nombre"], through: { attributes: [] },
};

const ints = (Model) => ({
  model: Model, as: "interacciones",
  separate: true,
  attributes: ["id", "fecha", "observaciones", "proximos_pasos", "estado_id"],
  include: [
    { model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } },
    { model: Estados, as: "estadoObj", attributes: ["id", "nombre"] },
  ],
});

export const INCLUDE_PROCESO_LIST = [
  {
    model: Proyecto, as: "proyecto", attributes: ["id", "nombre"],
    include: [{ model: Cliente, as: "cliente", attributes: ["id", "empresa"] }],
  },
  { model: HerramientaRpa, as: "herramientas", attributes: ["id", "nombre"], through: { attributes: [] } },
  { model: Estados, as: "estadoObj", attributes: ["id", "nombre"] },
  { model: EtapaPropuesta, as: "propuesta",
    attributes: ["id", "valor_presupuestado", "horas_presupuestadas"] },
    { model: EtapaRechazado, as: "rechazado",
  attributes: ["id", "fecha_rechazo", "motivo_categoria", "recuperable", "estado_id"] },
  { model: EtapaStandBy, as: "stand_by",
  attributes: ["id", "fecha_inicio_pausa", "fecha_estimada_retorno", "motivo_categoria", "estado_id"] },
];

export const INCLUDE_PROCESO = [
  {
    model: Proyecto, as: "proyecto", attributes: ["id", "nombre"],
    include: [{ model: Cliente, as: "cliente", attributes: ["id", "empresa"] }],
  },
  {
    model: HerramientaRpa, as: "herramientas",
    attributes: ["id", "nombre", "fabricante"], through: { attributes: [] },
  },
  { model: Estados, as: "estadoObj", attributes: ["id", "nombre"] },

  { model: EtapaLevantamiento, as: "levantamiento",
    attributes: ["id", "fecha_levantamiento", "observaciones", "proximos_pasos", "estado_id"],
    include: [ cons, ints(InteraccionLevantamiento) ] },

  { model: EtapaEstimacion, as: "estimacion",
    attributes: ["id", "fecha_estimacion", "observaciones", "proximos_pasos", "estado_id"],
    include: [ cons, ints(InteraccionEstimacion) ] },

  { model: EtapaPropuesta, as: "propuesta",
    attributes: ["id", "nivel_detalle", "fecha_entrega_propuesta", "valor_presupuestado",
                 "horas_presupuestadas", "observaciones", "estado_id"],
    include: [ cons ] },

  { model: EtapaPreliminar, as: "preliminar",
    attributes: ["id", "fecha_preliminar", "resultado", "viable", "observaciones"],
    include: [ cons ] },

  { model: EtapaAprobacion, as: "aprobacion",
    attributes: ["id", "aprobado", "fecha_aprobacion", "motivo_rechazo", "observaciones", "estado_id"],
    include: [ cons, ints(InteraccionAprobacion) ] },

  { model: EtapaAprobado, as: "aprobado",
    attributes: ["id", "fecha_aprobado", "observaciones", "proximos_pasos", "estado_id"],
    include: [ cons, ints(InteraccionAprobado) ] },

  { model: EtapaEjecucion, as: "ejecucion",
    attributes: ["id", "fecha_inicio", "fecha_fin", "horas_reales", "observaciones", "proximos_pasos", "estado_id"],
    include: [ cons, ints(InteraccionEjecucion) ] },

  { model: EtapaCierre, as: "cierre",
    attributes: ["id", "fecha_cierre", "observaciones", "proximos_pasos", "estado_id"],
    include: [ cons, ints(InteraccionCierre) ] },

  { model: EtapaFacturado, as: "facturado",
    attributes: ["id", "numero_factura", "fecha_factura", "valor_facturado",
                 "fecha_vencimiento", "estado_cobro", "observaciones", "proximos_pasos", "estado_id"],
    include: [ cons, ints(InteraccionFacturado) ] },

  { model: Interaccion, as: "interacciones",
    separate: true,
    include: [{ model: Consultor, as: "consultor", attributes: ["id", "nombre"] }] },
    { model: EtapaRechazado, as: "rechazado",
  include: [ cons, ints(InteraccionRechazado) ] },
  { model: EtapaStandBy, as: "stand_by",
  include: [ cons, ints(InteraccionStandBy) ] },
];