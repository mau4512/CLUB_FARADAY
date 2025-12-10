const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sede = sequelize.define('Sede', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  direccion: { type: DataTypes.STRING(150), allowNull: true },
  ciudad: { type: DataTypes.STRING(80), allowNull: true }
}, {
  tableName: 'sedes',
  timestamps: false
});

module.exports = Sede;
