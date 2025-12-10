const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const sequelize = require('./config/database');
const Categoria = require('./models/categoria');

const temporada = parseInt(process.env.TEMPORADA_BASE || '2025', 10);

const construirCategoria = (nombre, edadReferencia, span = 1) => {
  const anioDesde = temporada - edadReferencia;
  const anioHasta = anioDesde + span;
  return { nombre, anioDesde, anioHasta };
};

const categoriasBase = [];
for (let edad = 7; edad <= 23; edad += 1) {
  const span = edad === 23 ? 3 : 1; // U23 abarca cuatro años (20-23)
  categoriasBase.push(construirCategoria(`U${edad}`, edad, span));
}

categoriasBase.push({
  nombre: 'Mayores',
  anioDesde: 1900,
  anioHasta: temporada - 24
});

async function seedCategorias() {
  try {
    await sequelize.sync();
    for (const categoria of categoriasBase) {
      await Categoria.upsert(categoria);
    }
    console.log('✅ Categorías base creadas/actualizadas');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sembrar categorías:', error);
    process.exit(1);
  }
}

seedCategorias();
