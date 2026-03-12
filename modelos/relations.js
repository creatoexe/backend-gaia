import Cliente from "./Cliente.js";
import Consultor from "./Consultor.js";
import Oportunidad from "./Oportunidad.js";

import EtapaLevantamiento from "./EtapaLevantamiento.js";
import EtapaEstimacion from "./EtapaEstimacion.js";
import EtapaPropuesta from "./EtapaPropuesta.js";
import EtapaProyecto from "./EtapaProyecto.js";
import EtapaAprobacion from "./EtapaAprobacion.js";
import Interaccion from "./Interaccion.js";


Cliente.hasMany(Oportunidad,{foreignKey:"cliente_id"});
Oportunidad.belongsTo(Cliente,{foreignKey:"cliente_id"});

Consultor.hasMany(Oportunidad,{foreignKey:"consultor_id"});
Oportunidad.belongsTo(Consultor,{foreignKey:"consultor_id"});

Oportunidad.hasMany(EtapaLevantamiento,{foreignKey:"oportunidad_id"});
EtapaLevantamiento.belongsTo(Oportunidad,{foreignKey:"oportunidad_id"});

Oportunidad.hasMany(EtapaEstimacion,{foreignKey:"oportunidad_id"});
EtapaEstimacion.belongsTo(Oportunidad,{foreignKey:"oportunidad_id"});

Oportunidad.hasMany(EtapaPropuesta,{foreignKey:"oportunidad_id"});
EtapaPropuesta.belongsTo(Oportunidad,{foreignKey:"oportunidad_id"});

Oportunidad.hasMany(EtapaProyecto,{foreignKey:"oportunidad_id"});
EtapaProyecto.belongsTo(Oportunidad,{foreignKey:"oportunidad_id"});

Oportunidad.hasMany(EtapaAprobacion,{foreignKey:"oportunidad_id"});
EtapaAprobacion.belongsTo(Oportunidad,{foreignKey:"oportunidad_id"});

Oportunidad.hasMany(Interaccion,{foreignKey:"oportunidad_id"});
Interaccion.belongsTo(Oportunidad,{foreignKey:"oportunidad_id"});

