const express = require("express");
const app = express();

app.use(express.json());
//routes
const authRoutes = require("./rutas/auth.routes");
const clienteRoutes = require("./rutas/cliente.routes");

app.use("/api/auth", authRoutes);
app.use("/api", clienteRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});