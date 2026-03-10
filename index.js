import express from "express";
import cors from "cors";
import { PORT } from "./config/config.js";
import { sequelize } from "./config/database.js";
import authRoutes from "./rutas/auth.routes.js";
import clienteRoutes from "./rutas/cliente.routes.js";

const _PORT = PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:8100/api",
    "https://quotes-espam.netlify.app",
    "http://192.168.0.143:8100",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use("/api", authRoutes);
app.use("/api", clienteRoutes);

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log("Base de datos conectada.");
    await sequelize.sync({ alter: false });
    app.listen(_PORT, "0.0.0.0", () => {
      console.log(`Servidor corriendo en el puerto => ${_PORT}`);
    });
  } catch (error) {
    console.log(`Error ${error}`);
  }
};

main();