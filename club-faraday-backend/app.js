const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('./models');
require('dotenv').config();

const app = express();

// Middleware CORS
app.use(cors({
  origin: 'http://localhost:9000', // frontend
  credentials: true
}));

app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/deportistas', require('./routes/deportistas'));
app.use('/api/asistencias', require('./routes/asistencias'));
app.use('/api/sedes', require('./routes/sedes'));
app.use('/api/horarios', require('./routes/horarios'));
app.use('/api/asignaciones', require('./routes/asignaciones'));

// Ruta raíz
app.get('/', (req, res) => res.send('API Club Faraday funcionando'));

// Puerto
const PORT = process.env.PORT || 3000;

// Conexión a base de datos y arranque del servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a MySQL establecida correctamente');
    return sequelize.sync();
  })
  .then(() => {
    console.log('🗄️  Modelos sincronizados');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
  });
