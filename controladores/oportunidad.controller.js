import Oportunidad from "../modelos/Oportunidad.js";
import Cliente from "../modelos/Cliente.js";

import EtapaLevantamiento from "../modelos/EtapaLevantamiento.js";
import EtapaEstimacion from "../modelos/EtapaEstimacion.js";
import EtapaPropuesta from "../modelos/EtapaPropuesta.js";
import EtapaProyecto from "../modelos/EtapaProyecto.js";
import EtapaAprobacion from "../modelos/EtapaAprobacion.js";
import Interaccion from "../modelos/Interaccion.js";

import {Op} from "sequelize";


export const getOportunidades = async(req,res)=>{

const {estatus,cliente,consultor,fecha} = req.query;

let where={};

if(estatus) where.estatus=estatus;
if(cliente) where.cliente_id=cliente;

if(fecha){
where.fecha_lead={
[Op.gte]:fecha
};
}

const oportunidades = await Oportunidad.findAll({
where,
include:[Cliente]
});

res.json(oportunidades);

};


export const getOportunidadById = async(req,res)=>{

const oportunidad = await Oportunidad.findByPk(req.params.id,{
include:[
Cliente,
EtapaLevantamiento,
EtapaEstimacion,
EtapaPropuesta,
EtapaProyecto,
EtapaAprobacion,
Interaccion
]
});

res.json(oportunidad);

};


export const createOportunidad = async(req,res)=>{

const oportunidad = await Oportunidad.create(req.body);

res.json(oportunidad);

};


export const updateOportunidad = async(req,res)=>{

const oportunidad = await Oportunidad.findByPk(req.params.id);

await oportunidad.update(req.body);

res.json(oportunidad);

};


export const deleteOportunidad = async(req,res)=>{

const oportunidad = await Oportunidad.findByPk(req.params.id);

await oportunidad.destroy();

res.json({message:"Eliminado"});

};