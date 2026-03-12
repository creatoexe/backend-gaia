import User from "../modelos/User.js";

export const verificarEmail = async (req, res) => {

  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Token requerido" });
  }

  const user = await User.findOne({ where: { token_verificacion: token } });

  if (!user) {
    return res.status(404).json({ message: "Token inválido o ya utilizado" });
  }

  await user.update({
    verificado:         true,
    token_verificacion: null,
  });

  res.json({ message: "Cuenta verificada correctamente. Ya puedes iniciar sesión." });

};