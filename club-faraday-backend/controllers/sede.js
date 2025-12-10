const Sede = require('../models/sede');

const listarSedes = async (_req, res) => {
  try {
    const sedes = await Sede.findAll({ order: [['nombre', 'ASC']] });
    res.json(sedes);
  } catch (error) {
    console.error('Error al listar sedes:', error);
    res.status(500).json({ error: 'No se pudieron obtener las sedes' });
  }
};

module.exports = {
  listarSedes
};
