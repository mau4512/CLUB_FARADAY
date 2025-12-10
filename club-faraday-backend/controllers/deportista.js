const { Op } = require('sequelize');
const Deportista = require('../models/deportista');
const Categoria = require('../models/categoria');
const Asignacion = require('../models/asignacion');
const Horario = require('../models/horario');
const Usuario = require('../models/usuario');

const validarNumeroCamiseta = async (numeroCamiseta, categoriaId, excluirId = null) => {
  if (!numeroCamiseta) {
    return;
  }

  const categoria = await Categoria.findByPk(categoriaId);
  if (!categoria) {
    throw new Error('La categoría seleccionada no existe');
  }

  const categoriasProtegidas = await Categoria.findAll({
    where: {
      anioDesde: {
        [Op.between]: [categoria.anioDesde, categoria.anioDesde + 4]
      }
    },
    attributes: ['id']
  });

  const categoriaIds = categoriasProtegidas.map(cat => cat.id);
  if (!categoriaIds.length) {
    return;
  }

  const where = {
    numeroCamiseta,
    categoriaId: categoriaIds
  };
  if (excluirId) {
    where.id = { [Op.ne]: excluirId };
  }

  const existente = await Deportista.findOne({
    where,
    include: [{ model: Categoria, as: 'categoria', attributes: ['nombre'] }]
  });

  if (existente) {
    const nombreCategoria = existente.categoria?.nombre || 'otra categoría';
    throw new Error(`El número de camiseta ${numeroCamiseta} ya está asignado en ${nombreCategoria}`);
  }
};

const validarAsignacion = async (asignacionId, categoriaId) => {
  if (!asignacionId) {
    return;
  }

  const asignacion = await Asignacion.findByPk(asignacionId, {
    include: [
      {
        model: Horario,
        as: 'horario',
        include: [{ model: Categoria, as: 'categorias', attributes: ['id'], through: { attributes: [] } }]
      }
    ]
  });
  if (!asignacion) {
    throw new Error('La asignación seleccionada no existe');
  }

  const categoriasPermitidas = asignacion.horario?.categorias?.map(cat => cat.id) || [];
  if (!categoriasPermitidas.includes(Number(categoriaId))) {
    throw new Error('El horario seleccionado no está disponible para la categoría elegida');
  }
};

const listarDeportistas = async (req, res) => {
  const { categoriaId, genero } = req.query;
  const filtros = {};
  if (categoriaId) {
    filtros.categoriaId = categoriaId;
  }
  if (genero) {
    filtros.genero = genero;
  }

  try {
    const deportistas = await Deportista.findAll({
      where: filtros,
      include: [
        { model: Categoria, as: 'categoria', attributes: ['id', 'nombre', 'anioDesde', 'anioHasta'] },
        {
          model: Asignacion,
          as: 'asignacion',
          include: [
            { model: Usuario, as: 'entrenador', attributes: ['id', 'nombre'] },
            {
              model: Horario,
              as: 'horario',
              include: [{ model: Categoria, as: 'categorias', attributes: ['id', 'nombre'], through: { attributes: [] } }]
            }
          ]
        }
      ],
      order: [['nombres', 'ASC']]
    });
    res.json(deportistas);
  } catch (error) {
    console.error('Error al listar deportistas:', error);
    res.status(500).json({ error: 'No se pudieron obtener los deportistas' });
  }
};

const crearDeportista = async (req, res) => {
  const {
    nombres,
    apellidos,
    dni,
    genero,
    fechaNacimiento,
    contacto,
    tallaPolo,
    tallaShort,
    numeroCamiseta,
    asignacionId,
    categoriaId
  } = req.body;

  if (!nombres || !fechaNacimiento || !categoriaId || !dni || !genero) {
    return res.status(400).json({ error: 'nombres, dni, genero, fechaNacimiento y categoriaId son obligatorios' });
  }

  try {
    const existeDni = await Deportista.findOne({ where: { dni } });
    if (existeDni) {
      return res.status(409).json({ error: 'Ya existe un jugador registrado con ese DNI' });
    }

    if (numeroCamiseta) {
      await validarNumeroCamiseta(numeroCamiseta, categoriaId);
    }

    await validarAsignacion(asignacionId, categoriaId);

    const deportista = await Deportista.create({
      nombres,
      apellidos,
      dni,
      genero,
      fechaNacimiento,
      contacto,
      tallaPolo,
      tallaShort,
      numeroCamiseta,
      asignacionId,
      categoriaId
    });

    const deportistaConCategoria = await Deportista.findByPk(deportista.id, {
      include: [
        { model: Categoria, as: 'categoria', attributes: ['id', 'nombre', 'anioDesde', 'anioHasta'] },
        {
          model: Asignacion,
          as: 'asignacion',
          include: [
            { model: Usuario, as: 'entrenador', attributes: ['id', 'nombre'] },
            {
              model: Horario,
              as: 'horario',
              include: [{ model: Categoria, as: 'categorias', attributes: ['id', 'nombre'], through: { attributes: [] } }]
            }
          ]
        }
      ]
    });

    res.status(201).json(deportistaConCategoria);
  } catch (error) {
    console.error('Error al crear deportista:', error);
    res.status(500).json({ error: 'No se pudo crear el deportista', detalle: error.message });
  }
};

const actualizarDeportista = async (req, res) => {
  const { id } = req.params;
  const {
    nombres,
    apellidos,
    dni,
    genero,
    fechaNacimiento,
    contacto,
    tallaPolo,
    tallaShort,
    numeroCamiseta,
    asignacionId,
    categoriaId
  } = req.body;

  if (!nombres || !fechaNacimiento || !categoriaId || !dni || !genero) {
    return res.status(400).json({ error: 'nombres, dni, genero, fechaNacimiento y categoriaId son obligatorios' });
  }

  try {
    const deportista = await Deportista.findByPk(id);
    if (!deportista) {
      return res.status(404).json({ error: 'Jugador no encontrado' });
    }

    if (dni !== deportista.dni) {
      const existeDni = await Deportista.findOne({ where: { dni } });
      if (existeDni) {
        return res.status(409).json({ error: 'Ya existe un jugador registrado con ese DNI' });
      }
    }

    if (numeroCamiseta) {
      await validarNumeroCamiseta(numeroCamiseta, categoriaId, deportista.id);
    }

    await validarAsignacion(asignacionId, categoriaId);

    await deportista.update({
      nombres,
      apellidos,
      dni,
      genero,
      fechaNacimiento,
      contacto,
      tallaPolo,
      tallaShort,
      numeroCamiseta,
      asignacionId,
      categoriaId
    });

    const actualizado = await Deportista.findByPk(deportista.id, {
      include: [
        { model: Categoria, as: 'categoria', attributes: ['id', 'nombre', 'anioDesde', 'anioHasta'] },
        {
          model: Asignacion,
          as: 'asignacion',
          include: [
            { model: Usuario, as: 'entrenador', attributes: ['id', 'nombre'] },
            {
              model: Horario,
              as: 'horario',
              include: [{ model: Categoria, as: 'categorias', attributes: ['id', 'nombre'], through: { attributes: [] } }]
            }
          ]
        }
      ]
    });

    res.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar deportista:', error);
    res.status(500).json({ error: 'No se pudo actualizar el deportista', detalle: error.message });
  }
};

module.exports = {
  listarDeportistas,
  crearDeportista,
  actualizarDeportista
};
