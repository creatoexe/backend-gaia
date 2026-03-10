const express = require("express");
const router = express.Router();

const clienteController = require("../controladores/cliente.controller");
const verifyToken = require("../middlewares/verifyToken");

const { createClienteValidator } = require("../middlewares/clienteValidator");
const validate = require("../middlewares/validationResult");

router.get("/clientes", verifyToken, clienteController.getClientes);

router.get("/clientes/:id", verifyToken, clienteController.getClienteById);

router.post(
  "/clientes",
  verifyToken,
  createClienteValidator,
  validate,
  clienteController.createCliente
);

router.put("/clientes/:id", verifyToken, clienteController.updateCliente);

router.delete("/clientes/:id", verifyToken, clienteController.deleteCliente);

module.exports = router;