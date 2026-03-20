import { validationResult } from "express-validator";

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      ok:      false,
      mensaje: "Error de validación.",
      errores: errors.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
};

export default handleValidation;