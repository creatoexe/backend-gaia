import { Router } from "express";
import {
  getConsultores,
  getConsultorById,
  createConsultor,
  updateConsultor,
  deleteConsultor
} from "../controladores/consultor.controller.js";

import verifyToken from "../middlewares/verifyToken.js";
import { createConsultorValidator } from "../middlewares/consultorValidator.js";
import validate from "../middlewares/validationResult.js";

const router = Router();

router.get("/consultores", verifyToken, getConsultores);

router.get("/consultores/:id", verifyToken, getConsultorById);

router.post(
  "/consultores",
  verifyToken,
  createConsultorValidator,
  validate,
  createConsultor
);

router.put("/consultores/:id", verifyToken, updateConsultor);

router.delete("/consultores/:id", verifyToken, deleteConsultor);

export default router;