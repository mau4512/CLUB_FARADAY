const express = require('express');
const router = express.Router();
const { listarAsistencias, registrarAsistencia } = require('../controllers/asistencia');

router.get('/', listarAsistencias);
router.post('/', registrarAsistencia);

module.exports = router;
