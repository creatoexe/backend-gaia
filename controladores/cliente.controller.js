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
    empresa: decrypt(c.empresa)
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
    empresa: decrypt(cliente.empresa)
  });

};

export const createCliente = async (req, res) => {

  const { nombre, email, telefono, empresa } = req.body;

  const cliente = await Cliente.create({
    nombre: encrypt(nombre),
    email: encrypt(email),
    telefono: encrypt(telefono),
    empresa: encrypt(empresa)
  });

  res.json(cliente);

};

export const updateCliente = async (req, res) => {

  const cliente = await Cliente.findByPk(req.params.id);

  if (!cliente) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }

  const { nombre, email, telefono, empresa } = req.body;

  await cliente.update({
    nombre: encrypt(nombre),
    email: encrypt(email),
    telefono: encrypt(telefono),
    empresa: encrypt(empresa)
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