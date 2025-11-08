const bcrypt = require('bcrypt');
const Usuario = require('./models/usuario');
const sequelize = require('./config/database');

async function crearUsuario() {
  await sequelize.sync();

  const hash = await bcrypt.hash('admin123', 10);

  await Usuario.create({
    nombre: 'Mauricio Admin',
    correo: 'admin@faraday.com',
    password: hash,
    rol: 'admin'
  });

  console.log('✅ Usuario creado');
}

crearUsuario();
