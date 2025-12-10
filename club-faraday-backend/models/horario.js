const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Horario = sequelize.define('Horario', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  sedeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'sedes', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  temporada: { type: DataTypes.STRING(50), allowNull: true },
  fechaInicio: { type: DataTypes.DATEONLY, allowNull: true },
  fechaFin: { type: DataTypes.DATEONLY, allowNull: true },
  diasSemana: { type: DataTypes.STRING(50), allowNull: false }, // Ej: LUN,MIE,VIE
  horaInicio: { type: DataTypes.TIME, allowNull: false },
  horaFin: { type: DataTypes.TIME, allowNull: false }
}, {
  tableName: 'horarios',
  timestamps: false
});

module.exports = Horario;
