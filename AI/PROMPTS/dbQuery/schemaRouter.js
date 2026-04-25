const KEYWORDS = {
  clientes:   ['cliente', 'empresa', 'compañia', 'rubro', 'referido', 'precio hora'],
  proyectos:  ['proyecto', 'lead', 'aprobado', 'rechazado', 'ejecuc', 'stand by'],
  procesos:   ['proceso', 'automatizac', 'propuesta', 'estimac', 'levantamiento', 'probabilidad'],
  seguimientos: ['seguimiento', 'contacto', 'llamada', 'reunion', 'whatsapp', 'linkedin'],
  consultores: ['consultor', 'admin', 'equipo', 'asignado'],
  etapas:     ['etapa', 'horas', 'fecha inicio', 'fecha fin', 'aprobacion', 'ejecucion'],
  herramientas: ['rpa', 'licencia', 'herramienta', 'uipath', 'automation anywhere'],
  geografico: ['pais', 'ciudad', 'region'],
};

const SCHEMA_FRAGMENTS = {
  clientes: `
── clientes (id UUID, empresa VARCHAR UNIQUE, pais_id→paises, ciudad_id→ciudades, rubro_id→rubros, estado_id→estados, referido_por, precio_hora_desarrollo, precio_hora_soporte, precio_hora_cambio, porcentaje_gobierno, nota)
── paises (id INT, nombre), ciudades (id INT, nombre, pais_id), rubros (id INT, nombre, descripcion)
── estados (id UUID, nombre, activo)`,

  proyectos: `
── proyectos (id UUID, cliente_id→clientes, nombre, estado_actual ENUM('Lead','Pendiente','Contactado','Levantamiento','Estimacion','Propuesta','En Aprobacion','Aprobado','Rechazado','En Ejecución','Cerrado','Stand BY','Facturada'), activo BOOL, precio_hora_*)
── proyecto_area (proyecto_id, area_id), areas (id UUID, nombre)
── proyecto_usuario_rol (proyecto_id, usuario_cliente_id, rol_id), roles (id UUID, nombre)
── estado_proyecto (id UUID, proyecto_id, consultor_id, estado ENUM, observacion, fecha)`,

  procesos: `
── procesos (id UUID, proyecto_id→proyectos, herramienta_rpa_id, nombre_proceso, tipo, tipo_proceso, estatus ENUM('Lead'...'Facturada'), probabilidad_aprobacion VARCHAR→CAST AS DECIMAL, prioridad, plazo_inicio, fecha_lead...fecha_contactado)
── interaccion (id UUID, proceso_id, consultor_id, tipo, descripcion, fecha ← NO createdAt)`,

  etapas: `
── etapa_levantamiento/etapa_preliminar/etapa_propuesta/etapa_aprobacion/etapa_ejecucion (sin timestamps, proceso_id UNIQUE)
── etapa_estimacion (CON createdAt/updatedAt, proceso_id UNIQUE)
── etapa_propuesta agrega: valor_presupuestado DECIMAL, horas_presupuestadas INT
── etapa_ejecucion agrega: fecha_inicio DATE, fecha_fin, horas_reales INT
── Pivotes: etapa_*_consultor (etapa_*_id, consultor_id)`,

  seguimientos: `
── seguimientos_clientes (id UUID, cliente_id, consultor_id, usuario_cliente_id nullable, fecha DATE, fecha_proxima_accion, medio ENUM, tipo ENUM, descripcion TEXT, resultado, estado ENUM, contexto_seguimiento JSON)
── usuario_cliente (id UUID, cliente_id, nombre, email, telefono, cargo, activo)`,

  consultores: `
── consultores (id UUID, nombre, email, rol ENUM('consultor','admin'), telefono, activo, fecha_ingreso)`,

  herramientas: `
── herramientas_rpa (id UUID, nombre, fabricante, activo)
── asignacion_herramienta (id UUID, proyecto_id, herramienta_rpa_id, cod_licencia, fecha_asignacion, fecha_expiracion, estado ENUM('Activa','Suspendida','Expirada','Revocada'))`,

  geografico: `
── paises (id INT, nombre), ciudades (id INT, nombre, pais_id→paises)`,
};

const RULES = `
REGLAS: Solo SELECT. LIMIT 50. LOWER() para texto. MySQL solo (no PostgreSQL).
Alias: c=clientes,co=consultores,p=proyectos,pr=procesos,uc=usuario_cliente,sc=seguimientos_clientes.
Fechas: NOW(),CURDATE(),DATE_SUB(),DATE_FORMAT(). probabilidad_aprobacion=VARCHAR→CAST AS DECIMAL.
clientes NO tiene campo "nombre", usa "empresa".
NUNCA expongas: password, token_verificacion.`;

export function resolveSchemaFragments(pregunta, historial = []) {
  const texto = (pregunta + ' ' + historial.map(m => m.contenido).join(' ')).toLowerCase();
  
  const dominios = new Set();
  for (const [dominio, keywords] of Object.entries(KEYWORDS)) {
    if (keywords.some(k => texto.includes(k))) {
      dominios.add(dominio);
    }
  }

  if (dominios.size === 0 || dominios.size >= 5) {
    return Object.values(SCHEMA_FRAGMENTS).join('\n') + '\n' + RULES;
  }
  if (dominios.has('etapas')) dominios.add('consultores');
  // Siempre incluir clientes si hay proyectos o seguimientos
  if (dominios.has('proyectos') || dominios.has('seguimientos')) dominios.add('clientes');

  const schemaSeleccionado = [...dominios].map(d => SCHEMA_FRAGMENTS[d]).join('\n');
  return schemaSeleccionado + '\n' + RULES;
}