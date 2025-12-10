const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HorarioCategoria = sequelize.define('HorarioCategoria', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  horarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'horarios', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'categorias', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'horarios_categorias',
  timestamps: false
});

module.exports = HorarioCategoria;
