import express from "express";
import cors    from "cors";
import { PORT }      from "./config/config.js";
import { sequelize } from "./config/database.js";
import { corsOption } from "./config/corsOption.js";

import "./modelos/relations.js";

import authRoutes           from "./rutas/auth.routes.js";
import clienteRoutes        from "./rutas/cliente.routes.js";
import consultorRoutes      from "./rutas/consultor.routes.js";
import proyectoRoutes       from "./rutas/proyecto.routes.js";
import procesoRoutes        from "./rutas/proceso.routes.js";
import maestrosRoutes       from "./rutas/maestros.routes.js";
import estadoProyectoRoutes from "./rutas/estadoProyecto.routes.js";
import reporteRoutes        from "./rutas/reporte.routes.js";
import chatRoutes from './rutas/chat.routes.js'
import aiApp from "./rutas/ai.routes.js";

const _PORT = PORT || 3000;
const app   = express();

app.use(express.json());
app.use(cors(corsOption));

const api = express.Router();
api.use(chatRoutes);
api.use(authRoutes);
api.use(clienteRoutes);
api.use(consultorRoutes);
api.use(proyectoRoutes);
api.use(procesoRoutes);
api.use(maestrosRoutes);
api.use(estadoProyectoRoutes);
api.use(reporteRoutes);
api.use(aiApp);

app.use("/api", api);

app.use((err, req, res, _next) => {
  console.error("[GlobalError]", err);
  res.status(500).json({ ok: false, mensaje: "Error interno del servidor.", detalle: err.message });
});

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Base de datos conectada.");
    await sequelize.sync({ alter: false });
    app.listen(_PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor corriendo en el puerto => ${_PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar:", error);
    process.exit(1);
  }
};

main();