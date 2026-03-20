import { body, param } from "express-validator";

const idValidator = param("id").isUUID().withMessage("'id' debe ser un UUID válido.");

export const crearAreaValidator = [
  body("nombre")
    .notEmpty().withMessage("'nombre' es obligatorio.")
    .isLength({ max: 100 }).withMessage("'nombre' no puede exceder 100 caracteres."),
  body("descripcion").optional({ nullable: true }).isString(),
];

export const actualizarAreaValidator = [
  idValidator,
  body("nombre")
    .optional()
    .notEmpty().withMessage("'nombre' no puede estar vacío.")
    .isLength({ max: 100 }).withMessage("'nombre' no puede exceder 100 caracteres."),
  body("activo").optional().isBoolean().withMessage("'activo' debe ser true o false."),
];

export const idAreaValidator = [idValidator];

export const crearRolValidator = [
  body("nombre")
    .notEmpty().withMessage("'nombre' es obligatorio.")
    .isLength({ max: 100 }).withMessage("'nombre' no puede exceder 100 caracteres."),
  body("descripcion").optional({ nullable: true }).isString(),
];

export const actualizarRolValidator = [
  idValidator,
  body("nombre")
    .optional()
    .notEmpty().withMessage("'nombre' no puede estar vacío."),
  body("activo").optional().isBoolean().withMessage("'activo' debe ser true o false."),
];

export const idRolValidator = [idValidator];

export const crearHerramientaValidator = [
  body("nombre")
    .notEmpty().withMessage("'nombre' es obligatorio.")
    .isLength({ max: 100 }).withMessage("'nombre' no puede exceder 100 caracteres."),
  body("fabricante").optional({ nullable: true }).isString(),
  body("version")   .optional({ nullable: true }).isString(),
  body("descripcion").optional({ nullable: true }).isString(),
];

export const actualizarHerramientaValidator = [
  idValidator,
  body("nombre")
    .optional()
    .notEmpty().withMessage("'nombre' no puede estar vacío."),
  body("activo").optional().isBoolean().withMessage("'activo' debe ser true o false."),
];

export const idHerramientaValidator = [idValidator];