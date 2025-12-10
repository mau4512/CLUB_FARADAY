// models/usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  sedeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'sedes', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  rol: {
    type: DataTypes.ENUM('admin', 'entrenador'),
    defaultValue: 'entrenador'
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

module.exports = Usuario;
