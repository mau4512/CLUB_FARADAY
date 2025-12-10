const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const Sede = require('../models/sede');

const ROLES_PERMITIDOS = ['admin', 'entrenador'];

const crearUsuario = async (req, res) => {
  const { nombre, correo, password, rol = 'entrenador', sedeId } = req.body;

  if (!nombre || !correo || !password || !sedeId) {
    return res.status(400).json({ error: 'nombre, correo, password y sedeId son obligatorios' });
  }

  if (!ROLES_PERMITIDOS.includes(rol)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }

  const sede = await Sede.findByPk(sedeId);
  if (!sede) {
    return res.status(400).json({ error: 'La sede seleccionada no existe' });
  }

  try {
    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) {
      return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const nuevo = await Usuario.create({
      nombre,
      correo,
      password: passwordHash,
      rol,
      sedeId
    });

    const usuarioConSede = await Usuario.findByPk(nuevo.id, {
      attributes: ['id', 'nombre', 'correo', 'rol'],
      include: [{ model: Sede, as: 'sede', attributes: ['id', 'nombre'] }]
    });

    res.status(201).json(usuarioConSede);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario', detalle: error.message });
  }
};

const listarUsuarios = async (_req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'correo', 'rol'],
      include: [{ model: Sede, as: 'sede', attributes: ['id', 'nombre'] }]
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
};

const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, password, rol, sedeId } = req.body;

  if (!nombre || !correo || !rol || !sedeId) {
    return res.status(400).json({ error: 'nombre, correo, rol y sedeId son obligatorios' });
  }

  if (!ROLES_PERMITIDOS.includes(rol)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }

  const sede = await Sede.findByPk(sedeId);
  if (!sede) {
    return res.status(400).json({ error: 'La sede seleccionada no existe' });
  }

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (correo !== usuario.correo) {
      const existe = await Usuario.findOne({ where: { correo } });
      if (existe) {
        return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });
      }
    }

    const updates = { nombre, correo, rol, sedeId };
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    await usuario.update(updates);

    const usuarioActualizado = await Usuario.findByPk(usuario.id, {
      attributes: ['id', 'nombre', 'correo', 'rol'],
      include: [{ model: Sede, as: 'sede', attributes: ['id', 'nombre'] }]
    });

    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario', detalle: error.message });
  }
};

module.exports = {
  crearUsuario,
  listarUsuarios,
  actualizarUsuario
};
