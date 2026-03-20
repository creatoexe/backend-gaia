import { Router } from "express";

import verifyToken      from "../middlewares/verifyToken.js";

import {
  listarProyectos,
  obtenerProyecto,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto,
  agregarAreas,
  quitarArea,
  agregarMiembro,
  quitarMiembro,
  asignarHerramienta,
  cambiarEstadoHerramienta,
} from "../controladores/proyecto.controller.js";
import { listarProcesos } from "../controladores/proceso.controller.js";

const router = Router();

router.use(verifyToken);

router.get(
  "/proyectos",
  listarProyectos
);

router.get(
  "/proyectos/:id",
  obtenerProyecto
);

router.post(
  "/proyectos",
  crearProyecto
);

router.put(
  "/proyectos/:id",
  actualizarProyecto
);

router.delete(
  "/proyectos/:id",
  eliminarProyecto
);

router.post(
  "/proyectos/:id/areas",
  agregarAreas
);

router.delete(
  "/proyectos/:id/areas/:areaId",
  quitarArea
);

router.post(
  "/proyectos/:id/miembros",
  agregarMiembro
);

router.delete(
  "/proyectos/:id/miembros/:usuarioClienteId",
  quitarMiembro
);

router.post(
  "/proyectos/:id/herramientas",
  asignarHerramienta
);

router.patch(
  "/proyectos/:id/herramientas/:asignacionId/estado",
  cambiarEstadoHerramienta
);

router.get(
  "/proyectos/:proyectoId/procesos",
  listarProcesos
);

export default router;