const express = require('express');
const router = express.Router();
const { crearUsuario, listarUsuarios, actualizarUsuario } = require('../controllers/usuario');

router.post('/', crearUsuario);
router.get('/', listarUsuarios);
router.put('/:id', actualizarUsuario);

module.exports = router;
