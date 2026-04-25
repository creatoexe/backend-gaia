export const userSeguimientoContext = (data_to_analyze) => {
  const { cliente, seguimientos_anteriores = [], seguimiento_nuevo } = data_to_analyze;

  const fmtSeg = (s, idx) => `
[Interacción #${idx + 1}]
Fecha:       ${s.fecha}
Medio:       ${s.medio}
Tipo:        ${s.tipo}
Estado:      ${s.estado}
Consultor:   ${s.consultor?.nombre ?? "No especificado"}
Contacto:    ${s.contacto_cliente?.nombre ?? "No especificado"}
Descripción: ${s.descripcion}
Resultado:   ${s.resultado ?? "Sin resultado registrado"}
Próxima acción: ${s.fecha_proxima_accion ?? "No definida"}
`.trim();

  const historial = [...seguimientos_anteriores, seguimiento_nuevo];
  const bloques   = historial.map((s, i) => fmtSeg(s, i)).join("\n\n---\n\n");

  return `
CLIENTE: ${cliente.empresa}
Estado actual: ${cliente.estado}
Rubro: ${cliente.rubro?.nombre ?? "No especificado"}
País/Ciudad: ${[cliente.ciudad?.nombre, cliente.pais?.nombre].filter(Boolean).join(", ") || "No especificado"}
Referido por: ${cliente.referido_por ?? "No aplica"}

TOTAL DE INTERACCIONES: ${historial.length}

HISTORIAL COMPLETO DE SEGUIMIENTOS:
${bloques}

Genera el contexto acumulado basado en todas estas interacciones.
`.trim();
};