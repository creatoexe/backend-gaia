import { sequelize } from "../config/database.js";
import Oportunidad       from "../modelos/Oportunidad.js";
import Cliente           from "../modelos/Cliente.js";
import EtapaLevantamiento from "../modelos/EtapaLevantamiento.js";
import EtapaEstimacion   from "../modelos/EtapaEstimacion.js";
import EtapaPropuesta    from "../modelos/EtapaPropuesta.js";
import EtapaAprobacion   from "../modelos/EtapaAprobacion.js";
import EtapaProyecto     from "../modelos/EtapaProyecto.js";
import Interaccion       from "../modelos/Interaccion.js";
import { Op }            from "sequelize";

/* ─────────────────── helpers ─────────────────── */
const nullOrDate = (v) => (v && v !== "" ? new Date(v) : null);
const nullOrNum  = (v) => (v !== undefined && v !== "" && v !== null ? Number(v) : null);

const TIPOS_PROCESO  = ["Automatización","Consultoría","Implementación","Desarrollo","Integración"];
const PRIORIDADES    = ["Bajo","Medio","Alto","Muy Alto"];
const ESTATUS_ENUM   = ["Lead","Contactado","Levantamiento","Estimacion","Propuesta",
  "En Aprobacion","Aprobado","Rechazado","En Ejecución","Cerrado","Stand BY","Facturada"];

/** Solo deja pasar si el valor existe en la lista; de lo contrario devuelve null */
const nullOrEnum = (v, list) => (v && list.includes(v) ? v : null);

/* ═══════════════════════════════════════════════
   GET /oportunidades
═══════════════════════════════════════════════ */
export const getOportunidades = async (req, res) => {
  try {
    const { estatus, cliente, consultor, fecha } = req.query;
    const where = {};
    if (estatus)   where.estatus    = estatus;
    if (cliente)   where.cliente_id = cliente;
    if (consultor) where.consultor_id = consultor;
    if (fecha)     where.fecha_lead = { [Op.gte]: fecha };

    const oportunidades = await Oportunidad.findAll({
      where,
      include: [{ model: Cliente }],
      order: [["createdAt", "DESC"]],
    });

    res.json(oportunidades);
  } catch (error) {
    console.error("[getOportunidades]", error.message);
    res.status(500).json({ error: error.message });
  }
};

/* ═══════════════════════════════════════════════
   GET /oportunidades/:id
═══════════════════════════════════════════════ */
export const getOportunidadById = async (req, res) => {
  try {
    const op = await Oportunidad.findByPk(req.params.id, {
      include: [
        Cliente,
        EtapaLevantamiento,
        EtapaEstimacion,
        EtapaPropuesta,
        EtapaProyecto,
        EtapaAprobacion,
        Interaccion,
      ],
    });
    if (!op) return res.status(404).json({ message: "Oportunidad no encontrada" });
    res.json(op);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ═══════════════════════════════════════════════
   POST /oportunidades  (solo base)
═══════════════════════════════════════════════ */
export const createOportunidad = async (req, res) => {
  try {
    const { cliente_id } = req.body;
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) return res.status(404).json({ message: "Cliente no existe" });

    const oportunidad = await Oportunidad.create(req.body);
    res.status(201).json({ message: "Oportunidad creada", oportunidad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ═══════════════════════════════════════════════
   POST /oportunidades/full  ← NUEVO (wizard)
   Crea oportunidad + todas las etapas en una sola
   transacción. Si algo falla, hace rollback total.
═══════════════════════════════════════════════ */
export const createOportunidadFull = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      /* Step 1 */
      cliente_id, nombre_proceso, tipo_proceso, probabilidad_aprobacion,
      prioridad, fecha_lead, plazo_inicio, accion_responsable, estatus,
      /* Step 2 */
      consultor_levantamiento_id, fecha_levantamiento,
      consultor_estimacion_id,   fecha_estimacion,
      /* Step 3 */
      consultor_propuesta_id, nivel_detalle, fecha_entrega_propuesta,
      valor_presupuestado, horas_presupuestadas,
      /* Step 4 */
      resultado_aprobacion, fecha_aprobacion,
      /* Step 5 */
      consultor_responsable_id, fecha_inicio_proyecto,
      fecha_cierre_facturacion, horas_reales,
      /* Interacción */
      interaccion_tipo, interaccion_consultor_id, interaccion_descripcion,
    } = req.body;

    /* Validar cliente */
    const cliente = await Cliente.findByPk(cliente_id, { transaction: t });
    if (!cliente) {
      await t.rollback();
      return res.status(404).json({ message: "Cliente no existe" });
    }

    /* 1. Oportunidad base */
    const oportunidad = await Oportunidad.create({
      cliente_id,
      nombre_proceso,
      tipo_proceso:            nullOrEnum(tipo_proceso, TIPOS_PROCESO),
      probabilidad_aprobacion: probabilidad_aprobacion || null,
      prioridad:               nullOrEnum(prioridad, PRIORIDADES),
      fecha_lead:              nullOrDate(fecha_lead),
      plazo_inicio:            nullOrDate(plazo_inicio),
      accion_responsable:      accion_responsable || null,
      estatus:                 nullOrEnum(estatus, ESTATUS_ENUM) ?? "Lead",
    }, { transaction: t });

    const oid = oportunidad.id;

    /* 2. Etapa Levantamiento */
    if (consultor_levantamiento_id) {
      await EtapaLevantamiento.create({
        oportunidad_id:      oid,
        consultor_id:        consultor_levantamiento_id,
        fecha_levantamiento: nullOrDate(fecha_levantamiento),
      }, { transaction: t });
    }

    /* 3. Etapa Estimación */
    if (consultor_estimacion_id) {
      await EtapaEstimacion.create({
        oportunidad_id:  oid,
        consultor_id:    consultor_estimacion_id,
        fecha_estimacion: nullOrDate(fecha_estimacion),
      }, { transaction: t });
    }

    /* 4. Etapa Propuesta */
    if (nullOrNum(valor_presupuestado) !== null) {
      const TARIFA = 10;
      const valor = Number(valor_presupuestado);
      const horas = nullOrNum(horas_presupuestadas) ?? Math.round(valor / TARIFA);

      await EtapaPropuesta.create({
        oportunidad_id:          oid,
        consultor_id:            consultor_propuesta_id || null,
        nivel_detalle:           nivel_detalle          || null,
        fecha_entrega_propuesta: nullOrDate(fecha_entrega_propuesta),
        valor_presupuestado:     valor,
        horas_presupuestadas:    horas,
      }, { transaction: t });
    }

    /* 5. Etapa Aprobación */
    if (resultado_aprobacion && resultado_aprobacion !== "Pendiente") {
      const aprobado = resultado_aprobacion === "Aprobado";
      await EtapaAprobacion.create({
        oportunidad_id:   oid,
        aprobado,
        fecha_aprobacion: aprobado  ? nullOrDate(fecha_aprobacion) : null,
        fecha_rechazo:    !aprobado ? nullOrDate(fecha_aprobacion) : null,
        motivo_rechazo:   null,
      }, { transaction: t });
    }

    /* 6. Etapa Proyecto */
    if (consultor_responsable_id) {
      await EtapaProyecto.create({
        oportunidad_id:           oid,
        consultor_responsable_id,
        fecha_inicio_proyecto:    nullOrDate(fecha_inicio_proyecto),
        fecha_cierre_facturacion: nullOrDate(fecha_cierre_facturacion),
        horas_reales:             nullOrNum(horas_reales) ?? 0,
      }, { transaction: t });
    }

    /* 7. Interacción opcional */
    if (interaccion_descripcion?.trim()) {
      await Interaccion.create({
        oportunidad_id: oid,
        consultor_id:   interaccion_consultor_id || consultor_responsable_id,
        tipo:           interaccion_tipo          || "Llamada",
        descripcion:    interaccion_descripcion,
        fecha:          new Date(),
      }, { transaction: t });
    }

    await t.commit();

    res.status(201).json({
      message: "Oportunidad creada con todas sus etapas",
      oportunidad,
    });

  } catch (error) {
    await t.rollback();
    console.error("[createOportunidadFull]", error.message);
    res.status(500).json({ error: error.message });
  }
};

/* ═══════════════════════════════════════════════
   PUT /oportunidades/:id
═══════════════════════════════════════════════ */
export const updateOportunidad = async (req, res) => {
  try {
    const op = await Oportunidad.findByPk(req.params.id);
    if (!op) return res.status(404).json({ message: "Oportunidad no encontrada" });

    await op.update(req.body);
    res.json({ message: "Oportunidad actualizada", oportunidad: op });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ═══════════════════════════════════════════════
   DELETE /oportunidades/:id
═══════════════════════════════════════════════ */
export const deleteOportunidad = async (req, res) => {
  try {
    const op = await Oportunidad.findByPk(req.params.id);
    if (!op) return res.status(404).json({ message: "Oportunidad no encontrada" });

    await op.destroy();
    res.json({ message: "Oportunidad eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};