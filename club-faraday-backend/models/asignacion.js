const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asignacion = sequelize.define('Asignacion', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  entrenadorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  horarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'horarios', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  nombreGrupo: { type: DataTypes.STRING(100), allowNull: true },
  activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
  tableName: 'asignaciones',
  timestamps: false
});

module.exports = Asignacion;
