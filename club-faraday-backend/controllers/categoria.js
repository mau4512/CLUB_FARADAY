const Categoria = require('../models/categoria');

const listarCategorias = async (_req, res) => {
  try {
    const categorias = await Categoria.findAll({ order: [['anioDesde', 'ASC']] });
    res.json(categorias);
  } catch (error) {
    console.error('Error al listar categorias:', error);
    res.status(500).json({ error: 'No se pudieron obtener las categorías' });
  }
};

const crearCategoria = async (req, res) => {
  const { nombre, anioDesde, anioHasta } = req.body;

  if (!nombre || anioDesde == null || anioHasta == null) {
    return res.status(400).json({ error: 'nombre, anioDesde y anioHasta son obligatorios' });
  }

  try {
    const categoria = await Categoria.create({ nombre, anioDesde, anioHasta });
    res.status(201).json(categoria);
  } catch (error) {
    console.error('Error al crear categoria:', error);
    res.status(500).json({ error: 'No se pudo crear la categoría', detalle: error.message });
  }
};

module.exports = {
  listarCategorias,
  crearCategoria
};
