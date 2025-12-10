const Asignacion = require('../models/asignacion');
const Usuario = require('../models/usuario');
const Horario = require('../models/horario');
const Categoria = require('../models/categoria');

const listarAsignaciones = async (req, res) => {
  const { entrenadorId } = req.query;
  const filtros = {};
  if (entrenadorId) {
    filtros.entrenadorId = entrenadorId;
  }

  try {
    const asignaciones = await Asignacion.findAll({
      where: filtros,
      include: [
        { model: Usuario, as: 'entrenador', attributes: ['id', 'nombre', 'correo'] },
        {
          model: Horario,
          as: 'horario',
          include: [{ model: Categoria, as: 'categorias', attributes: ['id', 'nombre'], through: { attributes: [] } }]
        }
      ],
      order: [['id', 'DESC']]
    });
    res.json(asignaciones);
  } catch (error) {
    console.error('Error al listar asignaciones:', error);
    res.status(500).json({ error: 'No se pudieron obtener las asignaciones' });
  }
};

const crearAsignacion = async (req, res) => {
  const { entrenadorId, horarioId, nombreGrupo, activo = true } = req.body;

  if (!entrenadorId || !horarioId) {
    return res.status(400).json({ error: 'entrenadorId y horarioId son obligatorios' });
  }

  const horario = await Horario.findByPk(horarioId, {
    include: [{ model: Categoria, as: 'categorias', attributes: ['id'], through: { attributes: [] } }]
  });
  if (!horario) {
    return res.status(400).json({ error: 'El horario seleccionado no existe' });
  }

  try {
    const asignacion = await Asignacion.create({
      entrenadorId,
      horarioId,
      nombreGrupo,
      activo
    });

    const completa = await Asignacion.findByPk(asignacion.id, {
      include: [
        { model: Usuario, as: 'entrenador', attributes: ['id', 'nombre', 'correo'] },
        {
          model: Horario,
          as: 'horario',
          include: [{ model: Categoria, as: 'categorias', attributes: ['id', 'nombre'], through: { attributes: [] } }]
        }
      ]
    });

    res.status(201).json(completa);
  } catch (error) {
    console.error('Error al crear asignación:', error);
    res.status(500).json({ error: 'No se pudo crear la asignación', detalle: error.message });
  }
};

const actualizarAsignacion = async (req, res) => {
  const { id } = req.params;
  const { entrenadorId, horarioId, nombreGrupo, activo } = req.body;

  if (!entrenadorId || !horarioId) {
    return res.status(400).json({ error: 'entrenadorId y horarioId son obligatorios' });
  }

  const horario = await Horario.findByPk(horarioId, {
    include: [{ model: Categoria, as: 'categorias', attributes: ['id'], through: { attributes: [] } }]
  });
  if (!horario) {
    return res.status(400).json({ error: 'El horario seleccionado no existe' });
  }

  try {
    const asignacion = await Asignacion.findByPk(id);
    if (!asignacion) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }

    await asignacion.update({
      entrenadorId,
      horarioId,
      nombreGrupo,
      activo
    });

    const completa = await Asignacion.findByPk(asignacion.id, {
      include: [
        { model: Usuario, as: 'entrenador', attributes: ['id', 'nombre', 'correo'] },
        {
          model: Horario,
          as: 'horario',
          include: [{ model: Categoria, as: 'categorias', attributes: ['id', 'nombre'], through: { attributes: [] } }]
        }
      ]
    });

    res.json(completa);
  } catch (error) {
    console.error('Error al actualizar asignación:', error);
    res.status(500).json({ error: 'No se pudo actualizar la asignación', detalle: error.message });
  }
};

module.exports = {
  listarAsignaciones,
  crearAsignacion,
  actualizarAsignacion
};
