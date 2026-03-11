import { body } from "express-validator";

export const createConsultorValidator = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido"),

  body("telefono")
    .optional()
    .isLength({ min: 7 })
    .withMessage("Teléfono inválido")
];