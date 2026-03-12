import {Router} from "express";
import {
getOportunidades,
getOportunidadById,
createOportunidad,
updateOportunidad,
deleteOportunidad
} from "../controladores/oportunidad.controller.js";

import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.get("/oportunidades",verifyToken,getOportunidades);
router.get("/oportunidades/:id",verifyToken,getOportunidadById);
router.post("/oportunidades",verifyToken,createOportunidad);
router.put("/oportunidades/:id",verifyToken,updateOportunidad);
router.delete("/oportunidades/:id",verifyToken,deleteOportunidad);

export default router;