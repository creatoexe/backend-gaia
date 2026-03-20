import { body, param } from "express-validator";

export const crearConsultorValidator = [
  body("nombre")
    .notEmpty().withMessage("'nombre' es obligatorio.")
    .isLength({ max: 150 }).withMessage("'nombre' no puede exceder 150 caracteres."),

  body("email")
    .notEmpty().withMessage("'email' es obligatorio.")
    .isEmail().withMessage("'email' debe tener formato válido."),

  body("rol")
    .optional()
    .isIn(["consultor", "admin"]).withMessage("'rol' debe ser 'consultor' o 'admin'."),

  body("telefono")
    .optional({ nullable: true })
    .isLength({ max: 20 }).withMessage("'telefono' no puede exceder 20 caracteres."),
];

export const actualizarConsultorValidator = [
  param("id").isUUID().withMessage("'id' debe ser un UUID válido."),

  body("email")
    .optional()
    .isEmail().withMessage("'email' debe tener formato válido."),

  body("rol")
    .optional()
    .isIn(["consultor", "admin"]).withMessage("'rol' debe ser 'consultor' o 'admin'."),

  body("activo")
    .optional()
    .isBoolean().withMessage("'activo' debe ser true o false."),
];

export const idConsultorValidator = [
  param("id").isUUID().withMessage("'id' debe ser un UUID válido."),
];