import multer from "multer";

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.xlsx', '.png', '.jpg', '.jpeg', '.webp', '.gif'];
const IMAGE_EXTENSIONS   = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ext = `.${file.originalname.split('.').pop().toLowerCase()}`;
    cb(null, ALLOWED_EXTENSIONS.includes(ext));
  },
});

export const uploadMiddleware = (req, res, next) => {
  upload.array("archivos", 5)(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          ok: false,
          mensaje: `El archivo excede el tamaño máximo permitido (50 MB).`,
        });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          ok: false,
          mensaje: "Campo de archivo inesperado. Usa el campo 'archivos'.",
        });
      }
      return res.status(400).json({
        ok: false,
        mensaje: `Error al procesar archivos: ${err.message}`,
      });
    }
    next();
  });
};

export { IMAGE_EXTENSIONS, ALLOWED_EXTENSIONS };