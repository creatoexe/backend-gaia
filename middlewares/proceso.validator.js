import { body, param } from "express-validator";

const TIPOS_PROCESO    = ["Automatización", "Consultoría", "Implementación", "Desarrollo", "Integración"];
const ESTATUS_PROCESO  = ["Lead","Contactado","Levantamiento","Estimacion","Propuesta","En Aprobacion","Aprobado","Rechazado","En Ejecución","Cerrado","Stand BY","Facturada"];
const PRIORIDADES      = ["Bajo", "Medio", "Alto", "Muy Alto"];
const TIPOS_INTERACCION = ["Llamada", "Email", "Reunión", "Demo", "WhatsApp"];

export const crearProcesoValidator = [
  param("proyectoId")
    .isUUID().withMessage("'proyectoId' debe ser un UUID válido."),

  body("nombre_proceso")
    .notEmpty().withMessage("'nombre_proceso' es obligatorio.")
    .isLength({ max: 200 }).withMessage("'nombre_proceso' no puede exceder 200 caracteres."),

  body("tipo_proceso")
    .notEmpty().withMessage("'tipo_proceso' es obligatorio.")
    .isIn(TIPOS_PROCESO).withMessage(`'tipo_proceso' debe ser uno de: ${TIPOS_PROCESO.join(", ")}.`),

  body("estatus")
    .optional()
    .isIn(ESTATUS_PROCESO).withMessage(`'estatus' inválido.`),

  body("prioridad")
    .optional({ nullable: true })
    .isIn(PRIORIDADES).withMessage(`'prioridad' debe ser: ${PRIORIDADES.join(", ")}.`),

  body("plazo_inicio")
    .optional({ nullable: true })
    .isISO8601().withMessage("'plazo_inicio' debe ser una fecha ISO 8601 válida."),

  body("herramienta_rpa_id")
    .optional({ nullable: true })
    .isUUID().withMessage("'herramienta_rpa_id' debe ser un UUID válido."),
];

export const actualizarProcesoValidator = [
  param("id").isUUID().withMessage("'id' debe ser un UUID válido."),

  body("tipo_proceso")
    .optional()
    .isIn(TIPOS_PROCESO).withMessage(`'tipo_proceso' inválido.`),

  body("prioridad")
    .optional({ nullable: true })
    .isIn(PRIORIDADES).withMessage(`'prioridad' inválida.`),

  body("herramienta_rpa_id")
    .optional({ nullable: true })
    .isUUID().withMessage("'herramienta_rpa_id' debe ser un UUID válido."),
];

export const cambiarEstatusValidator = [
  param("id").isUUID().withMessage("'id' debe ser un UUID válido."),

  body("estatus")
    .notEmpty().withMessage("'estatus' es obligatorio.")
    .isIn(ESTATUS_PROCESO).withMessage(`'estatus' inválido. Válidos: ${ESTATUS_PROCESO.join(", ")}.`),
];

export const idProcesoValidator = [
  param("id").isUUID().withMessage("'id' debe ser un UUID válido."),
];

// ── Etapas ──────────────────────────────────────────────────

export const levantamientoValidator = [
  param("id").isUUID().withMessage("'id' de proceso debe ser un UUID válido."),

  body("consultor_id")
    .optional({ nullable: true })
    .isUUID().withMessage("'consultor_id' debe ser un UUID válido."),

  body("fecha_levantamiento")
    .optional({ nullable: true })
    .isISO8601().withMessage("'fecha_levantamiento' debe ser una fecha válida."),
];

export const estimacionValidator = [
  param("id").isUUID().withMessage("'id' de proceso debe ser un UUID válido."),

  body("consultor_id")
    .optional({ nullable: true })
    .isUUID().withMessage("'consultor_id' debe ser un UUID válido."),

  body("fecha_estimacion")
    .optional({ nullable: true })
    .isISO8601().withMessage("'fecha_estimacion' debe ser una fecha válida."),
];

export const propuestaValidator = [
  param("id").isUUID().withMessage("'id' de proceso debe ser un UUID válido."),

  body("consultor_id")
    .optional({ nullable: true })
    .isUUID().withMessage("'consultor_id' debe ser un UUID válido."),

  body("valor_presupuestado")
    .optional({ nullable: true })
    .isDecimal({ decimal_digits: "0,2" }).withMessage("'valor_presupuestado' debe ser un número decimal."),

  body("horas_presupuestadas")
    .optional({ nullable: true })
    .isInt({ min: 0 }).withMessage("'horas_presupuestadas' debe ser un entero positivo."),

  body("fecha_entrega_propuesta")
    .optional({ nullable: true })
    .isISO8601().withMessage("'fecha_entrega_propuesta' debe ser una fecha válida."),
];

export const preliminarValidator = [
  param("id").isUUID().withMessage("'id' de proceso debe ser un UUID válido."),

  body("viable")
    .optional({ nullable: true })
    .isBoolean().withMessage("'viable' debe ser true o false."),

  body("fecha_preliminar")
    .optional({ nullable: true })
    .isISO8601().withMessage("'fecha_preliminar' debe ser una fecha válida."),
];

export const aprobacionValidator = [
  param("id").isUUID().withMessage("'id' de proceso debe ser un UUID válido."),

  body("aprobado")
    .notEmpty().withMessage("'aprobado' es obligatorio.")
    .isBoolean().withMessage("'aprobado' debe ser true o false."),

  body("fecha_aprobacion")
    .optional({ nullable: true })
    .isISO8601().withMessage("'fecha_aprobacion' debe ser una fecha válida."),

  body("motivo_rechazo")
    .if(body("aprobado").equals("false"))
    .notEmpty().withMessage("'motivo_rechazo' es obligatorio cuando se rechaza."),

  body("fecha_rechazo")
    .optional({ nullable: true })
    .isISO8601().withMessage("'fecha_rechazo' debe ser una fecha válida."),
];

export const ejecucionValidator = [
  param("id").isUUID().withMessage("'id' de proceso debe ser un UUID válido."),

  body("fecha_inicio")
    .notEmpty().withMessage("'fecha_inicio' es obligatorio.")
    .isISO8601().withMessage("'fecha_inicio' debe ser una fecha válida."),

  body("fecha_fin")
    .optional({ nullable: true })
    .isISO8601().withMessage("'fecha_fin' debe ser una fecha válida."),

  body("horas_reales")
    .optional({ nullable: true })
    .isInt({ min: 0 }).withMessage("'horas_reales' debe ser un entero positivo."),

  body("consultor_responsable_id")
    .optional({ nullable: true })
    .isUUID().withMessage("'consultor_responsable_id' debe ser un UUID válido."),
];

// ── Interacciones ───────────────────────────────────────────

export const crearInteraccionValidator = [
  param("id").isUUID().withMessage("'id' de proceso debe ser un UUID válido."),

  body("consultor_id")
    .notEmpty().withMessage("'consultor_id' es obligatorio.")
    .isUUID().withMessage("'consultor_id' debe ser un UUID válido."),

  body("tipo")
    .optional({ nullable: true })
    .isIn(TIPOS_INTERACCION).withMessage(`'tipo' debe ser: ${TIPOS_INTERACCION.join(", ")}.`),

  body("fecha")
    .notEmpty().withMessage("'fecha' es obligatoria.")
    .isISO8601().withMessage("'fecha' debe ser una fecha ISO 8601 válida."),

  body("descripcion")
    .optional({ nullable: true })
    .isLength({ max: 500 }).withMessage("'descripcion' no puede exceder 500 caracteres."),
];

export const interaccionParamsValidator = [
  param("id")             .isUUID().withMessage("'id' de proceso debe ser un UUID válido."),
  param("interaccionId")  .isUUID().withMessage("'interaccionId' debe ser un UUID válido."),
];