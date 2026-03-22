import { body, param } from "express-validator";

export const crearClienteValidator = [
  body("nombre")
    .notEmpty().withMessage("'nombre' es obligatorio.")
    .isLength({ max: 150 }).withMessage("'nombre' no puede exceder 150 caracteres."),

  body("empresa")
    .notEmpty().withMessage("'empresa' es obligatoria.")
    .isLength({ max: 100 }).withMessage("'empresa' no puede exceder 100 caracteres."),

  body("email")
    .optional({ nullable: true })
    .isEmail().withMessage("'email' no tiene formato válido."),

  body("telefono")
    .optional({ nullable: true })
    .isLength({ max: 20 }).withMessage("'telefono' no puede exceder 20 caracteres."),

  body("usuarios")
    .optional()
    .isArray().withMessage("'usuarios' debe ser un array."),

  body("usuarios.*.nombre")
    .if(body("usuarios").exists())
    .notEmpty().withMessage("Cada usuario debe tener 'nombre'."),

  body("usuarios.*.email")
    .optional({ nullable: true })
    .isEmail().withMessage("El email de un usuario no es válido."),
  
    body("precio_hora_desarrollo")
  .optional({ nullable: true })
  .isFloat({ min: 0 })
  .withMessage("precio_hora_desarrollo debe ser número positivo"),

 body("precio_hora_soporte")
  .optional({ nullable: true })
  .isFloat({ min: 0 }).withMessage("precio_hora_soporte debe ser decimal"),

body("precio_hora_cambio")
  .optional({ nullable: true })
  .isFloat({ min: 0 }).withMessage("precio_hora_cambio debe ser decimal"),

body("porcentaje_gobierno")
  .optional({ nullable: true })
  .isFloat({ min: 0, max: 100 })
  .withMessage("porcentaje_gobierno debe estar entre 0 y 100"),

body("descuento_gobierno")
  .optional({ nullable: true })
  .isFloat().withMessage("descuento_gobierno debe ser decimal"),

body("nota_gobierno")
  .optional({ nullable: true })
  .isString().withMessage("nota_gobierno debe ser texto"),
];

export const actualizarClienteValidator = [
  param("id")
    .isUUID().withMessage("El parámetro 'id' debe ser un UUID válido."),

  body("nombre")
    .optional()
    .notEmpty().withMessage("'nombre' no puede estar vacío.")
    .isLength({ max: 150 }).withMessage("'nombre' no puede exceder 150 caracteres."),

  body("empresa")
    .optional()
    .notEmpty().withMessage("'empresa' no puede estar vacía.")
    .isLength({ max: 100 }).withMessage("'empresa' no puede exceder 100 caracteres."),

  body("email")
    .optional({ nullable: true })
    .isEmail().withMessage("'email' no tiene formato válido."),
];

export const idClienteValidator = [
  param("id")
    .isUUID().withMessage("El parámetro 'id' debe ser un UUID válido."),
];

// ── Usuario del cliente ──────────────────────────────────────
export const crearUsuarioClienteValidator = [
  param("clienteId")
    .isUUID().withMessage("'clienteId' debe ser un UUID válido."),

  body("nombre")
    .notEmpty().withMessage("'nombre' es obligatorio.")
    .isLength({ max: 150 }).withMessage("'nombre' no puede exceder 150 caracteres."),

  body("email")
    .optional({ nullable: true })
    .isEmail().withMessage("'email' no tiene formato válido."),

  body("telefono")
    .optional({ nullable: true })
    .isLength({ max: 20 }).withMessage("'telefono' no puede exceder 20 caracteres."),
];

export const actualizarUsuarioClienteValidator = [
  param("clienteId")
    .isUUID().withMessage("'clienteId' debe ser un UUID válido."),
  param("usuarioId")
    .isUUID().withMessage("'usuarioId' debe ser un UUID válido."),

  body("email")
    .optional({ nullable: true })
    .isEmail().withMessage("'email' no tiene formato válido."),

  body("activo")
    .optional()
    .isBoolean().withMessage("'activo' debe ser true o false."),
];