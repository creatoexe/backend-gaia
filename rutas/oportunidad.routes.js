import { Router } from "express";

import {
  getOportunidades,
  getOportunidadById,
  createOportunidad,
  updateOportunidad,
  deleteOportunidad,
} from "../controladores/oportunidad.controller.js";

import verifyToken from "../middlewares/verifyToken.js";

import validate from "../middlewares/validationResult.js";

import {
  createOportunidadValidator,
  updateOportunidadValidator,
  getOportunidadesValidator,
} from "../middlewares/oportunidadValidator.js";

const router = Router();

router.get(
  "/oportunidades",
  verifyToken,
  getOportunidadesValidator,
  validate,
  getOportunidades,
);

router.get("/oportunidades/:id", verifyToken, getOportunidadById);

router.post(
  "/oportunidades",
  verifyToken,
  createOportunidadValidator,
  validate,
  createOportunidad,
);

router.put(
  "/oportunidades/:id",
  verifyToken,
  updateOportunidadValidator,
  validate,
  updateOportunidad,
);

router.delete("/oportunidades/:id", verifyToken, deleteOportunidad);

export default router;
