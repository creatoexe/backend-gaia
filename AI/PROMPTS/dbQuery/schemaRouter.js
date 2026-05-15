const KEYWORDS = {
  clientes:     ['cliente', 'empresa', 'compañia', 'rubro', 'referido', 'precio hora', 'direccion'],
  proyectos:    ['proyecto', 'lead', 'aprobado', 'rechazado', 'ejecuc', 'stand by'],
  procesos:     ['proceso', 'automatizac', 'nombre proceso', 'prioridad', 'solicitud de cambio'],
  seguimientos: ['seguimiento', 'contacto', 'llamada', 'reunion', 'whatsapp', 'linkedin', 'videollamada', 'negociacion'],
  consultores:  ['consultor', 'admin', 'equipo', 'asignado'],
  etapas:       ['etapa', 'horas', 'fecha inicio', 'fecha fin', 'levantamiento', 'estimacion', 'propuesta',
                 'preliminar', 'aprobacion', 'ejecucion', 'cierre', 'facturado', 'rechazado', 'stand_by',
                 'proximos pasos', 'observacion', 'interaccion'],
  herramientas: ['herramienta', 'rpa', 'uipath', 'automation anywhere', 'fabricante', 'bot', 'asignacion herramienta'],
  licencias:    ['licencia', 'activada', 'desactivada', 'renovacion', 'ip maquina', 'valor anual',
                 'cod licencia', 'expiracion', 'fecha estado', 'motivo desactivacion'],
  soporte:      ['soporte', 'paquete soporte', 'tarifa soporte', 'horario', 'dias soporte',
                 'motivo rechazo', 'fecha inicio soporte', 'valor paquete'],
  geografico:   ['pais', 'ciudad', 'region', 'codigo iso'],
  envio:        ['enviar', 'archivo', 'adjuntar', 'correo', 'email', 'mandar', 'reenviar', 'compartir'],
};

const SCHEMA_FRAGMENTS = {
  clientes: `
── clientes (id UUID, empresa VARCHAR(150) UNIQUE, pais_id→paises, ciudad_id→ciudades, direccion VARCHAR(255), rubro_id→rubros, estado_id→estados, referido_por VARCHAR(200), precio_hora_desarrollo DECIMAL, precio_hora_soporte DECIMAL, precio_hora_cambio DECIMAL, porcentaje_gobierno DECIMAL(5,2), nota TEXT, createdAt, updatedAt)
   NOTA: clientes NO tiene campo "nombre"; el nombre de la empresa es "empresa".
── paises (id INT autoincrement, nombre VARCHAR(100) UNIQUE, codigo_iso CHAR(3)) — sin timestamps
── ciudades (id INT autoincrement, nombre VARCHAR(120), pais_id→paises) — sin timestamps
── rubros (id INT autoincrement, nombre VARCHAR(120) UNIQUE, descripcion TEXT) — sin timestamps
── estados (id UUID, nombre VARCHAR UNIQUE, activo BOOL, createdAt, updatedAt)`,

  proyectos: `
── proyectos (id UUID, cliente_id→clientes, nombre VARCHAR, descripcion TEXT, estado_id→estados, activo BOOL, precio_hora_desarrollo DECIMAL(10,2), precio_hora_soporte DECIMAL(10,2), precio_hora_cambio DECIMAL(10,2), porcentaje_gobierno DECIMAL(5,2), createdAt, updatedAt)
── proyecto_area (id UUID, proyecto_id→proyectos, area_id→areas, createdAt, updatedAt)
── areas (id UUID, nombre VARCHAR, descripcion TEXT, activo BOOL, createdAt, updatedAt)
── proyecto_usuario_rol (id UUID, proyecto_id→proyectos, usuario_cliente_id→usuario_cliente, rol_id→roles, fecha_asignacion DATE, activo BOOL, nota TEXT, createdAt, updatedAt)
── roles (id UUID, nombre VARCHAR, descripcion TEXT, activo BOOL, createdAt, updatedAt)
── estado_proyecto (id UUID, proyecto_id→proyectos, consultor_id→consultores, estado_id→estados, observacion TEXT, fecha DATE, createdAt, updatedAt)`,

  procesos: `
── procesos (id UUID, proyecto_id→proyectos, nombre_proceso VARCHAR, tipo ENUM('Proyecto Nuevo','Solicitud de Cambio'), estado_id→estados, prioridad ENUM('Bajo','Medio','Alto','Muy Alto'), fecha_creacion DATE, createdAt, updatedAt)
   NOTA: procesos ya NO tiene herramienta_rpa_id directo ni probabilidad_aprobacion. Las herramientas se vinculan por pivote.
── proceso_herramientas (id UUID, proceso_id→procesos, herramienta_rpa_id→herramientas_rpa) — pivote M:M, sin timestamps
── interaccion (id UUID, proceso_id→procesos, consultor_id→consultores, tipo VARCHAR, descripcion TEXT, fecha DATE) — sin createdAt/updatedAt`,

  seguimientos: `
── seguimientos_clientes (id UUID, cliente_id→clientes, consultor_id→consultores, usuario_cliente_id→usuario_cliente nullable, fecha DATEONLY, fecha_proxima_accion DATEONLY, medio ENUM('email','telefono','videollamada','presencial','whatsapp','linkedin','otro'), tipo ENUM('llamada','reunion','negociacion','contacto','demo','propuesta','seguimiento','otro'), descripcion TEXT, resultado TEXT, estado ENUM('programado','completado','cancelado'), contexto_seguimiento JSON, createdAt, updatedAt)
── usuario_cliente (id UUID, cliente_id→clientes, nombre VARCHAR, email VARCHAR, telefono VARCHAR, linkedin VARCHAR, cargo VARCHAR, activo BOOL, createdAt, updatedAt)`,

  consultores: `
── consultores (id UUID, nombre VARCHAR, email VARCHAR, rol ENUM('consultor','admin'), telefono VARCHAR, activo BOOL, fecha_ingreso DATEONLY, createdAt, updatedAt)`,

  etapas: `
── FLUJO DE ETAPAS POR PROCESO (proceso_id en cada tabla, todas sin timestamps salvo etapa_estimacion):

── etapa_levantamiento (id UUID, proceso_id UNIQUE→procesos, fecha_levantamiento DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ interaccion_levantamiento (id UUID, etapa_levantamiento_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_levantamiento_consultor(etapa_levantamiento_id, consultor_id), interaccion_levantamiento_consultor(interaccion_levantamiento_id, consultor_id)

── etapa_estimacion (id UUID, proceso_id UNIQUE→procesos, fecha_estimacion DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados, volumen_transaccional_mensual INT, tiempo_ejecucion_transaccion DECIMAL, requiere_captcha BOOL, volumen_captcha_mes INT, requiere_ai BOOL, ai_para_que TEXT, ai_nombre VARCHAR, ai_metodo_pago VARCHAR, ai_volumen_mensual_tokens INT, requiere_ocr BOOL, ocr_nombre VARCHAR, ocr_volumen_mensual INT, ocr_costo DECIMAL, requiere_idp BOOL, idp_documentos TEXT, idp_volumen_mensual INT, createdAt, updatedAt) — CON timestamps
   └─ interaccion_estimacion (id UUID, etapa_estimacion_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_estimacion_consultor, interaccion_estimacion_consultor

── etapa_preliminar (id UUID, proceso_id UNIQUE→procesos, fecha_preliminar DATE, resultado VARCHAR, observaciones TEXT, viable BOOL) — sin timestamps, sin estado_id
   └─ pivote: etapa_preliminar_consultor(etapa_preliminar_id, consultor_id)

── etapa_propuesta (id UUID, proceso_id UNIQUE→procesos, nivel_detalle VARCHAR, fecha_entrega_propuesta DATE, horas_presupuestadas INT, valor_presupuestado DECIMAL, horas_gerencia INT, valor_gerencia DECIMAL, observaciones TEXT, estado_id→estados) — sin timestamps
   └─ interaccion_propuesta (id UUID, etapa_propuesta_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_propuesta_consultor, interaccion_propuesta_consultor

── etapa_aprobacion (id UUID, proceso_id UNIQUE→procesos, aprobado BOOL, fecha_aprobacion DATE, motivo_rechazo VARCHAR, fecha_rechazo DATE, observaciones TEXT, estado_id→estados) — sin timestamps
   └─ interaccion_aprobacion (id UUID, etapa_aprobacion_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_aprobacion_consultor, interaccion_aprobacion_consultor

── etapa_aprobado (id UUID, proceso_id UNIQUE→procesos, fecha_aprobado DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ interaccion_aprobado (id UUID, etapa_aprobado_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_aprobado_consultor, interaccion_aprobado_consultor

── etapa_ejecucion (id UUID, proceso_id UNIQUE→procesos, fecha_inicio DATE, fecha_fin DATE, horas_reales INT, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ interaccion_ejecucion (id UUID, etapa_ejecucion_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_ejecucion_consultor, interaccion_ejecucion_consultor

── etapa_cierre (id UUID, proceso_id UNIQUE→procesos, fecha_cierre DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ interaccion_cierre (id UUID, etapa_cierre_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_cierre_consultor, interaccion_cierre_consultor

── etapa_facturado (id UUID, proceso_id UNIQUE→procesos, numero_factura VARCHAR, fecha_factura DATE, valor_facturado DECIMAL, fecha_vencimiento DATE, estado_cobro ENUM('Pendiente','Pagado','Vencido','Anulado'), observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ interaccion_facturado (id UUID, etapa_facturado_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_facturado_consultor, interaccion_facturado_consultor

── etapa_rechazado (id UUID, proceso_id UNIQUE→procesos, fecha_rechazo DATE, motivo_categoria ENUM('Precio','Presupuesto','Competencia','Tiempo','Alcance','Decisión interna','Sin respuesta','Otro'), motivo_detalle TEXT, decision_por VARCHAR, recuperable ENUM('Sí','No','Posiblemente'), fecha_recontacto DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ interaccion_rechazado (id UUID, etapa_rechazado_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_rechazado_consultor, interaccion_rechazado_consultor

── etapa_stand_by (id UUID, proceso_id UNIQUE→procesos, fecha_inicio_pausa DATE, fecha_estimada_retorno DATE, motivo_categoria ENUM('Presupuesto congelado','Decisión pendiente','Cambio interno cliente','Espera técnica','Prioridad baja','Retraso externo','Otro'), motivo_detalle TEXT, decision_por VARCHAR, condicion_reactivar TEXT, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ interaccion_stand_by (id UUID, etapa_stand_by_id, fecha DATE, observaciones TEXT, proximos_pasos TEXT, estado_id→estados) — sin timestamps
   └─ pivotes: etapa_stand_by_consultor, interaccion_stand_by_consultor`,

  herramientas: `
── herramientas_rpa (id UUID, nombre VARCHAR, fabricante VARCHAR, activo BOOL, createdAt, updatedAt)
── asignacion_herramienta (id UUID, proyecto_id→proyectos, herramienta_rpa_id→herramientas_rpa, cod_licencia VARCHAR, fecha_asignacion DATE, fecha_expiracion DATE, estado ENUM('Activa','Suspendida','Expirada','Revocada'), motivo_cambio TEXT, asignado_por→consultores, createdAt, updatedAt)
── proceso_herramientas (id UUID, proceso_id→procesos, herramienta_rpa_id→herramientas_rpa) — pivote M:M, sin timestamps`,

  licencias: `
── licencias (id UUID, cliente_id→clientes, herramienta_id→herramientas_rpa, estado ENUM('Activada','Desactivada'), fecha_inicio DATEONLY, renovacion ENUM('mensual','anual','2 años','3 años'), valor_anual DECIMAL(12,2), ip_maquina VARCHAR(45), fecha_estado DATEONLY, motivo_desactivacion TEXT, created_by→consultores, updated_by→consultores, createdAt, updatedAt)
   NOTA: el FK hacia herramientas es "herramienta_id" (no herramienta_rpa_id).
── licencia_proceso (id UUID, licencia_id→licencias, proceso_id→procesos) — pivote M:M, sin timestamps`,

  soporte: `
── soportes (id UUID, cliente_id→clientes, responsable_cliente_id→usuario_cliente nullable, created_by→consultores, updated_by→consultores, estado ENUM('En Aprobación','Aprobado','Rechazado'), propuesta TEXT, horas INT, tarifa DECIMAL(12,2), valor_paquete DECIMAL(12,2), fecha_inicio DATEONLY, fecha_fin DATEONLY, horario VARCHAR(100), dias JSON, observacion TEXT, fecha_aprobacion DATEONLY, fecha_rechazo DATEONLY, motivo_rechazo TEXT, fecha_inicio_soporte DATEONLY, createdAt, updatedAt)
   NOTA: el campo es "observacion" (sin 's'), no "observaciones".`,

  geografico: `
── paises (id INT autoincrement, nombre VARCHAR(100) UNIQUE, codigo_iso CHAR(3)) — sin timestamps
── ciudades (id INT autoincrement, nombre VARCHAR(120), pais_id→paises) — sin timestamps`,

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
Fechas: NOW(),CURDATE(),DATE_SUB(),DATE_FORMAT().
clientes NO tiene campo "nombre", usa "empresa".
estados.nombre es un VARCHAR (ej: 'Activo', 'Lead', 'En Ejecución'); los FK estado_id son UUID en todas las tablas principales.
procesos NO tiene herramienta_rpa_id directo → usar JOIN proceso_herramientas.
procesos NO tiene probabilidad_aprobacion ni tipo_proceso ni fecha_lead.
licencias: el FK a herramientas es "herramienta_id" (no herramienta_rpa_id).
soportes: el campo de nota es "observacion" (sin 's').
etapa_estimacion es la ÚNICA etapa con createdAt/updatedAt; el resto de etapas e interacciones NO tienen timestamps.
NUNCA expongas: password, token_verificacion, google_token.`;

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

  if (dominios.has('etapas'))    dominios.add('consultores');
  if (dominios.has('etapas'))    dominios.add('procesos');
  if (dominios.has('licencias')) dominios.add('herramientas');
  if (dominios.has('soporte'))   dominios.add('clientes');
  if (dominios.has('proyectos') || dominios.has('seguimientos')) dominios.add('clientes');
  if (dominios.has('procesos'))  dominios.add('proyectos');

  const schemaSeleccionado = [...dominios].map(d => SCHEMA_FRAGMENTS[d]).filter(Boolean).join('\n');
  return schemaSeleccionado + '\n' + RULES;
}