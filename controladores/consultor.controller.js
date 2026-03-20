import { Op }        from "sequelize";
import { Consultor } from "../modelos/relations.js";
import { emailValido } from "../utils/verifyEmail.js";

export const listarConsultores = async (req, res) => {
  try {
    const { activo, rol, search, page = 1, limit = 20 } = req.query;
    const where = {};
    if (activo !== undefined) where.activo = activo === "true";
    if (rol)   where.rol    = rol;
    if (search) where.nombre = { [Op.iLike]: `%${search.trim()}%` };

    const offset = (Math.max(1, +page) - 1) * +limit;
    const { count, rows } = await Consultor.findAndCountAll({
      where, order: [["nombre", "ASC"]], limit: +limit, offset,
    });

    return res.status(200).json({
      ok: true, total: count, page: +page, pages: Math.ceil(count / +limit), data: rows,
    });
  } catch (err) {
    console.error("[listarConsultores]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al listar consultores.", detalle: err.message });
  }
};

export const obtenerConsultor = async (req, res) => {
  try {
    const consultor = await Consultor.findByPk(req.params.id);
    if (!consultor) return res.status(404).json({ ok: false, mensaje: "Consultor no encontrado." });
    return res.status(200).json({ ok: true, data: consultor });
  } catch (err) {
    console.error("[obtenerConsultor]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener consultor.", detalle: err.message });
  }
};

export const crearConsultor = async (req, res) => {
  try {
    const { nombre, email, rol = "consultor", telefono } = req.body;

    if (!nombre?.trim()) return res.status(400).json({ ok: false, mensaje: "'nombre' es obligatorio." });
    if (!email?.trim())  return res.status(400).json({ ok: false, mensaje: "'email' es obligatorio." });
    if (!emailValido(email)) return res.status(400).json({ ok: false, mensaje: "Email inválido." });
    if (!["consultor", "admin"].includes(rol))
      return res.status(400).json({ ok: false, mensaje: "'rol' debe ser 'consultor' o 'admin'." });

    const existe = await Consultor.findOne({ where: { email: email.trim() } });
    if (existe) return res.status(409).json({ ok: false, mensaje: "Ya existe un consultor con ese email." });

    const consultor = await Consultor.create({ nombre: nombre.trim(), email: email.trim(), rol, telefono });
    return res.status(201).json({ ok: true, mensaje: "Consultor creado.", data: consultor });
  } catch (err) {
    console.error("[crearConsultor]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al crear consultor.", detalle: err.message });
  }
};

export const actualizarConsultor = async (req, res) => {
  try {
    const consultor = await Consultor.findByPk(req.params.id);
    if (!consultor) return res.status(404).json({ ok: false, mensaje: "Consultor no encontrado." });

    const { nombre, email, rol, telefono, activo } = req.body;

    if (email && email !== consultor.email) {
      if (!emailValido(email)) return res.status(400).json({ ok: false, mensaje: "Email inválido." });
      const dup = await Consultor.findOne({ where: { email } });
      if (dup) return res.status(409).json({ ok: false, mensaje: "Email ya en uso." });
    }
    if (rol && !["consultor", "admin"].includes(rol))
      return res.status(400).json({ ok: false, mensaje: "'rol' inválido." });

    await consultor.update({ nombre, email, rol, telefono, activo });
    return res.status(200).json({ ok: true, mensaje: "Consultor actualizado.", data: consultor });
  } catch (err) {
    console.error("[actualizarConsultor]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar consultor.", detalle: err.message });
  }
};

export const eliminarConsultor = async (req, res) => {
  try {
    const consultor = await Consultor.findByPk(req.params.id);
    if (!consultor) return res.status(404).json({ ok: false, mensaje: "Consultor no encontrado." });

    await consultor.update({ activo: false });
    return res.status(200).json({ ok: true, mensaje: "Consultor desactivado." });
  } catch (err) {
    console.error("[eliminarConsultor]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar consultor.", detalle: err.message });
  }
};