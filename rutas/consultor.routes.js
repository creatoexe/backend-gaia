import { Router } from "express";

import verifyToken      from "../middlewares/verifyToken.js";
import {
  listarConsultores,
  obtenerConsultor,
  crearConsultor,
  actualizarConsultor,
  eliminarConsultor,
} from "../controladores/consultor.controller.js";

const router = Router();
router.use(verifyToken);

router.get(
  "/consultores",
  listarConsultores
);

router.get(
  "/consultores/:id",
  obtenerConsultor
);

router.post(
  "/consultores",
  crearConsultor
);

router.put(
  "/consultores/:id",
  actualizarConsultor
);

router.delete(
  "/consultores/:id",
  eliminarConsultor
);

export default router;