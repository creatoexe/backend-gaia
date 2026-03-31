export const userDbAnswer = (data_to_analyze) => {
  const {
    pregunta_original,
    razon_query,
    query_valida,
    resultados,
    total_filas,
    archivos_contexto = [], 
  } = data_to_analyze;

  const notaArchivos = archivos_contexto.length > 0
    ? `\n\nNOTA: El usuario adjuntó ${archivos_contexto.length} archivo(s). Su contenido fue considerado para interpretar la solicitud. Si la respuesta hace referencia a datos del archivo, menciona brevemente de dónde proviene la información.`
    : "";

  if (!query_valida) {
    return `El usuario preguntó: "${pregunta_original}"\n\nLa solicitud no pudo traducirse a una consulta válida.\nMotivo: ${razon_query}${notaArchivos}\n\nRedacta una respuesta amigable explicando la limitación. Si los archivos adjuntos contienen información útil para responder directamente sin consultar la base de datos, úsalos.`;
  }

  const resumenResultados = total_filas === 0
    ? "La consulta no retornó ningún registro."
    : `La consulta retornó ${total_filas} registro(s).\n\nDATOS:\n${JSON.stringify(resultados, null, 2)}`;

  return `El usuario preguntó: "${pregunta_original}"\nLa consulta buscaba: ${razon_query}\n\n${resumenResultados}${notaArchivos}\n\nRedacta una respuesta clara basada en estos datos.`;
};