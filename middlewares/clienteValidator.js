const { body } = require("express-validator");

exports.createClienteValidator = [

  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("email")
    .isEmail()
    .withMessage("Email inválido")

];