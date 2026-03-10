import { body } from "express-validator";

export const createClienteValidator = [

  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("email")
    .isEmail()
    .withMessage("Email inválido")

];