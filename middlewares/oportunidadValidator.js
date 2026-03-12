import { body, param, query } from "express-validator";

export const createOportunidadValidator = [

  body("cliente_id")
    .notEmpty()
    .withMessage("cliente_id es obligatorio"),

  body("nombre_proceso")
    .notEmpty()
    .withMessage("nombre_proceso es obligatorio"),

  body("estatus")
    .notEmpty()
    .withMessage("estatus es obligatorio"),

];

export const updateOportunidadValidator = [

  param("id")
    .notEmpty()
    .withMessage("id es obligatorio")

];

export const getOportunidadesValidator = [

  query("estatus")
    .optional(),

  query("cliente")
    .optional(),

  query("consultor")
    .optional(),

  query("fecha")
    .optional()
];