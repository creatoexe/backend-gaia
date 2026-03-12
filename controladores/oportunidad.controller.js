import Oportunidad from "../modelos/Oportunidad.js";
import Cliente from "../modelos/Cliente.js";

import EtapaLevantamiento from "../modelos/EtapaLevantamiento.js";
import EtapaEstimacion from "../modelos/EtapaEstimacion.js";
import EtapaPropuesta from "../modelos/EtapaPropuesta.js";
import EtapaProyecto from "../modelos/EtapaProyecto.js";
import EtapaAprobacion from "../modelos/EtapaAprobacion.js";
import Interaccion from "../modelos/Interaccion.js";

import { Op } from "sequelize";

export const getOportunidades = async (req, res) => {
  try {
    const { estatus, cliente, consultor, fecha } = req.query;

    let where = {};

    if (estatus) where.estatus = estatus;

    if (cliente) where.cliente_id = cliente;

    if (fecha) {
      where.fecha_lead = {
        [Op.gte]: fecha,
      };
    }

    const oportunidades = await Oportunidad.findAll({
      where,

      include: [
        {
          model: Cliente,
        },
      ],
    });

    res.json(oportunidades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOportunidadById = async (req, res) => {
  try {
    const oportunidad = await Oportunidad.findByPk(req.params.id, {
      include: [
        Cliente,
        EtapaLevantamiento,
        EtapaEstimacion,
        EtapaPropuesta,
        EtapaProyecto,
        EtapaAprobacion,
        Interaccion,
      ],
    });

    if (!oportunidad) {
      return res.status(404).json({
        message: "Oportunidad no encontrada",
      });
    }

    res.json(oportunidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createOportunidad = async (req, res) => {
  try {
    const { cliente_id } = req.body;

    const cliente = await Cliente.findByPk(cliente_id);

    if (!cliente) {
      return res.status(404).json({
        message: "Cliente no existe",
      });
    }

    const oportunidad = await Oportunidad.create(req.body);

    res.status(201).json({
      message: "Oportunidad creada",
      oportunidad,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOportunidad = async (req, res) => {
  try {
    const oportunidad = await Oportunidad.findByPk(req.params.id);

    if (!oportunidad) {
      return res.status(404).json({
        message: "Oportunidad no encontrada",
      });
    }

    await oportunidad.update(req.body);

    res.json({
      message: "Oportunidad actualizada",
      oportunidad,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOportunidad = async (req, res) => {
  try {
    const oportunidad = await Oportunidad.findByPk(req.params.id);

    if (!oportunidad) {
      return res.status(404).json({
        message: "Oportunidad no encontrada",
      });
    }

    await oportunidad.destroy();

    res.json({
      message: "Oportunidad eliminada",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
