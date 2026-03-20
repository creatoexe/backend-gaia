// middlewares/validators/proyecto.validator.js
import { body, param } from "express-validator";

export const crearProyectoValidator = [
  body("cliente_id")
    .notEmpty().withMessage("'cliente_id' es obligatorio.")
    .isUUID().withMessage("'cliente_id' debe ser un UUID válido."),

  body("nombre")
    .notEmpty().withMessage("'nombre' es obligatorio.")
    .isLength({ max: 200 }).withMessage("'nombre' no puede exceder 200 caracteres."),

  body("descripcion")
    .optional({ nullable: true })
    .isString().withMessage("'descripcion' debe ser texto."),

  body("areas")
    .optional()
    .isArray().withMessage("'areas' debe ser un array."),

  body("areas.*")
    .if(body("areas").exists())
    .isUUID().withMessage("Cada elemento de 'areas' debe ser un UUID válido."),
];

export const actualizarProyectoValidator = [
  param("id")
    .isUUID().withMessage("'id' debe ser un UUID válido."),

  body("nombre")
    .optional()
    .notEmpty().withMessage("'nombre' no puede estar vacío.")
    .isLength({ max: 200 }).withMessage("'nombre' no puede exceder 200 caracteres."),

  body("activo")
    .optional()
    .isBoolean().withMessage("'activo' debe ser true o false."),
];

export const idProyectoValidator = [
  param("id").isUUID().withMessage("'id' debe ser un UUID válido."),
];

// ── Áreas ──────────────────────────────────────────────────
export const agregarAreasValidator = [
  param("id")
    .isUUID().withMessage("'id' de proyecto debe ser un UUID válido."),

  body("areas")
    .isArray({ min: 1 }).withMessage("'areas' debe ser un array con al menos un elemento."),

  body("areas.*")
    .isUUID().withMessage("Cada elemento de 'areas' debe ser un UUID válido."),
];

export const areaProyectoValidator = [
  param("id")    .isUUID().withMessage("'id' de proyecto debe ser un UUID válido."),
  param("areaId").isUUID().withMessage("'areaId' debe ser un UUID válido."),
];

// ── Miembros ────────────────────────────────────────────────
export const agregarMiembroValidator = [
  param("id")
    .isUUID().withMessage("'id' de proyecto debe ser un UUID válido."),

  body("usuario_cliente_id")
    .notEmpty().withMessage("'usuario_cliente_id' es obligatorio.")
    .isUUID().withMessage("'usuario_cliente_id' debe ser un UUID válido."),

  body("rol_id")
    .notEmpty().withMessage("'rol_id' es obligatorio.")
    .isUUID().withMessage("'rol_id' debe ser un UUID válido."),
];

export const miembroProyectoValidator = [
  param("id")               .isUUID().withMessage("'id' de proyecto debe ser un UUID válido."),
  param("usuarioClienteId") .isUUID().withMessage("'usuarioClienteId' debe ser un UUID válido."),
];

// ── Herramientas ────────────────────────────────────────────
export const asignarHerramientaValidator = [
  param("id")
    .isUUID().withMessage("'id' de proyecto debe ser un UUID válido."),

  body("herramienta_rpa_id")
    .notEmpty().withMessage("'herramienta_rpa_id' es obligatorio.")
    .isUUID().withMessage("'herramienta_rpa_id' debe ser un UUID válido."),

  body("asignado_por")
    .notEmpty().withMessage("'asignado_por' (consultor) es obligatorio.")
    .isUUID().withMessage("'asignado_por' debe ser un UUID válido."),

  body("fecha_asignacion")
    .optional()
    .isISO8601().withMessage("'fecha_asignacion' debe ser una fecha ISO 8601 válida."),

  body("fecha_expiracion")
    .optional({ nullable: true })
    .isISO8601().withMessage("'fecha_expiracion' debe ser una fecha ISO 8601 válida."),
];

export const estadoHerramientaValidator = [
  param("id")           .isUUID().withMessage("'id' de proyecto debe ser un UUID válido."),
  param("asignacionId") .isUUID().withMessage("'asignacionId' debe ser un UUID válido."),

  body("estado")
    .notEmpty().withMessage("'estado' es obligatorio.")
    .isIn(["Activa", "Suspendida", "Expirada", "Revocada"])
    .withMessage("'estado' debe ser: Activa, Suspendida, Expirada o Revocada."),
];