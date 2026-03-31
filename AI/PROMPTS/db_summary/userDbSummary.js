export const userDbSummary = (data) => {
  const { historial, resumen_anterior } = data;
  const partes = [];
  if (resumen_anterior) {
    partes.push(`RESUMEN ANTERIOR:\n${resumen_anterior}`);
  }
  partes.push(`CONVERSACIÓN A RESUMIR:\n${historial}`);
  return partes.join("\n\n");
};