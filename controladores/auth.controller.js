import User from "../modelos/User.js";
import jwt from "jsonwebtoken";
import { encrypt } from "../utils/encrypt.js";
import { decrypt } from "../utils/decrypt.js";
import { JWT_SECRET } from "../config/config.js";

export const registrarse = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const passwordEncriptado = encrypt(password);

    const user = await User.create({
      nombre,
      email,
      password: passwordEncriptado,
      rol
    });

    res.json({ message: "Usuario creado", user });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const passwordDesencriptado = decrypt(user.password);

    if (password !== passwordDesencriptado) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    if (!user.verificado) {
      return res.status(403).json({
        message: "Cuenta no verificada. Revisa tu correo y haz clic en el enlace de verificación."
      });
    }

    if (!user.activo) {
      return res.status(403).json({ message: "Tu cuenta está desactivada. Contacta al administrador." });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, user });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const me = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.json(user);
};