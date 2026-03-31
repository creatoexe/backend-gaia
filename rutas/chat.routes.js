import { Router } from "express";
import {
  crearChat, listarChats, obtenerMensajes,
  eliminarChat, enviarMensaje,
} from "../controladores/chat.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";

const router  = Router();


router.post("/chat", verifyToken, crearChat);
router.get("/chat/consultor/me",          verifyToken, listarChats);
router.get("/chat/:chatId/mensajes",       verifyToken, obtenerMensajes);
router.delete("/chat/:chatId",             verifyToken, eliminarChat);

router.post(
  "/chat/:chatId/mensaje",
  verifyToken,
  uploadMiddleware,   
  enviarMensaje
);

export default router;