import { Op }            from "sequelize";
import { sequelize }     from "../config/database.js";
import {
  Cliente,
  UsuarioCliente,
}                        from "../modelos/relations.js";
import { INCLUDE_CLIENTE } from "../Helpers/includeCliente.js";
import { emailValido } from "../utils/verifyEmail.js";

export const listarClientes = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const where = {};
    if (search) where.nombre = { [Op.iLike]: `%${search.trim()}%` };

    const offset = (Math.max(1, +page) - 1) * +limit;

    const { count, rows } = await Cliente.findAndCountAll({
      where,
      include:  INCLUDE_CLIENTE,
      order:    [["nombre", "ASC"]],
      limit:    +limit,
      offset,
      distinct: true,
    });

    return res.status(200).json({
      ok:    true,
      total: count,
      page:  +page,
      pages: Math.ceil(count / +limit),
      data:  rows,
    });
  } catch (err) {
    console.error("[listarClientes]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al listar clientes.", detalle: err.message });
  }
};


export const obtenerCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, { include: INCLUDE_CLIENTE });

    if (!cliente) return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado." });

    return res.status(200).json({ ok: true, data: cliente });
  } catch (err) {
    console.error("[obtenerCliente]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener cliente.", detalle: err.message });
  }
};


export const crearCliente = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      nombre, empresa, usuarios = [],
      precio_hora_desarrollo, precio_hora_soporte,
      precio_hora_cambio, porcentaje_gobierno, nota,
    } = req.body;

    if (!nombre?.trim())  { await t.rollback(); return res.status(400).json({ ok: false, mensaje: "'nombre' es obligatorio." }); }
    if (!empresa?.trim()) { await t.rollback(); return res.status(400).json({ ok: false, mensaje: "'empresa' es obligatoria." }); }

    const existe = await Cliente.findOne({ where: { nombre: nombre.trim() } });
    if (existe) { await t.rollback(); return res.status(409).json({ ok: false, mensaje: "Ya existe un cliente con ese nombre." }); }

    const cliente = await Cliente.create(
      {
        nombre:                 nombre.trim(),
        empresa:                empresa.trim(),
        precio_hora_desarrollo: precio_hora_desarrollo ?? null,
        precio_hora_soporte:    precio_hora_soporte    ?? null,
        precio_hora_cambio:     precio_hora_cambio     ?? null,
        porcentaje_gobierno:    porcentaje_gobierno    ?? null,
        nota:                   nota || null,
      },
      { transaction: t }
    );

    if (usuarios.length > 0) {
      const data = usuarios.map(u => ({ ...u, cliente_id: cliente.id }));
      await UsuarioCliente.bulkCreate(data, { transaction: t });
    }

    await t.commit();
    const resultado = await Cliente.findByPk(cliente.id, { include: INCLUDE_CLIENTE });
    return res.status(201).json({ ok: true, mensaje: "Cliente creado.", data: resultado });
  } catch (err) {
    await t.rollback();
    console.error("[crearCliente]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al crear cliente.", detalle: err.message });
  }
};

export const actualizarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado." });

    const {
      nombre,empresa,
      precio_hora_desarrollo, precio_hora_soporte,
      precio_hora_cambio, porcentaje_gobierno, nota,
    } = req.body;

     if (nombre && nombre.trim() !== cliente.nombre) {
      const dup = await Cliente.findOne({ where: { nombre: nombre.trim() } });
      if (dup) return res.status(409).json({ ok: false, mensaje: "Nombre de cliente ya en uso." });
    }

    await cliente.update({
      nombre:                 nombre?.trim()        || cliente.nombre,
      empresa:                empresa?.trim()       || cliente.empresa,
      precio_hora_desarrollo: precio_hora_desarrollo ?? null,
      precio_hora_soporte:    precio_hora_soporte    ?? null,
      precio_hora_cambio:     precio_hora_cambio     ?? null,
      porcentaje_gobierno:    porcentaje_gobierno    ?? null,
      nota:                   nota                  ?? null,
    });

    const resultado = await Cliente.findByPk(cliente.id, { include: INCLUDE_CLIENTE });
    return res.status(200).json({ ok: true, mensaje: "Cliente actualizado.", data: resultado });
  } catch (err) {
    console.error("[actualizarCliente]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar cliente.", detalle: err.message });
  }
};

export const eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado." });

    await cliente.destroy();
    return res.status(200).json({ ok: true, mensaje: "Cliente eliminado." });
  } catch (err) {
    console.error("[eliminarCliente]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar cliente.", detalle: err.message });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.clienteId);
    if (!cliente) return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado." });

    const usuarios = await UsuarioCliente.findAll({
      where: { cliente_id: req.params.clienteId },
      order: [["nombre", "ASC"]],
    });

    return res.status(200).json({ ok: true, data: usuarios });
  } catch (err) {
    console.error("[listarUsuarios]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener usuarios.", detalle: err.message });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.clienteId);
    if (!cliente) return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado." });

    const { nombre, email, telefono, cargo } = req.body;
    if (!nombre?.trim()) return res.status(400).json({ ok: false, mensaje: "'nombre' es obligatorio." });
    if (!emailValido(email)) return res.status(400).json({ ok: false, mensaje: "Email inválido." });

    const usuario = await UsuarioCliente.create({
      cliente_id: req.params.clienteId,
      nombre: nombre.trim(),
      email,
      telefono,
      cargo,
    });

    return res.status(201).json({ ok: true, mensaje: "Usuario creado.", data: usuario });
  } catch (err) {
    console.error("[crearUsuario]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al crear usuario.", detalle: err.message });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await UsuarioCliente.findOne({
      where: { id: req.params.usuarioId, cliente_id: req.params.clienteId },
    });
    if (!usuario) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado." });

    const { nombre, cargo, activo } = req.body;

    await usuario.update({ nombre,cargo, activo });
    return res.status(200).json({ ok: true, mensaje: "Usuario actualizado.", data: usuario });
  } catch (err) {
    console.error("[actualizarUsuario]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar usuario.", detalle: err.message });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await UsuarioCliente.findOne({
      where: { id: req.params.usuarioId, cliente_id: req.params.clienteId },
    });
    if (!usuario) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado." });

    await usuario.destroy();
    return res.status(200).json({ ok: true, mensaje: "Usuario eliminado." });
  } catch (err) {
    console.error("[eliminarUsuario]", err);
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar usuario.", detalle: err.message });
  }
};