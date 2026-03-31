export const userDbQuery = (data_to_analyze) => {
  const {
    pregunta,
    historial_reciente   = [],
    archivos_contexto    = [],   
  } = data_to_analyze;

  const historialTexto = historial_reciente.length > 0
    ? historial_reciente
        .map(m => `[${m.rol === "user" ? "Usuario" : "Asistente"}]: ${m.contenido}`)
        .join("\n")
    : null;

  const archivosTexto = archivos_contexto.length > 0
    ? archivos_contexto.join("\n\n")
    : null;

  const partes = [];

  if (historialTexto) {
    partes.push(`MENSAJES ANTERIORES EN ESTA CONVERSACIÓN:\n${historialTexto}`);
  }

  if (archivosTexto) {
    partes.push(
      `ARCHIVOS ADJUNTOS POR EL USUARIO (usa su contenido como contexto para construir filtros más precisos):\n${archivosTexto}`
    );
  }

  partes.push(`SOLICITUD ACTUAL DEL USUARIO:\n${pregunta}`);

  return partes.join("\n\n");
};