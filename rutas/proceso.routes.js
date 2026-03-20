import { Router } from "express";

import verifyToken      from "../middlewares/verifyToken.js";

import {
  listarProcesos,
  obtenerProceso,
  crearProceso,
  actualizarProceso,
  cambiarEstatus,
  eliminarProceso,
  upsertLevantamiento,
  upsertEstimacion,
  upsertPropuesta,
  upsertPreliminar,
  upsertAprobacion,
  upsertEjecucion,
  listarInteracciones,
  crearInteraccion,
  eliminarInteraccion,
} from "../controladores/proceso.controller.js";

const router = Router();
router.use(verifyToken);

router.get(
  "/procesos",
  listarProcesos
);

router.get(
  "/procesos/:id",
  obtenerProceso
);

router.post(
  "/proyectos/:proyectoId/procesos",
  crearProceso
);

router.put(
  "/procesos/:id",
  actualizarProceso
);

router.patch(
  "/procesos/:id/estatus",
  cambiarEstatus
);

router.delete(
  "/procesos/:id",
  eliminarProceso
);

router.put(
  "/procesos/:id/levantamiento",
  upsertLevantamiento
);

router.put(
  "/procesos/:id/estimacion",
  upsertEstimacion
);

router.put(
  "/procesos/:id/propuesta",
  upsertPropuesta
);

router.put(
  "/procesos/:id/preliminar",
  upsertPreliminar
);

router.put(
  "/procesos/:id/aprobacion",
  upsertAprobacion
);

router.put(
  "/procesos/:id/ejecucion",
  upsertEjecucion
);

router.get(
  "/procesos/:id/interacciones",
  listarInteracciones
);

router.post(
  "/procesos/:id/interacciones",
  crearInteraccion
);

router.delete(
  "/procesos/:id/interacciones/:interaccionId",
  eliminarInteraccion
);

export default router;