import { Router } from 'express';
import {
  startOAuth,
  handleOAuthCallback,
  unlinkGoogleCalendar,
  getCalendarStatus,
  listarEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} from '../controladores/calendario.controller.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = Router();

router.get('/calendario/auth',          startOAuth);
router.get('/calendario/auth/callback', handleOAuthCallback);

router.delete('/calendario/auth',                verifyToken, unlinkGoogleCalendar);
router.get('/calendario/status/:consultorId',    verifyToken, getCalendarStatus);
router.get('/calendario/eventos/:consultorId',   verifyToken, listarEventos);
router.post('/calendario/eventos',               verifyToken, crearEvento);
router.put('/calendario/eventos/:eventId',       verifyToken, actualizarEvento);
router.delete('/calendario/eventos/:eventId',    verifyToken, eliminarEvento);

export default router;