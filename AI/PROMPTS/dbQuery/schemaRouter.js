const KEYWORDS = {
  clientes:     ['cliente', 'empresa', 'compañia', 'rubro', 'referido', 'precio hora'],
  proyectos:    ['proyecto', 'lead', 'aprobado', 'rechazado', 'ejecuc', 'stand by'],
  procesos:     ['proceso', 'automatizac', 'propuesta', 'estimac', 'levantamiento', 'probabilidad'],
  seguimientos: ['seguimiento', 'contacto', 'llamada', 'reunion', 'whatsapp', 'linkedin'],
  consultores:  ['consultor', 'admin', 'equipo', 'asignado'],
  etapas:       ['etapa', 'horas', 'fecha inicio', 'fecha fin', 'aprobacion', 'ejecucion'],
  herramientas: ['herramienta', 'rpa', 'uipath', 'automation anywhere', 'fabricante', 'bot'],
  licencias:    ['licencia', 'activada', 'desactivada', 'renovacion', 'ip maquina', 'valor anual', 'cod licencia', 'expiracion'],
  soporte:      ['soporte', 'paquete soporte', 'tarifa soporte', 'horario', 'dias soporte', 'motivo rechazo', 'fecha inicio soporte'],
  geografico:   ['pais', 'ciudad', 'region'],
  envio:        ['enviar', 'archivo', 'adjuntar', 'correo', 'email', 'mandar', 'reenviar', 'compartir'],
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
── herramientas_rpa (id UUID, nombre, fabricante, activo BOOL, createdAt, updatedAt)
── asignacion_herramienta (id UUID, proyecto_id, herramienta_rpa_id, cod_licencia, fecha_asignacion, fecha_expiracion, estado ENUM('Activa','Suspendida','Expirada','Revocada'))`,

  licencias: `
── licencias (id UUID, cliente_id→clientes, herramienta_id→herramientas_rpa, estado ENUM('Activada','Desactivada'), fecha_inicio DATE, renovacion ENUM('mensual','anual','2 años','3 años'), valor_anual DECIMAL(12,2), ip_maquina VARCHAR(45), fecha_estado DATE, motivo_desactivacion TEXT, created_by→consultores, updated_by→consultores, createdAt, updatedAt)`,

  soporte: `
── soportes (id UUID, cliente_id→clientes, responsable_cliente_id→usuario_cliente nullable, created_by→consultores, updated_by→consultores, estado ENUM('En Aprobación','Aprobado','Rechazado'), propuesta TEXT, horas INT, tarifa DECIMAL(12,2), valor_paquete DECIMAL(12,2), fecha_inicio DATE, fecha_fin DATE, horario VARCHAR(100), dias JSON, observacion TEXT, fecha_aprobacion DATE, fecha_rechazo DATE, motivo_rechazo TEXT, fecha_inicio_soporte DATE, createdAt, updatedAt)`,

  geografico: `
── paises (id INT, nombre), ciudades (id INT, nombre, pais_id→paises)`,

  envio: `
── ACCIÓN: ENVIAR ARCHIVO A CONSULTOR
   Requiere: consultor_email (de tabla consultores), asunto, mensaje, archivo (adjunto o link)
   La tabla consultores contiene: id, nombre, email.
   No es una consulta SELECT; es una operación de escritura que debe manejarse por endpoint /api/email/enviar-archivo.
   Si el usuario expresa intención de enviar archivo a un consultor, recopila:
     - consultor (nombre o email)
     - asunto (si no lo da, usa "Documento compartido")
     - mensaje (opcional)
     - archivo (si el usuario adjuntó un archivo, se usará esa URL; si no, se puede pedir que lo adjunte)
   `,
};

const RULES = `
REGLAS: Solo SELECT. LIMIT 50. LOWER() para texto. MySQL solo (no PostgreSQL).
Alias: c=clientes,co=consultores,p=proyectos,pr=procesos,uc=usuario_cliente,sc=seguimientos_clientes,s=soportes,l=licencias,h=herramientas_rpa.
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

  if (dominios.has('etapas'))   dominios.add('consultores');
  if (dominios.has('licencias')) dominios.add('herramientas');
  if (dominios.has('soporte'))   dominios.add('clientes');
  if (dominios.has('proyectos') || dominios.has('seguimientos')) dominios.add('clientes');

  const schemaSeleccionado = [...dominios].map(d => SCHEMA_FRAGMENTS[d]).filter(Boolean).join('\n');
  return schemaSeleccionado + '\n' + RULES;
}