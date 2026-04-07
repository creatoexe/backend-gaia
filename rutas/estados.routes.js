import { Router } from "express";
import { listar, crear, actualizar, eliminar } from "../controladores/estados.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.get("/estados",        verifyToken, listar);
router.post("/estados",       verifyToken, crear);
router.put("/estados/:id",    verifyToken, actualizar);
router.delete("/estados/:id", verifyToken, eliminar);

export default router;