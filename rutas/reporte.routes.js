import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";

import {
  dashboardEjecutivo,
  reporteProyectos,
  reportePipeline,
  reporteFinanciero,
  reporteConsultores,
  reporteClientes,
  reporteHerramientas,
  actividadReciente,
  reporteAreas,
  reporteForecast,
  reporteSaludClientes,
  reporteCapacidad,
} from "../controladores/reporte.controller.js";

const router = Router();

router.use(verifyToken);
router.get("/reportes/dashboard", dashboardEjecutivo);
router.get("/reportes/proyectos", reporteProyectos);
router.get("/reportes/pipeline", reportePipeline);
router.get("/reportes/financiero", reporteFinanciero);
router.get("/reportes/consultores", reporteConsultores);
router.get("/reportes/clientes", reporteClientes);
router.get("/reportes/herramientas", reporteHerramientas);
router.get("/reportes/actividad-reciente", actividadReciente);
router.get("/reportes/areas", reporteAreas);
router.get("/reportes/forecast", reporteForecast);
router.get("/reportes/salud-clientes", reporteSaludClientes);
router.get("/reportes/capacidad", reporteCapacidad);

export default router;