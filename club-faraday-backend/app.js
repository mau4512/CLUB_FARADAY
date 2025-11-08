const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
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

// Ruta raíz
app.get('/', (req, res) => res.send('API Club Faraday funcionando'));

// Puerto
const PORT = process.env.PORT || 3000;

// Conexión a base de datos y arranque del servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a MySQL establecida correctamente');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
  });
