import Cliente      from "../modelos/Cliente.js";
import Oportunidad  from "../modelos/Oportunidad.js";
import { encrypt }  from "../utils/encrypt.js";
import { decrypt }  from "../utils/decrypt.js";

const decryptCliente = (c) => ({
  ...c.toJSON(),
  nombre:       decrypt(c.nombre),
  email:        c.email    ? decrypt(c.email)    : null,
  telefono:     c.telefono ? decrypt(c.telefono) : null,
  empresa:      decrypt(c.empresa),
  tipo_cliente: c.tipo_cliente,
});

export const getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      include: [{
        model:      Oportunidad,
        attributes: ["id"],       
      }],
    });

    const result = clientes.map(c => ({
      ...decryptCliente(c),
      oportunidades: c.Oportunidads?.length ?? 0,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      include: [{ model: Oportunidad, attributes: ["id"] }],
    });

    if (!cliente)
      return res.status(404).json({ message: "Cliente no encontrado" });

    res.json({
      ...decryptCliente(cliente),
      oportunidades: cliente.Oportunidads?.length ?? 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCliente = async (req, res) => {
  try {
    const { nombre, email, telefono, empresa, tipo_cliente } = req.body;

    const cliente = await Cliente.create({
      nombre:       encrypt(nombre),
      email:        email    ? encrypt(email)    : null,
      telefono:     telefono ? encrypt(telefono) : null,
      empresa:      encrypt(empresa),
      tipo_cliente,
    });

    res.status(201).json({
      message: "Cliente creado",
      cliente: { ...decryptCliente(cliente), oportunidades: 0 },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      include: [{ model: Oportunidad, attributes: ["id"] }],
    });

    if (!cliente)
      return res.status(404).json({ message: "Cliente no encontrado" });

    const { nombre, email, telefono, empresa, tipo_cliente } = req.body;

    await cliente.update({
      nombre:       encrypt(nombre),
      email:        email    ? encrypt(email)    : null,
      telefono:     telefono ? encrypt(telefono) : null,
      empresa:      encrypt(empresa),
      tipo_cliente,
    });

    res.json({
      message: "Cliente actualizado",
      cliente: {
        ...decryptCliente(cliente),
        oportunidades: cliente.Oportunidads?.length ?? 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);

    if (!cliente)
      return res.status(404).json({ message: "Cliente no encontrado" });

    await cliente.destroy();
    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};