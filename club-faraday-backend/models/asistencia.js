const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asistencia = sequelize.define('Asistencia', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  deportistaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'deportistas', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  estado: {
    type: DataTypes.ENUM('asistio', 'falta', 'justificado'),
    allowNull: false,
    defaultValue: 'asistio'
  },
  observaciones: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'asistencias',
  timestamps: false
});

module.exports = Asistencia;
