const express = require('express');
const router = express.Router();
const {
  listarAsignaciones,
  crearAsignacion,
  actualizarAsignacion
} = require('../controllers/asignacion');

router.get('/', listarAsignaciones);
router.post('/', crearAsignacion);
router.put('/:id', actualizarAsignacion);

module.exports = router;
