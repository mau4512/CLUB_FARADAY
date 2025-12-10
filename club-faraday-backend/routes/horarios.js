const express = require('express');
const router = express.Router();
const {
  listarHorarios,
  crearHorario,
  actualizarHorario,
  eliminarHorario
} = require('../controllers/horario');

router.get('/', listarHorarios);
router.post('/', crearHorario);
router.put('/:id', actualizarHorario);
router.delete('/:id', eliminarHorario);

module.exports = router;
