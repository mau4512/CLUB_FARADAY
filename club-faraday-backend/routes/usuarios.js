// routes/usuarios.js
const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

// Registrar nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;
    const nuevo = await Usuario.create({ nombre, correo, contraseña, rol });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario', detalle: error });
  }
});

// Listar todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
});

module.exports = router;
