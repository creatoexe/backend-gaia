import { Router } from "express";
import verifyToken      from "../middlewares/verifyToken.js";
import {
  listarEstados,
  registrarEstado,
  eliminarUltimoEstado,
} from "../controladores/estadoProyecto.controller.js";

const router = Router();
router.use(verifyToken);

router.get(
  "/proyectos/:id/estados",
  listarEstados
);

router.post(
  "/proyectos/:id/estados",
  registrarEstado
);

router.delete(
  "/proyectos/:id/estados/:estadoId",
  eliminarUltimoEstado
);

export default router;