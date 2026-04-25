import { systemSeguimientoContext } from "./seguimientoContext_system.js";
import { userSeguimientoContext }   from "./seguimientoContext_user.js";

export const seguimiento_context = {
  system:      systemSeguimientoContext,
  user:        userSeguimientoContext,
  tokens:      1000,
  temperature: 0.2,
  topP:        0.85,
  webSearch:   false,
};