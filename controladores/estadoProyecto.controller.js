import { sequelize }               from "../config/database.js";
import { ESTADOS_BLOQUEADOS_DESTINO, ESTADOS_TERMINALES, ESTADOS_VALIDOS, INCLUDE_ESTADO } from "../Helpers/h_estadoProyecto.js";
import { EstadoProyecto, Proyecto, Consultor } from "../modelos/relations.js";
export const listarEstados = async (req, res) => {
  try {
    const proyecto = await Proyecto.findByPk(req.params.id);
    if (!proyecto) return res.status(404).json({ ok: false, mensaje: "Proyecto no encontrado." });

    const estados = await EstadoProyecto.findAll({
      where: { proyecto_id: req.params.id },
      include: INCLUDE_ESTADO,
      order: [["fecha", "ASC"], ["createdAt", "ASC"]],
    });

    return res.status(200).json({ ok: true, data: estados, estado_actual: proyecto.estado_actual });
  } catch (err) {
    console.error("[listarEstados]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener estados.", detalle: err.message });
  }
};

export const registrarEstado = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { estado, observacion, consultor_id, fecha } = req.body;

    if (!ESTADOS_VALIDOS.includes(estado)) {
      await t.rollback();
      return res.status(400).json({
        ok: false,
        mensaje: `Estado inválido. Válidos: ${ESTADOS_VALIDOS.join(", ")}.`,
      });
    }

    const proyecto = await Proyecto.findByPk(req.params.id);
    if (!proyecto) {
      await t.rollback();
      return res.status(404).json({ ok: false, mensaje: "Proyecto no encontrado." });
    }

    if (proyecto.estado_actual === estado) {
      await t.rollback();
      return res.status(409).json({
        ok: false,
        mensaje: `El proyecto ya se encuentra en estado '${estado}'.`,
      });
    }

    if (ESTADOS_TERMINALES.includes(proyecto.estado_actual)) {
      await t.rollback();
      return res.status(400).json({
        ok: false,
        mensaje: `El proyecto está en estado '${proyecto.estado_actual}' y no admite más cambios. Usa "Deshacer" para revertirlo si fue un error.`,
      });
    }

    if (ESTADOS_BLOQUEADOS_DESTINO.includes(estado)) {
      await t.rollback();
      return res.status(400).json({
        ok: false,
        mensaje: `No se puede volver a '${estado}'. Este estado solo se asigna al crear el proyecto.`,
      });
    }

    if (consultor_id) {
      const consultor = await Consultor.findByPk(consultor_id);
      if (!consultor) {
        await t.rollback();
        return res.status(404).json({ ok: false, mensaje: "Consultor no encontrado." });
      }
    }

    const registro = await EstadoProyecto.create({
      proyecto_id:  req.params.id,
      estado,
      observacion:  observacion  || null,
      consultor_id: consultor_id || null,
      fecha:        fecha ? new Date(fecha) : new Date(),
    }, { transaction: t });

    await proyecto.update({ estado_actual: estado }, { transaction: t });

    await t.commit();

    const registroConConsultor = await EstadoProyecto.findByPk(registro.id, { include: INCLUDE_ESTADO });
    return res.status(201).json({
      ok:            true,
      mensaje:       `Estado actualizado a '${estado}'.`,
      data:          registroConConsultor,
      estado_actual: proyecto.estado_actual,
    });
  } catch (err) {
    await t.rollback();
    console.error("[registrarEstado]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al registrar estado.", detalle: err.message });
  }
};

export const eliminarUltimoEstado = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const registro = await EstadoProyecto.findByPk(req.params.estadoId);
    if (!registro || registro.proyecto_id !== req.params.id) {
      await t.rollback();
      return res.status(404).json({ ok: false, mensaje: "Registro no encontrado." });
    }

    // Solo el último puede eliminarse
    const ultimo = await EstadoProyecto.findOne({
      where: { proyecto_id: req.params.id },
      order: [["fecha", "DESC"], ["createdAt", "DESC"]],
    });

    if (ultimo.id !== registro.id) {
      await t.rollback();
      return res.status(400).json({
        ok: false,
        mensaje: "Solo se puede eliminar el último estado registrado.",
      });
    }

    await registro.destroy({ transaction: t });

    // Revertir al estado anterior
    const anterior = await EstadoProyecto.findOne({
      where: { proyecto_id: req.params.id },
      order: [["fecha", "DESC"], ["createdAt", "DESC"]],
    });

    const estadoAnterior = anterior?.estado ?? "Pendiente";
    const proyecto = await Proyecto.findByPk(req.params.id);
    await proyecto.update({ estado_actual: estadoAnterior }, { transaction: t });

    await t.commit();
    return res.status(200).json({
      ok: true,
      mensaje: "Último estado eliminado.",
      estado_actual: estadoAnterior,
    });
  } catch (err) {
    await t.rollback();
    console.error("[eliminarUltimoEstado]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar estado.", detalle: err.message });
  }
};