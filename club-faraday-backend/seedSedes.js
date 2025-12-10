const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const sequelize = require('./config/database');
const Sede = require('./models/sede');

const sedesBase = [
  { nombre: 'Cerro Colorado', direccion: 'Calle Arequi 601', ciudad: 'Arequipa' },
  { nombre: 'Moral', direccion: 'Calle Moral 307', ciudad: 'Arequipa' }
];

async function seedSedes() {
  try {
    await sequelize.sync();
    for (const sede of sedesBase) {
      await Sede.upsert(sede);
    }
    console.log('✅ Sedes base creadas/actualizadas');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sembrar sedes:', error);
    process.exit(1);
  }
}

seedSedes();
