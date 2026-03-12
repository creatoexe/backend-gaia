import express from "express";
import cors from "cors";
import { PORT } from "./config/config.js";
import { sequelize } from "./config/database.js";
import authRoutes from "./rutas/auth.routes.js";
import clienteRoutes from "./rutas/cliente.routes.js";
import {corsOption} from './config/corsOption.js'
import consultorRoutes from "./rutas/consultor.routes.js";
const _PORT = PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors(corsOption));

const api = express.Router();
api.use(authRoutes);
api.use(clienteRoutes);
api.use(consultorRoutes);

app.use("/api", api);

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log("Base de datos conectada.");
    await sequelize.sync({ alter: !false });
    app.listen(_PORT, "0.0.0.0", () => {
      console.log(`Servidor corriendo en el puerto => ${_PORT}`);
    });
  } catch (error) {
    console.log(`Error ${error}`);
  }
};

main();