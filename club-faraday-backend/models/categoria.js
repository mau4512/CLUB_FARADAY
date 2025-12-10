const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Categoria = sequelize.define('Categoria', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  anioDesde: { type: DataTypes.INTEGER, allowNull: false },
  anioHasta: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'categorias',
  timestamps: false
});

module.exports = Categoria;
