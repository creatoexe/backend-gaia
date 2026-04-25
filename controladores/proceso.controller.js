import { INCLUDE_PROCESO, TIPOS_INTERACCION } from "../Helpers/h_proceso.js";
import {
  Proceso,
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
  InteraccionEstimacion,
  InteraccionLevantamiento,
  Estados,
} from "../modelos/relations.js";
import { getEstadoId, resolverEstadoId } from "../Helpers/h_estados.js";

const TIPOS_CLASIFICACION = ["Proyecto Nuevo", "Solicitud de Cambio"];

export const listarProcesos = async (req, res) => {
  try {
    const { proyectoId, estatus, tipo, page = 1, limit = 20 } = req.query;
    const proyectoIdParam = req.params.proyectoId || proyectoId;

    const where = {};
    if (proyectoIdParam) where.proyecto_id = proyectoIdParam;
    if (estatus)         where.estatus      = estatus;
    if (tipo)            where.tipo         = tipo;

    const offset = (Math.max(1, +page) - 1) * +limit;

    const { count, rows } = await Proceso.findAndCountAll({
      where,
      include:  INCLUDE_PROCESO,
      order:    [["createdAt", "DESC"]],
      limit:    +limit,
      offset,
      distinct: true,
    });

    return res.status(200).json({
      ok: true, total: count, page: +page, pages: Math.ceil(count / +limit), data: rows,
    });
  } catch (err) {
    console.error("[listarProcesos]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al listar procesos.", detalle: err.message });
  }
};

export const obtenerProceso = async (req, res) => {
  try {
    const proceso = await Proceso.findByPk(req.params.id, { include: INCLUDE_PROCESO });
    if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

    return res.status(200).json({ ok: true, data: proceso });
  } catch (err) {
    console.error("[obtenerProceso]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener proceso.", detalle: err.message });
  }
};

export const crearProceso = async (req, res) => {
  try {
    const { proyectoId } = req.params;
    const {
      nombre_proceso,
      tipo,
      estatus = "Creación",
      prioridad,
      herramientas_ids = [],
    } = req.body;

    if (!nombre_proceso?.trim())
      return res.status(400).json({ ok: false, mensaje: "'nombre_proceso' es obligatorio." });
    if (tipo && !TIPOS_CLASIFICACION.includes(tipo))
      return res.status(400).json({ ok: false, mensaje: `'tipo' inválido. Válidos: ${TIPOS_CLASIFICACION.join(", ")}.` });

    const proyecto = await Proyecto.findByPk(proyectoId);
    if (!proyecto) return res.status(404).json({ ok: false, mensaje: "Proyecto no encontrado." });

    if (herramientas_ids.length > 0) {
      const encontradas = await HerramientaRpa.findAll({ where: { id: herramientas_ids } });
      if (encontradas.length !== herramientas_ids.length)
        return res.status(404).json({ ok: false, mensaje: "Una o más herramientas no encontradas." });
    }

    const proceso = await Proceso.create({
      proyecto_id:    proyectoId,
      nombre_proceso: nombre_proceso.trim(),
      tipo:           tipo || null,
      estado_id:      await resolverEstadoId(estatus),
      prioridad:      prioridad || null,
      fecha_creacion: new Date(),
    });

    if (herramientas_ids.length > 0) {
      await proceso.setHerramientas(herramientas_ids);
    }

    const resultado = await Proceso.findByPk(proceso.id, { include: INCLUDE_PROCESO });
    return res.status(201).json({ ok: true, mensaje: "Proceso creado.", data: resultado });
  } catch (err) {
    console.error("[crearProceso]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al crear proceso.", detalle: err.message });
  }
};

export const actualizarProceso = async (req, res) => {
  try {
    const proceso = await Proceso.findByPk(req.params.id);
    if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

    const { nombre_proceso, tipo, prioridad, herramientas_ids } = req.body;

    if (tipo && !TIPOS_CLASIFICACION.includes(tipo))
      return res.status(400).json({ ok: false, mensaje: `'tipo' inválido.` });

    await proceso.update({ nombre_proceso, tipo, prioridad });

    if (Array.isArray(herramientas_ids)) {
      if (herramientas_ids.length > 0) {
        const encontradas = await HerramientaRpa.findAll({ where: { id: herramientas_ids } });
        if (encontradas.length !== herramientas_ids.length)
          return res.status(404).json({ ok: false, mensaje: "Una o más herramientas no encontradas." });
      }
      await proceso.setHerramientas(herramientas_ids);
    }

    const resultado = await Proceso.findByPk(proceso.id, { include: INCLUDE_PROCESO });
    return res.status(200).json({ ok: true, mensaje: "Proceso actualizado.", data: resultado });
  } catch (err) {
    console.error("[actualizarProceso]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar proceso.", detalle: err.message });
  }
};

export const cambiarEstatus = async (req, res) => {
  try {
    const proceso = await Proceso.findByPk(req.params.id);
    if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

    const { estatus } = req.body;
    if (!estatus) return res.status(400).json({ ok: false, mensaje: "'estatus' es requerido." });

    const estado_id = await resolverEstadoId(estatus).catch(() => null);
    if (!estado_id) return res.status(400).json({ ok: false, mensaje: `Estatus '${estatus}' no encontrado.` });

    await proceso.update({ estado_id });
    return res.status(200).json({ ok: true, mensaje: `Estatus actualizado a '${estatus}'.`, data: proceso });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const eliminarProceso = async (req, res) => {
  try {
    const proceso = await Proceso.findByPk(req.params.id);
    if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

    await proceso.destroy();
    return res.status(200).json({ ok: true, mensaje: "Proceso eliminado." });
  } catch (err) {
    console.error("[eliminarProceso]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar proceso.", detalle: err.message });
  }
};

const validarConsultores = async (ids) => {
  if (!ids || !Array.isArray(ids) || ids.length === 0)
    return { ok: false, mensaje: "'consultores_ids' debe ser un array no vacío." };

  const encontrados = await Consultor.findAll({ where: { id: ids } });
  if (encontrados.length !== ids.length) {
    const faltantes = ids.filter(id => !encontrados.map(c => c.id).includes(id));
    return { ok: false, mensaje: `Consultores no encontrados: ${faltantes.join(", ")}.` };
  }
  return { ok: true };
};

const upsertEtapa = async ({ Modelo, procesoId, datos, consultores_ids, aliasSet, res, nombreEtapa }) => {
  try {
    const proceso = await Proceso.findByPk(procesoId);
    if (!proceso)
      return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

    if (consultores_ids !== undefined) {
      const validacion = await validarConsultores(consultores_ids);
      if (!validacion.ok)
        return res.status(400).json({ ok: false, mensaje: validacion.mensaje });
    }

    const [etapa, creada] = await Modelo.findOrCreate({
      where:    { proceso_id: procesoId },
      defaults: { proceso_id: procesoId, ...datos },
    });

    if (!creada) await etapa.update(datos);

    if (consultores_ids !== undefined) {
      await etapa[aliasSet](consultores_ids);
    }

    await etapa.reload({
      include: [{ model: Consultor, as: "consultores", attributes: ["id", "nombre"] }],
    });

    return res.status(creada ? 201 : 200).json({
      ok: true,
      mensaje: `${nombreEtapa} ${creada ? "registrada" : "actualizada"}.`,
      data: etapa,
    });
  } catch (err) {
    console.error(`[upsert${nombreEtapa}]`, err);
    return res.status(500).json({ ok: false, mensaje: `Error en ${nombreEtapa}.`, detalle: err.message });
  }
};

export const upsertLevantamiento = (req, res) => {
  const { consultores_ids, fecha_levantamiento, observaciones, proximos_pasos, estado_id } = req.body;
  return upsertEtapa({
    Modelo: EtapaLevantamiento, procesoId: req.params.id,
    datos: { fecha_levantamiento, observaciones, proximos_pasos, estado_id: estado_id || null },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "Levantamiento",
  });
};

export const upsertEstimacion = (req, res) => {
  const { consultores_ids, fecha_estimacion, observaciones, proximos_pasos, estado_id } = req.body;
  return upsertEtapa({
    Modelo: EtapaEstimacion, procesoId: req.params.id,
    datos: { fecha_estimacion, observaciones, proximos_pasos, estado_id: estado_id || null },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "Estimación",
  });
};

export const upsertPropuesta = (req, res) => {
  const { consultores_ids, nivel_detalle, fecha_entrega_propuesta, valor_presupuestado, horas_presupuestadas, observaciones } = req.body;
  return upsertEtapa({
    Modelo: EtapaPropuesta, procesoId: req.params.id,
    datos: { nivel_detalle, fecha_entrega_propuesta, valor_presupuestado, horas_presupuestadas, observaciones },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "Propuesta",
  });
};

export const upsertPreliminar = (req, res) => {
  const { consultores_ids, fecha_preliminar, resultado, observaciones, viable } = req.body;
  return upsertEtapa({
    Modelo: EtapaPreliminar, procesoId: req.params.id,
    datos: { fecha_preliminar, resultado, observaciones, viable },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "Preliminar",
  });
};

export const upsertAprobacion = async (req, res) => {
  const { consultores_ids, aprobado, fecha_aprobacion, motivo_rechazo, fecha_rechazo, observaciones } = req.body;

  if (typeof aprobado !== "boolean")
    return res.status(400).json({ ok: false, mensaje: "'aprobado' debe ser boolean." });
  if (!aprobado && !motivo_rechazo)
    return res.status(400).json({ ok: false, mensaje: "'motivo_rechazo' es obligatorio cuando se rechaza." });

  const proceso = await Proceso.findByPk(req.params.id);
  if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

  await proceso.update({ estado_id: await getEstadoId(aprobado ? "Aprobado" : "Rechazado") });

  return upsertEtapa({
    Modelo: EtapaAprobacion, procesoId: req.params.id,
    datos: { aprobado, fecha_aprobacion, motivo_rechazo, fecha_rechazo, observaciones },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "Aprobación",
  });
};

export const upsertEjecucion = async (req, res) => {
  const { consultores_ids, consultor_responsable_id, fecha_inicio, fecha_fin, horas_reales, observaciones } = req.body;

  if (!fecha_inicio)
    return res.status(400).json({ ok: false, mensaje: "'fecha_inicio' es obligatorio." });

  const proceso = await Proceso.findByPk(req.params.id);
  if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

  const etapaExistente = await EtapaEjecucion.findOne({ where: { proceso_id: req.params.id } });
  if (!etapaExistente)
    await proceso.update({ estado_id: await getEstadoId("En Ejecución") });

  return upsertEtapa({
    Modelo: EtapaEjecucion, procesoId: req.params.id,
    datos: { consultor_responsable_id, fecha_inicio, fecha_fin, horas_reales, observaciones },
    consultores_ids, aliasSet: "setConsultores", res, nombreEtapa: "Ejecución",
  });
};

export const listarInteracciones = async (req, res) => {
  try {
    const proceso = await Proceso.findByPk(req.params.id);
    if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

    const interacciones = await Interaccion.findAll({
      where:   { proceso_id: req.params.id },
      include: [{ model: Consultor, as: "consultor", attributes: ["id", "nombre"] }],
      order:   [["fecha", "DESC"]],
    });

    return res.status(200).json({ ok: true, data: interacciones });
  } catch (err) {
    console.error("[listarInteracciones]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener interacciones.", detalle: err.message });
  }
};

export const crearInteraccion = async (req, res) => {
  try {
    const proceso = await Proceso.findByPk(req.params.id);
    if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

    const { consultor_id, tipo, descripcion, fecha } = req.body;

    if (!consultor_id) return res.status(400).json({ ok: false, mensaje: "'consultor_id' es obligatorio." });
    if (!fecha)        return res.status(400).json({ ok: false, mensaje: "'fecha' es obligatoria." });
    if (tipo && !TIPOS_INTERACCION.includes(tipo))
      return res.status(400).json({ ok: false, mensaje: `'tipo' inválido. Válidos: ${TIPOS_INTERACCION.join(", ")}.` });

    const consultor = await Consultor.findByPk(consultor_id);
    if (!consultor) return res.status(404).json({ ok: false, mensaje: "Consultor no encontrado." });

    const interaccion = await Interaccion.create({ proceso_id: req.params.id, consultor_id, tipo, descripcion, fecha });

    return res.status(201).json({ ok: true, mensaje: "Interacción registrada.", data: interaccion });
  } catch (err) {
    console.error("[crearInteraccion]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al crear interacción.", detalle: err.message });
  }
};

export const eliminarInteraccion = async (req, res) => {
  try {
    const interaccion = await Interaccion.findOne({
      where: { id: req.params.interaccionId, proceso_id: req.params.id },
    });
    if (!interaccion) return res.status(404).json({ ok: false, mensaje: "Interacción no encontrada." });

    await interaccion.destroy();
    return res.status(200).json({ ok: true, mensaje: "Interacción eliminada." });
  } catch (err) {
    console.error("[eliminarInteraccion]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar interacción.", detalle: err.message });
  }
};
export const crearInteraccionLevantamiento = async (req, res) => {
  try {
    const etapa = await EtapaLevantamiento.findOne({ where: { proceso_id: req.params.id } });
    if (!etapa) return res.status(404).json({ ok: false, mensaje: "Etapa de levantamiento no encontrada." });

    const { consultores_ids = [], fecha, observaciones, proximos_pasos, estado_id } = req.body;
    if (!fecha) return res.status(400).json({ ok: false, mensaje: "'fecha' es obligatoria." });

    const interaccion = await InteraccionLevantamiento.create({
      etapa_levantamiento_id: etapa.id, fecha, observaciones, proximos_pasos,
      estado_id: estado_id || null,
    });

    if (consultores_ids.length > 0) await interaccion.setConsultores(consultores_ids);

    const resultado = await InteraccionLevantamiento.findByPk(interaccion.id, {
      include: [
        { model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } },
        { model: Estados,   as: "estadoObj",   attributes: ["id", "nombre"] },
      ]
    });
    return res.status(201).json({ ok: true, data: resultado });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const eliminarInteraccionLevantamiento = async (req, res) => {
  try {
    const interaccion = await InteraccionLevantamiento.findByPk(req.params.interaccionId);
    if (!interaccion) return res.status(404).json({ ok: false, mensaje: "Interacción no encontrada." });
    await interaccion.destroy();
    return res.status(200).json({ ok: true, mensaje: "Interacción eliminada." });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const crearInteraccionEstimacion = async (req, res) => {
  try {
    const etapa = await EtapaEstimacion.findOne({ where: { proceso_id: req.params.id } });
    if (!etapa) return res.status(404).json({ ok: false, mensaje: "Etapa de estimación no encontrada." });

    const { consultores_ids = [], fecha, observaciones, proximos_pasos, estado_id } = req.body;
    if (!fecha) return res.status(400).json({ ok: false, mensaje: "'fecha' es obligatoria." });

    const interaccion = await InteraccionEstimacion.create({
      etapa_estimacion_id: etapa.id, fecha, observaciones, proximos_pasos,
      estado_id: estado_id || null,
    });

    if (consultores_ids.length > 0) await interaccion.setConsultores(consultores_ids);

    const resultado = await InteraccionEstimacion.findByPk(interaccion.id, {
      include: [
        { model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } },
        { model: Estados,   as: "estadoObj",   attributes: ["id", "nombre"] },
      ]
    });
    return res.status(201).json({ ok: true, data: resultado });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const eliminarInteraccionEstimacion = async (req, res) => {
  try {
    const interaccion = await InteraccionEstimacion.findByPk(req.params.interaccionId);
    if (!interaccion) return res.status(404).json({ ok: false, mensaje: "Interacción no encontrada." });
    await interaccion.destroy();
    return res.status(200).json({ ok: true, mensaje: "Interacción eliminada." });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const listarInteraccionesLevantamiento = async (req, res) => {
  try {
    const etapa = await EtapaLevantamiento.findOne({ where: { proceso_id: req.params.id } });
    if (!etapa) return res.status(200).json({ ok: true, data: [] });

    const interacciones = await InteraccionLevantamiento.findAll({
      where:   { etapa_levantamiento_id: etapa.id },
      include: [
        { model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } },
        { model: Estados,   as: "estadoObj",   attributes: ["id", "nombre"] },
      ],
      order: [["fecha", "DESC"]],
    });
    return res.status(200).json({ ok: true, data: interacciones });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

export const listarInteraccionesEstimacion = async (req, res) => {
  try {
    const etapa = await EtapaEstimacion.findOne({ where: { proceso_id: req.params.id } });
    if (!etapa) return res.status(200).json({ ok: true, data: [] });

    const interacciones = await InteraccionEstimacion.findAll({
      where:   { etapa_estimacion_id: etapa.id },
      include: [
        { model: Consultor, as: "consultores", attributes: ["id", "nombre"], through: { attributes: [] } },
        { model: Estados,   as: "estadoObj",   attributes: ["id", "nombre"] },
      ],
      order: [["fecha", "DESC"]],
    });
    return res.status(200).json({ ok: true, data: interacciones });
  } catch (err) {
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};