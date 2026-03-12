import crypto from "crypto";
import Consultor from "../modelos/Consultor.js";
import User     from "../modelos/User.js";
import { encrypt }               from "../utils/encrypt.js";
import { decrypt }               from "../utils/decrypt.js";
import { sendVerificationEmail } from "../services/emailService.js";


export const getConsultores = async (req, res) => {

  const consultores = await Consultor.findAll();

  const consultoresDescifrados = consultores.map(c => ({
    ...c.toJSON(),
    nombre:   decrypt(c.nombre),
    email:    decrypt(c.email),
    telefono: c.telefono ? decrypt(c.telefono) : null,
  }));

  res.json(consultoresDescifrados);

};


export const getConsultorById = async (req, res) => {

  const consultor = await Consultor.findByPk(req.params.id);

  if (!consultor) {
    return res.status(404).json({ message: "Consultor no encontrado" });
  }

  res.json({
    ...consultor.toJSON(),
    nombre:   decrypt(consultor.nombre),
    email:    decrypt(consultor.email),
    telefono: consultor.telefono ? decrypt(consultor.telefono) : null,
  });

};


export const createConsultor = async (req, res) => {

  const { nombre, email, telefono, rol, activo } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: "Ya existe un usuario con ese correo" });
  }

  const tempPassword      = crypto.randomBytes(5).toString("hex");
  const tokenVerificacion = crypto.randomUUID();

  const consultor = await Consultor.create({
    nombre:   encrypt(nombre),
    email:    encrypt(email),
    telefono: telefono ? encrypt(telefono) : null,
    rol:      rol ?? "consultor",
    activo:   activo ?? true,
  });

  await User.create({
    nombre,
    email,
    password:           encrypt(tempPassword),
    rol:                rol ?? "consultor",
    activo:             activo ?? true,
    verificado:         false,
    token_verificacion: tokenVerificacion,
  });

  sendVerificationEmail(email, nombre, tokenVerificacion, tempPassword)
    .catch(err => console.error("[emailService] Error enviando correo:", err.message));

  res.status(201).json({
    message:   "Consultor creado. Se envió un correo de verificación.",
    consultor,
  });

};


export const updateConsultor = async (req, res) => {

  const consultor = await Consultor.findByPk(req.params.id);

  if (!consultor) {
    return res.status(404).json({ message: "Consultor no encontrado" });
  }

  const { nombre, email, telefono, rol, activo } = req.body;

  await consultor.update({
    nombre:   encrypt(nombre),
    email:    encrypt(email),
    telefono: telefono ? encrypt(telefono) : null,
    rol,
    activo,
  });

  res.json(consultor);

};


export const deleteConsultor = async (req, res) => {

  const consultor = await Consultor.findByPk(req.params.id);

  if (!consultor) {
    return res.status(404).json({ message: "Consultor no encontrado" });
  }

  await consultor.destroy();

  res.json({ message: "Consultor eliminado" });

};