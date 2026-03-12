import Cliente from "../modelos/Cliente.js";
import { encrypt} from "../utils/encrypt.js";
import { decrypt} from "../utils/decrypt.js";


export const getClientes = async (req, res) => {

  const clientes = await Cliente.findAll();

  const clientesDescifrados = clientes.map(c => ({
    ...c.toJSON(),
    nombre: decrypt(c.nombre),
    email: decrypt(c.email),
    telefono: decrypt(c.telefono),
    empresa: decrypt(c.empresa),
    tipo_cliente: c.tipo_cliente
  }));

  res.json(clientesDescifrados);

};

export const getClienteById = async (req, res) => {

  const cliente = await Cliente.findByPk(req.params.id);

  if (!cliente) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }

  res.json({
    ...cliente.toJSON(),
    nombre: decrypt(cliente.nombre),
    email: decrypt(cliente.email),
    telefono: decrypt(cliente.telefono),
    empresa: decrypt(cliente.empresa),
    tipo_cliente: cliente.tipo_cliente
  });

};

export const createCliente = async (req, res) => {

  const { nombre, email, telefono, empresa , tipo_cliente } = req.body;

  const cliente = await Cliente.create({
    nombre: encrypt(nombre),
    email: email ? encrypt(email) : null,
    telefono: telefono ? encrypt(telefono) : null,
    empresa: encrypt(empresa),
    tipo_cliente,
  });

  res.json(cliente);

};

export const updateCliente = async (req, res) => {

  const cliente = await Cliente.findByPk(req.params.id);

  if (!cliente) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }

  const { nombre, email, telefono, empresa , tipo_cliente } = req.body;

  await cliente.update({
    nombre: encrypt(nombre),
    email: email ? encrypt(email) : null,
    telefono: telefono ? encrypt(telefono) : null,
    empresa: encrypt(empresa),
    tipo_cliente,
  });

  res.json(cliente);

};

export const deleteCliente = async (req, res) => {

  const cliente = await Cliente.findByPk(req.params.id);

  if (!cliente) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }

  await cliente.destroy();

  res.json({ message: "Cliente eliminado" });

};