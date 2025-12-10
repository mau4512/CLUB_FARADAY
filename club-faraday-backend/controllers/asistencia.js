const { Op } = require('sequelize');
const Asistencia = require('../models/asistencia');
const Deportista = require('../models/deportista');
const Categoria = require('../models/categoria');

const listarAsistencias = async (req, res) => {
  const { deportistaId, fechaInicio, fechaFin } = req.query;
  const where = {};

  if (deportistaId) {
    where.deportistaId = deportistaId;
  }

  if (fechaInicio || fechaFin) {
    where.fecha = {};
    if (fechaInicio) {
      where.fecha[Op.gte] = fechaInicio;
    }
    if (fechaFin) {
      where.fecha[Op.lte] = fechaFin;
    }
  }

  try {
    const asistencias = await Asistencia.findAll({
      where,
      include: [
        {
          model: Deportista,
          as: 'deportista',
          attributes: ['id', 'nombres', 'apellidos'],
          include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre', 'anioDesde', 'anioHasta'] }]
        }
      ],
      order: [['fecha', 'DESC']]
    });
    res.json(asistencias);
  } catch (error) {
    console.error('Error al listar asistencias:', error);
    res.status(500).json({ error: 'No se pudieron obtener las asistencias' });
  }
};

const registrarAsistencia = async (req, res) => {
  const { deportistaId, fecha, estado, observaciones } = req.body;

  if (!deportistaId || !fecha || !estado) {
    return res.status(400).json({ error: 'deportistaId, fecha y estado son obligatorios' });
  }

  const estadosPermitidos = ['asistio', 'falta', 'justificado'];
  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({ error: `estado debe ser uno de: ${estadosPermitidos.join(', ')}` });
  }

  try {
    const asistencia = await Asistencia.create({
      deportistaId,
      fecha,
      estado,
      observaciones
    });

    const asistenciaCompleta = await Asistencia.findByPk(asistencia.id, {
      include: [
        {
          model: Deportista,
          as: 'deportista',
          attributes: ['id', 'nombres', 'apellidos'],
          include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre', 'anioDesde', 'anioHasta'] }]
        }
      ]
    });

    res.status(201).json(asistenciaCompleta);
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
    res.status(500).json({ error: 'No se pudo registrar la asistencia', detalle: error.message });
  }
};

module.exports = {
  listarAsistencias,
  registrarAsistencia
};
