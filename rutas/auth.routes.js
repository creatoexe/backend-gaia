import { Router } from "express";
import { registrarse, login, me } from "../controladores/auth.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyRole from "../middlewares/verifyRole.js";

const router = Router();

router.post("/registrarse", registrarse);
router.post("/login", login);
router.get("/me", verifyToken, me);
router.get("/admin", verifyToken, verifyRole(["administrador"]), (req, res) => {
  res.json({ message: "Solo admin" });
});

export default router;