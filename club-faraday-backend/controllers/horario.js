const Horario = require('../models/horario');
const HorarioCategoria = require('../models/horarioCategoria');
const Categoria = require('../models/categoria');
const Sede = require('../models/sede');

const listarHorarios = async (_req, res) => {
  try {
    const horarios = await Horario.findAll({
      include: [
        { model: Sede, as: 'sede', attributes: ['id', 'nombre'] },
        { model: Categoria, as: 'categorias', attributes: ['id', 'nombre'], through: { attributes: [] } }
      ],
      order: [['nombre', 'ASC']]
    });
    res.json(horarios);
  } catch (error) {
    console.error('Error al listar horarios:', error);
    res.status(500).json({ error: 'No se pudieron obtener los horarios' });
  }
};

const crearHorario = async (req, res) => {
  const {
    nombre,
    sedeId,
    temporada,
    fechaInicio,
    fechaFin,
    diasSemana,
    horaInicio,
    horaFin,
    categoriaIds = []
  } = req.body;

  if (!nombre || !sedeId || !diasSemana || !horaInicio || !horaFin) {
    return res.status(400).json({ error: 'nombre, sedeId, diasSemana, horaInicio y horaFin son obligatorios' });
  }

  try {
    const horario = await Horario.create({
      nombre,
      sedeId,
      temporada,
      fechaInicio,
      fechaFin,
      diasSemana,
      horaInicio,
      horaFin
    });
    if (categoriaIds.length) {
      const registros = categoriaIds.map(catId => ({ horarioId: horario.id, categoriaId: catId }));
      await HorarioCategoria.bulkCreate(registros);
    }

    const completo = await Horario.findByPk(horario.id, {
      include: [
        { model: Sede, as: 'sede', attributes: ['id', 'nombre'] },
        { model: Categoria, as: 'categorias', attributes: ['id', 'nombre'], through: { attributes: [] } }
      ]
    });

    res.status(201).json(completo);
  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(500).json({ error: 'No se pudo crear el horario', detalle: error.message });
  }
};

const actualizarHorario = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    sedeId,
    temporada,
    fechaInicio,
    fechaFin,
    diasSemana,
    horaInicio,
    horaFin,
    categoriaIds = []
  } = req.body;

  if (!nombre || !sedeId || !diasSemana || !horaInicio || !horaFin) {
    return res.status(400).json({ error: 'nombre, sedeId, diasSemana, horaInicio y horaFin son obligatorios' });
  }

  try {
    const horario = await Horario.findByPk(id);
    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    await horario.update({
      nombre,
      sedeId,
      temporada,
      fechaInicio,
      fechaFin,
      diasSemana,
      horaInicio,
      horaFin
    });
    await HorarioCategoria.destroy({ where: { horarioId: horario.id } });
    if (categoriaIds.length) {
      const registros = categoriaIds.map(catId => ({ horarioId: horario.id, categoriaId: catId }));
      await HorarioCategoria.bulkCreate(registros);
    }

    const completo = await Horario.findByPk(horario.id, {
      include: [
        { model: Sede, as: 'sede', attributes: ['id', 'nombre'] },
        { model: Categoria, as: 'categorias', attributes: ['id', 'nombre'], through: { attributes: [] } }
      ]
    });

    res.json(completo);
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    res.status(500).json({ error: 'No se pudo actualizar el horario', detalle: error.message });
  }
};

const eliminarHorario = async (req, res) => {
  const { id } = req.params;
  try {
    const horario = await Horario.findByPk(id);
    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    await horario.destroy();
    res.json({ mensaje: 'Horario eliminado' });
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    res.status(500).json({ error: 'No se pudo eliminar el horario' });
  }
};

module.exports = {
  listarHorarios,
  crearHorario,
  actualizarHorario,
  eliminarHorario
};
