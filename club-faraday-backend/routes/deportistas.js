const express = require('express');
const router = express.Router();
const { listarDeportistas, crearDeportista, actualizarDeportista } = require('../controllers/deportista');

router.get('/', listarDeportistas);
router.post('/', crearDeportista);
router.put('/:id', actualizarDeportista);

module.exports = router;
