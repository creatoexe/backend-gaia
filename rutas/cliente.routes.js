import { Router } from "express";
import { getClientes, getClienteById, createCliente, updateCliente, deleteCliente } from "../controladores/cliente.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import { createClienteValidator } from "../middlewares/clienteValidator.js";
import validate from "../middlewares/validationResult.js";

const router = Router();

router.get("/clientes", verifyToken, getClientes);

router.get("/clientes/:id", verifyToken, getClienteById);

router.post("/clientes", verifyToken, createCliente);

router.put("/clientes/:id", verifyToken, updateCliente);

router.delete("/clientes/:id", verifyToken, deleteCliente);

export default router;