import { ESTATUS_VALIDOS, INCLUDE_PROCESO, TIPOS_INTERACCION, TIPOS_VALIDOS } from "../Helpers/h_proceso.js";
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
}                    from "../modelos/relations.js";

export const listarProcesos = async (req, res) => {
  try {
    const { proyectoId, estatus, tipo, page = 1, limit = 20 } = req.query;
    const proyectoIdParam = req.params.proyectoId || proyectoId;

    const where = {};
    if (proyectoIdParam) where.proyecto_id = proyectoIdParam;
    if (estatus)         where.estatus      = estatus;
    if (tipo)            where.tipo_proceso  = tipo;

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

const TIPOS_CLASIFICACION = ["Proyecto Nuevo", "Solicitud de Cambio"];

export const crearProceso = async (req, res) => {
  try {
    const { proyectoId } = req.params;
    const {
      nombre_proceso, tipo, tipo_proceso, estatus = "Lead",
      prioridad, probabilidad_aprobacion,
      plazo_inicio, herramienta_rpa_id, accion_responsable,
    } = req.body;

    if (!nombre_proceso?.trim())
      return res.status(400).json({ ok: false, mensaje: "'nombre_proceso' es obligatorio." });
    if (!TIPOS_VALIDOS.includes(tipo_proceso))
      return res.status(400).json({ ok: false, mensaje: `'tipo_proceso' inválido. Válidos: ${TIPOS_VALIDOS.join(", ")}.` });
    if (tipo && !TIPOS_CLASIFICACION.includes(tipo))
      return res.status(400).json({ ok: false, mensaje: `'tipo' inválido. Válidos: ${TIPOS_CLASIFICACION.join(", ")}.` });

    const proyecto = await Proyecto.findByPk(proyectoId);
    if (!proyecto) return res.status(404).json({ ok: false, mensaje: "Proyecto no encontrado." });

    if (herramienta_rpa_id) {
      const herramienta = await HerramientaRpa.findByPk(herramienta_rpa_id);
      if (!herramienta) return res.status(404).json({ ok: false, mensaje: "Herramienta no encontrada." });
    }

    const proceso = await Proceso.create({
      proyecto_id: proyectoId,
      nombre_proceso: nombre_proceso.trim(),
      tipo: tipo || null,
      tipo_proceso,
      estatus,
      prioridad,
      probabilidad_aprobacion,
      plazo_inicio,
      herramienta_rpa_id,
      accion_responsable,
      fecha_lead: new Date(),
    });

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

    const {
      nombre_proceso, tipo, tipo_proceso, prioridad,
      probabilidad_aprobacion, plazo_inicio,
      herramienta_rpa_id, accion_responsable,
    } = req.body;

    if (tipo_proceso && !TIPOS_VALIDOS.includes(tipo_proceso))
      return res.status(400).json({ ok: false, mensaje: `'tipo_proceso' inválido.` });
    if (tipo && !TIPOS_CLASIFICACION.includes(tipo))
      return res.status(400).json({ ok: false, mensaje: `'tipo' inválido.` });

    await proceso.update({
      nombre_proceso, tipo, tipo_proceso, prioridad,
      probabilidad_aprobacion, plazo_inicio,
      herramienta_rpa_id, accion_responsable,
    });

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
    if (!ESTATUS_VALIDOS.includes(estatus))
      return res.status(400).json({ ok: false, mensaje: `Estatus inválido. Válidos: ${ESTATUS_VALIDOS.join(", ")}.` });

    const fechas = {};
    if (estatus === "Contactado" && !proceso.fecha_contactado) fechas.fecha_contactado = new Date();

    await proceso.update({ estatus, ...fechas });
    return res.status(200).json({ ok: true, mensaje: `Estatus actualizado a '${estatus}'.`, data: proceso });
  } catch (err) {
    console.error("[cambiarEstatus]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al cambiar estatus.", detalle: err.message });
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

const upsertEtapa = async (Modelo, procesoId, datos, res, nombreEtapa) => {
  try {
    const proceso = await Proceso.findByPk(procesoId);
    if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

    const [etapa, creada] = await Modelo.findOrCreate({
      where:    { proceso_id: procesoId },
      defaults: { proceso_id: procesoId, ...datos },
    });

    if (!creada) await etapa.update(datos);

    return res.status(creada ? 201 : 200).json({
      ok:      true,
      mensaje: `${nombreEtapa} ${creada ? "registrada" : "actualizada"}.`,
      data:    etapa,
    });
  } catch (err) {
    console.error(`[upsert${nombreEtapa}]`, err);
    return res.status(500).json({ ok: false, mensaje: `Error en ${nombreEtapa}.`, detalle: err.message });
  }
};

export const upsertLevantamiento = (req, res) => {
  const { consultor_id, fecha_levantamiento, observaciones } = req.body;
  return upsertEtapa(
    EtapaLevantamiento, req.params.id,
    { consultor_id, fecha_levantamiento, observaciones }, res, "Levantamiento"
  );
};

export const upsertEstimacion = (req, res) => {
  const { consultor_id, fecha_estimacion, observaciones } = req.body;
  return upsertEtapa(
    EtapaEstimacion, req.params.id,
    { consultor_id, fecha_estimacion, observaciones }, res, "Estimación"
  );
};

export const upsertPropuesta = (req, res) => {
  const {
    consultor_id, nivel_detalle, fecha_entrega_propuesta,
    valor_presupuestado, horas_presupuestadas, observaciones,
  } = req.body;
  return upsertEtapa(
    EtapaPropuesta, req.params.id,
    { consultor_id, nivel_detalle, fecha_entrega_propuesta, valor_presupuestado, horas_presupuestadas, observaciones },
    res, "Propuesta"
  );
};

export const upsertPreliminar = (req, res) => {
  const { fecha_preliminar, resultado, observaciones, viable } = req.body;
  return upsertEtapa(
    EtapaPreliminar, req.params.id,
    { fecha_preliminar, resultado, observaciones, viable }, res, "Preliminar"
  );
};

/** PUT /procesos/:id/aprobacion */
export const upsertAprobacion = async (req, res) => {
  const { aprobado, fecha_aprobacion, motivo_rechazo, fecha_rechazo, observaciones } = req.body;

  if (typeof aprobado !== "boolean")
    return res.status(400).json({ ok: false, mensaje: "'aprobado' debe ser boolean." });
  if (!aprobado && !motivo_rechazo)
    return res.status(400).json({ ok: false, mensaje: "'motivo_rechazo' es obligatorio cuando se rechaza." });

  // Avanzar estatus automáticamente
  const proceso = await Proceso.findByPk(req.params.id);
  if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });
  await proceso.update({ estatus: aprobado ? "Aprobado" : "Rechazado" });

  return upsertEtapa(
    EtapaAprobacion, req.params.id,
    { aprobado, fecha_aprobacion, motivo_rechazo, fecha_rechazo, observaciones }, res, "Aprobación"
  );
};

/** PUT /procesos/:id/ejecucion */
export const upsertEjecucion = async (req, res) => {
  const {
    consultor_responsable_id, fecha_inicio,
    fecha_fin, horas_reales, observaciones,
  } = req.body;

  if (!fecha_inicio)
    return res.status(400).json({ ok: false, mensaje: "'fecha_inicio' es obligatorio." });

  const proceso = await Proceso.findByPk(req.params.id);
  if (!proceso) return res.status(404).json({ ok: false, mensaje: "Proceso no encontrado." });

  const etapaExistente = await EtapaEjecucion.findOne({ where: { proceso_id: req.params.id } });
  if (!etapaExistente) await proceso.update({ estatus: "En Ejecución" });

  return upsertEtapa(
    EtapaEjecucion, req.params.id,
    { consultor_responsable_id, fecha_inicio, fecha_fin, horas_reales, observaciones },
    res, "Ejecución"
  );
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

    const interaccion = await Interaccion.create({
      proceso_id:  req.params.id,
      consultor_id,
      tipo,
      descripcion,
      fecha,
    });

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