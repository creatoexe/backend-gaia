import Consultor from "../modelos/Consultor.js";
import { encrypt } from "../utils/encrypt.js";
import { decrypt } from "../utils/decrypt.js";


export const getConsultores = async (req, res) => {

  const consultores = await Consultor.findAll();

  const consultoresDescifrados = consultores.map(c => ({
    ...c.toJSON(),
    nombre: decrypt(c.nombre),
    email: decrypt(c.email),
    especialidad: decrypt(c.especialidad),
    telefono: decrypt(c.telefono)
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
    nombre: decrypt(consultor.nombre),
    email: decrypt(consultor.email),
    especialidad: decrypt(consultor.especialidad),
    telefono: decrypt(consultor.telefono)
  });

};


export const createConsultor = async (req, res) => {

  const { nombre, email, especialidad, telefono } = req.body;

  const consultor = await Consultor.create({
    nombre: encrypt(nombre),
    email: encrypt(email),
    especialidad: encrypt(especialidad),
    telefono: encrypt(telefono)
  });

  res.json(consultor);

};


export const updateConsultor = async (req, res) => {

  const consultor = await Consultor.findByPk(req.params.id);

  if (!consultor) {
    return res.status(404).json({ message: "Consultor no encontrado" });
  }

  const { nombre, email, especialidad, telefono } = req.body;

  await consultor.update({
    nombre: encrypt(nombre),
    email: encrypt(email),
    especialidad: encrypt(especialidad),
    telefono: encrypt(telefono)
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