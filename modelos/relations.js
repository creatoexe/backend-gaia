// ============================================================
// modelos/relations.js
// Todas las asociaciones Sequelize — importar UNA sola vez en index.js
// ============================================================

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

// ─────────────────────────────────────────────────────────
// CLIENTE  →  PROYECTOS / USUARIOS
// ─────────────────────────────────────────────────────────
Cliente.hasMany(Proyecto,       { foreignKey: "cliente_id", as: "proyectos",  onDelete: "CASCADE" });
Cliente.hasMany(UsuarioCliente, { foreignKey: "cliente_id", as: "usuarios",   onDelete: "CASCADE" });

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
ProyectoArea.belongsTo(Area,     { foreignKey: "area_id" });

// ─────────────────────────────────────────────────────────
// PROYECTO  ↔  USUARIO_CLIENTE  ↔  ROL  (N:M con metadata)
// ─────────────────────────────────────────────────────────
Proyecto.belongsToMany(UsuarioCliente, {
  through: ProyectoUsuarioRol, foreignKey: "proyecto_id", otherKey: "usuario_cliente_id", as: "miembros",
});
UsuarioCliente.belongsToMany(Proyecto, {
  through: ProyectoUsuarioRol, foreignKey: "usuario_cliente_id", otherKey: "proyecto_id", as: "proyectos",
});
ProyectoUsuarioRol.belongsTo(Proyecto,       { foreignKey: "proyecto_id" });
ProyectoUsuarioRol.belongsTo(UsuarioCliente, { foreignKey: "usuario_cliente_id", as: "usuario" });
ProyectoUsuarioRol.belongsTo(Rol,            { foreignKey: "rol_id",             as: "rol" });
Rol.hasMany(ProyectoUsuarioRol,              { foreignKey: "rol_id" });

// ─────────────────────────────────────────────────────────
// HERRAMIENTA RPA
// ─────────────────────────────────────────────────────────
HerramientaRpa.hasMany(AsignacionHerramientas, { foreignKey: "herramienta_rpa_id", as: "asignaciones" });
HerramientaRpa.hasMany(Proceso,                { foreignKey: "herramienta_rpa_id", as: "procesos"     });

AsignacionHerramientas.belongsTo(HerramientaRpa, { foreignKey: "herramienta_rpa_id", as: "herramienta" });
AsignacionHerramientas.belongsTo(Proyecto,        { foreignKey: "proyecto_id",        as: "proyecto"   });
AsignacionHerramientas.belongsTo(Consultor,       { foreignKey: "asignado_por",        as: "asignadoPor"});

Proyecto.hasMany(AsignacionHerramientas, { foreignKey: "proyecto_id", as: "herramientas", onDelete: "CASCADE" });

// ─────────────────────────────────────────────────────────
// PROYECTO  →  LÍNEA DE TIEMPO DE ESTADOS
// ─────────────────────────────────────────────────────────
Proyecto.hasMany(EstadoProyecto,       { foreignKey: "proyecto_id", as: "historial_estados", onDelete: "CASCADE" });
EstadoProyecto.belongsTo(Proyecto,     { foreignKey: "proyecto_id" });
EstadoProyecto.belongsTo(Consultor,    { foreignKey: "consultor_id", as: "consultor" });
Consultor.hasMany(EstadoProyecto,      { foreignKey: "consultor_id" });

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

// Consultor responsable por etapa
EtapaLevantamiento.belongsTo(Consultor, { foreignKey: "consultor_id", as: "consultor" });
EtapaEstimacion.belongsTo(Consultor,    { foreignKey: "consultor_id", as: "consultor" });
EtapaPropuesta.belongsTo(Consultor,     { foreignKey: "consultor_id", as: "consultor" });
EtapaEjecucion.belongsTo(Consultor,     { foreignKey: "consultor_responsable_id", as: "consultor" });

// ─────────────────────────────────────────────────────────
// PROCESO  →  INTERACCIONES  (1:N)
// ─────────────────────────────────────────────────────────
Proceso.hasMany(Interaccion,     { foreignKey: "proceso_id",   as: "interacciones", onDelete: "CASCADE" });
Interaccion.belongsTo(Proceso,   { foreignKey: "proceso_id"   });
Interaccion.belongsTo(Consultor, { foreignKey: "consultor_id", as: "consultor" });
Consultor.hasMany(Interaccion,   { foreignKey: "consultor_id", as: "interacciones" });

// ─────────────────────────────────────────────────────────
// EXPORTAR — punto único de acceso a modelos
// ─────────────────────────────────────────────────────────
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
};