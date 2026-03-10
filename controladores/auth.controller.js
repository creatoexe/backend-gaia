const User = require("../modelos/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

exports.registrarse = async (req, res) => {

  try {

    const { nombre, email, password, rol } = req.body;

    const hash = CryptoJS.SHA256(password).toString();

    const user = await User.create({
      nombre,
      email,
      password_hash: hash,
      rol
    });

    res.json({
      message: "Usuario creado",
      user
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const hash = CryptoJS.SHA256(password).toString();

    if (hash !== user.password_hash) {
      return res.status(401).json({ message: "Password incorrecto" });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.me = async (req, res) => {

  const user = await User.findByPk(req.user.id);

  res.json(user);

};