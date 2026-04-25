import {
  Proyecto,
  Cliente,
  HerramientaRpa,
  Consultor,
  EtapaLevantamiento,
  EtapaEstimacion,
  EtapaPropuesta,
  EtapaPreliminar,
  EtapaAprobacion,
  EtapaEjecucion,
  Interaccion,
  Estados,
  InteraccionEstimacion,
  InteraccionLevantamiento,
} from "../modelos/relations.js";

export const TIPOS_INTERACCION = ["Llamada", "Correo", "Reunión", "Visita", "Otro"];

export const INCLUDE_PROCESO = [
  {
    model: Proyecto,
    as: "proyecto",
    attributes: ["id", "nombre"],
    include: [
      {
        model: Cliente,
        as: "cliente",
        attributes: ["id", "empresa"],
      },
    ],
  },
  {
    model: HerramientaRpa,
    as: "herramientas",
    attributes: ["id", "nombre", "fabricante"],
    through: { attributes: [] },
  },
  {
    model: Estados,
    as: "estadoObj",
    attributes: ["id", "nombre"],
  },
  {
  model: EtapaLevantamiento, as: "levantamiento",
  include: [
    { model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } },
    { model: Estados,   as: "estadoObj",   attributes: ["id", "nombre"] },
    {
      model: InteraccionLevantamiento, as: "interacciones",
      include: [
        { model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } },
        { model: Estados,   as: "estadoObj",   attributes: ["id", "nombre"] },
      ]
    },
  ],
},
{
  model: EtapaEstimacion, as: "estimacion",
  include: [
    { model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } },
    { model: Estados,   as: "estadoObj",   attributes: ["id", "nombre"] },
    {
      model: InteraccionEstimacion, as: "interacciones",
      include: [
        { model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } },
        { model: Estados,   as: "estadoObj",   attributes: ["id", "nombre"] },
      ]
    },
  ],
},
  {
    model: EtapaPropuesta,
    as: "propuesta",
    include: [{ model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } }],
  },
  {
    model: EtapaPreliminar,
    as: "preliminar",
    include: [{ model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } }],
  },
  {
    model: EtapaAprobacion,
    as: "aprobacion",
    include: [{ model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } }],
  },
  {
    model: EtapaEjecucion,
    as: "ejecucion",
    include: [{ model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } }],
  },
  {
    model: Interaccion,
    as: "interacciones",
    include: [{ model: Consultor, as: "consultor", attributes: ["id", "nombre"] }],
  },
];