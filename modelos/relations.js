import { Area }                   from "./Area.js";
import { AsignacionHerramientas } from "./AsignacionHerramientas.js";
import { Cliente }                from "./Cliente.js";
import { Consultor }              from "./Consultor.js";
import { EtapaAprobacion }        from "./EtapaAprobacion.js";
import { EtapaEjecucion }         from "./EtapaEjecucion.js";
import { EtapaEstimacion }        from "./EtapaEstimacion.js";
import { EtapaLevantamiento }     from "./EtapaLevantamiento.js";
import { EtapaPreliminar }        from "./EtapaPreliminar.js";
import { EtapaPropuesta }         from "./EtapaPropuesta.js";
import { EstadoProyecto }         from "./EstadoProyecto.js";
import { HerramientaRpa }         from "./HerramientaRpa.js";
import { Interaccion }            from "./Interaccion.js";
import { Proceso }                from "./Proceso.js";
import { Proyecto }               from "./Proyecto.js";
import { ProyectoArea }           from "./ProyectoArea.js";
import { ProyectoUsuarioRol }     from "./ProyectoUsuarioRol.js";
import { Rol }                    from "./Rol.js";
import { UsuarioCliente }         from "./UsuarioCliente.js";
import { EtapaLevantamientoConsultor } from "./EtapaLevantamientoConsultor.js";
import { EtapaEstimacionConsultor }    from "./EtapaEstimacionConsultor.js";
import { EtapaPropuestaConsultor }     from "./EtapaPropuestaConsultor.js";
import { EtapaEjecucionConsultor }     from "./EtapaEjecucionConsultor.js";
import { EtapaAprobacionConsultor }    from "./EtapaAprobacionConsultor.js";
import { EtapaPreliminarConsultor }    from "./EtapaPreliminarConsultor.js";
import { Chat }         from "./Chat.js";
import { ContextoChat } from "./ContextoChat.js";
import { Mensaje }      from "./Mensajes.js";
import User             from "./User.js";
import { Pais }               from "./Pais.js";
import { Ciudad }             from "./Ciudad.js";
import { Rubro }              from "./Rubro.js";
import { SeguimientoCliente } from "./SeguimientoCliente.js";
import { Estados }             from "./Estados.js";
// ─────────────────────────────────────────────────────────
// CLIENTE  →  PROYECTOS / USUARIOS
// ─────────────────────────────────────────────────────────
Cliente.hasMany(Proyecto,       { foreignKey: "cliente_id", as: "proyectos", onDelete: "CASCADE" });
Cliente.hasMany(UsuarioCliente, { foreignKey: "cliente_id", as: "usuarios",  onDelete: "CASCADE" });

Proyecto.belongsTo(Cliente,       { foreignKey: "cliente_id", as: "cliente" });
UsuarioCliente.belongsTo(Cliente, { foreignKey: "cliente_id", as: "cliente" });

// ─────────────────────────────────────────────────────────
// PROYECTO  ↔  ÁREA  (N:M)
// ─────────────────────────────────────────────────────────
Proyecto.belongsToMany(Area, {
  through: ProyectoArea, foreignKey: "proyecto_id", otherKey: "area_id", as: "areas",
});
Area.belongsToMany(Proyecto, {
  through: ProyectoArea, foreignKey: "area_id", otherKey: "proyecto_id", as: "proyectos",
});
ProyectoArea.belongsTo(Proyecto, { foreignKey: "proyecto_id" });
ProyectoArea.belongsTo(Area,     { foreignKey: "area_id"     });

// ─────────────────────────────────────────────────────────
// PROYECTO  ↔  USUARIO_CLIENTE  ↔  ROL  (N:M)
// ─────────────────────────────────────────────────────────
Proyecto.belongsToMany(UsuarioCliente, {
  through: ProyectoUsuarioRol, foreignKey: "proyecto_id", otherKey: "usuario_cliente_id", as: "miembros",
});
UsuarioCliente.belongsToMany(Proyecto, {
  through: ProyectoUsuarioRol, foreignKey: "usuario_cliente_id", otherKey: "proyecto_id", as: "proyectos",
});
ProyectoUsuarioRol.belongsTo(Proyecto,       { foreignKey: "proyecto_id"         });
ProyectoUsuarioRol.belongsTo(UsuarioCliente, { foreignKey: "usuario_cliente_id", as: "usuario" });
ProyectoUsuarioRol.belongsTo(Rol,            { foreignKey: "rol_id",             as: "rol"     });
Rol.hasMany(ProyectoUsuarioRol,              { foreignKey: "rol_id" });

// ─────────────────────────────────────────────────────────
// HERRAMIENTA RPA
// ─────────────────────────────────────────────────────────
HerramientaRpa.hasMany(AsignacionHerramientas, { foreignKey: "herramienta_rpa_id", as: "asignaciones" });
HerramientaRpa.hasMany(Proceso,                { foreignKey: "herramienta_rpa_id", as: "procesos"     });

AsignacionHerramientas.belongsTo(HerramientaRpa, { foreignKey: "herramienta_rpa_id", as: "herramienta"  });
AsignacionHerramientas.belongsTo(Proyecto,        { foreignKey: "proyecto_id",        as: "proyecto"    });
AsignacionHerramientas.belongsTo(Consultor,       { foreignKey: "asignado_por",        as: "asignadoPor" });

Proyecto.hasMany(AsignacionHerramientas, { foreignKey: "proyecto_id", as: "herramientas", onDelete: "CASCADE" });

// ─────────────────────────────────────────────────────────
// PROYECTO  →  LÍNEA DE TIEMPO DE ESTADOS
// ─────────────────────────────────────────────────────────
Proyecto.hasMany(EstadoProyecto,    { foreignKey: "proyecto_id",  as: "historial_estados", onDelete: "CASCADE" });
EstadoProyecto.belongsTo(Proyecto,  { foreignKey: "proyecto_id"  });
EstadoProyecto.belongsTo(Consultor, { foreignKey: "consultor_id", as: "consultor" });
Consultor.hasMany(EstadoProyecto,   { foreignKey: "consultor_id" });

// ─────────────────────────────────────────────────────────
// PROYECTO  →  PROCESOS
// ─────────────────────────────────────────────────────────
Proyecto.hasMany(Proceso, { foreignKey: "proyecto_id", as: "procesos", onDelete: "CASCADE" });
Proceso.belongsTo(Proyecto,       { foreignKey: "proyecto_id",        as: "proyecto"   });
Proceso.belongsTo(HerramientaRpa, { foreignKey: "herramienta_rpa_id", as: "herramienta" });

// ─────────────────────────────────────────────────────────
// PROCESO  →  ETAPAS  (1:1 cada una)
// ─────────────────────────────────────────────────────────
Proceso.hasOne(EtapaLevantamiento, { foreignKey: "proceso_id", as: "levantamiento", onDelete: "CASCADE" });
Proceso.hasOne(EtapaEstimacion,    { foreignKey: "proceso_id", as: "estimacion",    onDelete: "CASCADE" });
Proceso.hasOne(EtapaPropuesta,     { foreignKey: "proceso_id", as: "propuesta",     onDelete: "CASCADE" });
Proceso.hasOne(EtapaPreliminar,    { foreignKey: "proceso_id", as: "preliminar",    onDelete: "CASCADE" });
Proceso.hasOne(EtapaAprobacion,    { foreignKey: "proceso_id", as: "aprobacion",    onDelete: "CASCADE" });
Proceso.hasOne(EtapaEjecucion,     { foreignKey: "proceso_id", as: "ejecucion",     onDelete: "CASCADE" });

EtapaLevantamiento.belongsTo(Proceso, { foreignKey: "proceso_id" });
EtapaEstimacion.belongsTo(Proceso,    { foreignKey: "proceso_id" });
EtapaPropuesta.belongsTo(Proceso,     { foreignKey: "proceso_id" });
EtapaPreliminar.belongsTo(Proceso,    { foreignKey: "proceso_id" });
EtapaAprobacion.belongsTo(Proceso,    { foreignKey: "proceso_id" });
EtapaEjecucion.belongsTo(Proceso,     { foreignKey: "proceso_id" });

// ─────────────────────────────────────────────────────────
// ETAPAS  ↔  CONSULTORES  (N:M)
// ─────────────────────────────────────────────────────────

// LEVANTAMIENTO
EtapaLevantamiento.belongsToMany(Consultor, {
  through: EtapaLevantamientoConsultor, foreignKey: "etapa_levantamiento_id",
  otherKey: "consultor_id", as: "consultores", uniqueKey: "uniq_lev_cons"
});
Consultor.belongsToMany(EtapaLevantamiento, {
  through: EtapaLevantamientoConsultor, foreignKey: "consultor_id",
  otherKey: "etapa_levantamiento_id", as: "levantamientos", uniqueKey: "uniq_lev_cons"
});

// ESTIMACIÓN
EtapaEstimacion.belongsToMany(Consultor, {
  through: EtapaEstimacionConsultor, foreignKey: "etapa_estimacion_id",
  otherKey: "consultor_id", as: "consultores", uniqueKey: "uniq_est_cons"
});
Consultor.belongsToMany(EtapaEstimacion, {
  through: EtapaEstimacionConsultor, foreignKey: "consultor_id",
  otherKey: "etapa_estimacion_id", as: "estimaciones", uniqueKey: "uniq_est_cons"
});

// PROPUESTA
EtapaPropuesta.belongsToMany(Consultor, {
  through: EtapaPropuestaConsultor, foreignKey: "etapa_propuesta_id",
  otherKey: "consultor_id", as: "consultores", uniqueKey: "uniq_prop_cons"
});
Consultor.belongsToMany(EtapaPropuesta, {
  through: EtapaPropuestaConsultor, foreignKey: "consultor_id",
  otherKey: "etapa_propuesta_id", as: "propuestas", uniqueKey: "uniq_prop_cons"
});

// EJECUCIÓN
EtapaEjecucion.belongsToMany(Consultor, {
  through: EtapaEjecucionConsultor, foreignKey: "etapa_ejecucion_id",
  otherKey: "consultor_id", as: "consultores", uniqueKey: "uniq_ejec_cons"
});
Consultor.belongsToMany(EtapaEjecucion, {
  through: EtapaEjecucionConsultor, foreignKey: "consultor_id",
  otherKey: "etapa_ejecucion_id", as: "ejecuciones", uniqueKey: "uniq_ejec_cons"
});

// APROBACIÓN
EtapaAprobacion.belongsToMany(Consultor, {
  through: EtapaAprobacionConsultor, foreignKey: "etapa_aprobacion_id",
  otherKey: "consultor_id", as: "consultores", uniqueKey: "uniq_aprob_cons"
});
Consultor.belongsToMany(EtapaAprobacion, {
  through: EtapaAprobacionConsultor, foreignKey: "consultor_id",
  otherKey: "etapa_aprobacion_id", as: "aprobaciones", uniqueKey: "uniq_aprob_cons"
});

// PRELIMINAR
EtapaPreliminar.belongsToMany(Consultor, {
  through: EtapaPreliminarConsultor, foreignKey: "etapa_preliminar_id",
  otherKey: "consultor_id", as: "consultores", uniqueKey: "uniq_prel_cons"
});
Consultor.belongsToMany(EtapaPreliminar, {
  through: EtapaPreliminarConsultor, foreignKey: "consultor_id",
  otherKey: "etapa_preliminar_id", as: "preliminares", uniqueKey: "uniq_prel_cons"
});

// ─────────────────────────────────────────────────────────
// PROCESO  →  INTERACCIONES  (1:N)
// ─────────────────────────────────────────────────────────
Proceso.hasMany(Interaccion,     { foreignKey: "proceso_id",   as: "interacciones", onDelete: "CASCADE" });
Interaccion.belongsTo(Proceso,   { foreignKey: "proceso_id"   });
Interaccion.belongsTo(Consultor, { foreignKey: "consultor_id", as: "consultor" });
Consultor.hasMany(Interaccion,   { foreignKey: "consultor_id", as: "interacciones" });

// ─────────────────────────────────────────────────────────
// CHAT  →  MENSAJES  →  CONTEXTO  (asociado a User)
// ─────────────────────────────────────────────────────────
User.hasMany(Chat,   { foreignKey: "user_id", as: "chats", onDelete: "CASCADE" });
Chat.belongsTo(User, { foreignKey: "user_id", as: "user" });

Chat.hasMany(Mensaje,    { foreignKey: "chat_id", as: "mensajes", onDelete: "CASCADE" });
Mensaje.belongsTo(Chat,  { foreignKey: "chat_id", as: "chat" });

Chat.hasOne(ContextoChat,    { foreignKey: "chat_id", as: "contexto", onDelete: "CASCADE" });
ContextoChat.belongsTo(Chat, { foreignKey: "chat_id", as: "chat" });

// ─── Pais → Ciudad ──────────────────────────────────────────
Pais.hasMany(Ciudad,   { foreignKey: "pais_id", as: "ciudades" });
Ciudad.belongsTo(Pais, { foreignKey: "pais_id", as: "pais"     });

// ─── Cliente → Pais / Ciudad / Rubro ────────────────────────
Cliente.belongsTo(Pais,   { foreignKey: "pais_id",    as: "pais"   });
Cliente.belongsTo(Ciudad, { foreignKey: "ciudad_id",  as: "ciudad" });
Cliente.belongsTo(Rubro,  { foreignKey: "rubro_id",   as: "rubro"  });

// ─── Cliente → Seguimientos ──────────────────────────────────
Cliente.hasMany(SeguimientoCliente, {
  foreignKey: "cliente_id", as: "seguimientos", onDelete: "CASCADE",
});
SeguimientoCliente.belongsTo(Cliente,       { foreignKey: "cliente_id" });
SeguimientoCliente.belongsTo(Consultor,     { foreignKey: "consultor_id",      as: "consultor"      });
SeguimientoCliente.belongsTo(UsuarioCliente,{ foreignKey: "usuario_cliente_id", as: "contacto_cliente" });

// ─── Estados → Cliente / Proyecto / Proceso / EstadoProyecto ─
Cliente.belongsTo(Estados,       { foreignKey: "estado_id", as: "estadoObj" });
Estados.hasMany(Cliente,         { foreignKey: "estado_id" });

Proyecto.belongsTo(Estados,      { foreignKey: "estado_id", as: "estadoObj" });
Estados.hasMany(Proyecto,        { foreignKey: "estado_id" });

Proceso.belongsTo(Estados,       { foreignKey: "estado_id", as: "estadoObj" });
Estados.hasMany(Proceso,         { foreignKey: "estado_id" });

EstadoProyecto.belongsTo(Estados,{ foreignKey: "estado_id", as: "estadoObj" });
Estados.hasMany(EstadoProyecto,  { foreignKey: "estado_id" });

export {
  Area,
  AsignacionHerramientas,
  Cliente,
  Consultor,
  EtapaAprobacion,
  EtapaEjecucion,
  EtapaEstimacion,
  EtapaLevantamiento,
  EtapaPreliminar,
  EtapaPropuesta,
  EstadoProyecto,
  HerramientaRpa,
  Interaccion,
  Proceso,
  Proyecto,
  ProyectoArea,
  ProyectoUsuarioRol,
  Rol,
  UsuarioCliente,
  EtapaLevantamientoConsultor,
  EtapaEstimacionConsultor,
  EtapaPropuestaConsultor,
  EtapaEjecucionConsultor,
  EtapaAprobacionConsultor,
  EtapaPreliminarConsultor,
  Chat,
  Mensaje,
  ContextoChat,
  User,
  Pais,
  Ciudad,
  Rubro,
  SeguimientoCliente,
  Estados,
};
