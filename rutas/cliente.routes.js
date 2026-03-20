import { Router } from "express";

import verifyToken       from "../middlewares/verifyToken.js";

import {
  listarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../controladores/cliente.controller.js";

const router = Router();

router.use(verifyToken);

router.get(
  "/clientes",
  listarClientes
);

router.get(
  "/clientes/:id",
  obtenerCliente
);

router.post(
  "/clientes",
  crearCliente
);

router.put(
  "/clientes/:id",
  actualizarCliente
);

router.delete(
  "/clientes/:id",
  eliminarCliente
);

// ─── Usuarios del cliente ─────────────────────────────────────
router.get(
  "/clientes/:clienteId/usuarios",
  listarUsuarios
);

router.post(
  "/clientes/:clienteId/usuarios",
  crearUsuario
);

router.put(
  "/clientes/:clienteId/usuarios/:usuarioId",

  actualizarUsuario
);

router.delete(
  "/clientes/:clienteId/usuarios/:usuarioId",
  eliminarUsuario
);

export default router;