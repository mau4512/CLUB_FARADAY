const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deportista = sequelize.define('Deportista', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombres: { type: DataTypes.STRING, allowNull: false },
  apellidos: { type: DataTypes.STRING, allowNull: true },
  dni: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  genero: { type: DataTypes.ENUM('M', 'F'), allowNull: false },
  fechaNacimiento: { type: DataTypes.DATEONLY, allowNull: false },
  contacto: { type: DataTypes.STRING, allowNull: true },
  tallaPolo: { type: DataTypes.STRING(10), allowNull: true },
  tallaShort: { type: DataTypes.STRING(10), allowNull: true },
  numeroCamiseta: { type: DataTypes.INTEGER, allowNull: true },
  asignacionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'asignaciones', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'categorias', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }
}, {
  tableName: 'deportistas',
  timestamps: false
});

module.exports = Deportista;
