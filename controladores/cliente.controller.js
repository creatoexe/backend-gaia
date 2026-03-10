const Cliente = require("../modelos/Cliente");

exports.getClientes = async (req, res) => {

  const clientes = await Cliente.findAll();

  res.json(clientes);

};

exports.getClienteById = async (req, res) => {

  const cliente = await Cliente.findByPk(req.params.id);

  if (!cliente) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }

  res.json(cliente);

};

exports.createCliente = async (req, res) => {

  const cliente = await Cliente.create(req.body);

  res.json(cliente);

};

exports.updateCliente = async (req, res) => {

  const cliente = await Cliente.findByPk(req.params.id);

  if (!cliente) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }

  await cliente.update(req.body);

  res.json(cliente);

};

exports.deleteCliente = async (req, res) => {

  const cliente = await Cliente.findByPk(req.params.id);

  if (!cliente) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }

  await cliente.destroy();

  res.json({ message: "Cliente eliminado" });

};