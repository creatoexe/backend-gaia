const express = require("express");
const router = express.Router();
const authController = require("../controladores/auth.controller");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");

router.post("/registrarse", authController.registrarse);

router.post("/login", authController.login);

router.get("/me", verifyToken, authController.me);
router.get(
  "/admin",
  verifyToken,
  verifyRole(["administrador"]),
  (req, res) => {
    res.json({ message: "Solo admin" });
  }
);

module.exports = router;