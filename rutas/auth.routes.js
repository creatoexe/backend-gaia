import { Router } from "express";
import { registrarse, login, me, changePass } from "../controladores/auth.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyRole from "../middlewares/verifyRole.js";
import { verificarEmail } from "../controladores/verificacion.controller.js";

const router = Router();

router.post("/registrarse", registrarse);
router.post("/login", login);
router.get("/me", verifyToken, me);
router.get("/auth/verificar", verificarEmail);
router.get("/admin", verifyToken, verifyRole(["administrador"]), (req, res) => {
  res.json({ message: "Solo admin" });
});
router.put('/password', verifyToken, changePass);


export default router;