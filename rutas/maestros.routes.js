import { Router } from "express";

import verifyToken      from "../middlewares/verifyToken.js";
import {
  listarAreas, obtenerArea, crearArea, actualizarArea, eliminarArea,
  listarRoles, obtenerRol,  crearRol,  actualizarRol,  eliminarRol,
  listarHerramientas, obtenerHerramienta, crearHerramienta,
  actualizarHerramienta, eliminarHerramienta,
} from "../controladores/maestros.controller.js";

const router = Router();

router.use(verifyToken);

router.get(   "/areas",      listarAreas);
router.get(   "/areas/:id",  obtenerArea);
router.post(  "/areas", crearArea);
router.put(   "/areas/:id",  actualizarArea);
router.delete("/areas/:id",  eliminarArea);

router.get(   "/roles",      listarRoles);
router.get(   "/roles/:id",  obtenerRol);
router.post(  "/roles",     crearRol);
router.put(   "/roles/:id",  actualizarRol);
router.delete("/roles/:id", eliminarRol);

router.get(   "/herramientas",      listarHerramientas);
router.get(   "/herramientas/:id", obtenerHerramienta);

router.post(  "/herramientas", crearHerramienta);
router.put(   "/herramientas/:id", actualizarHerramienta);
router.delete("/herramientas/:id",eliminarHerramienta);

export default router;