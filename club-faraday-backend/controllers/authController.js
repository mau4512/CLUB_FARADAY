// backend/controllers/authController.js
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Correo no encontrado' });
    }

    // Validar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Crear token
    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
        nombre: usuario.nombre
      },
      process.env.JWT_SECRET || 'secreto_club_faraday',
      { expiresIn: '1d' }
    );

    // Respuesta con token y datos del usuario
    res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = { login };
