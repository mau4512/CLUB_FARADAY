const Usuario = require('./usuario');
const Categoria = require('./categoria');
const Deportista = require('./deportista');
const Asistencia = require('./asistencia');
const Sede = require('./sede');
const Horario = require('./horario');
const Asignacion = require('./asignacion');
const HorarioCategoria = require('./horarioCategoria');

Categoria.hasMany(Deportista, { foreignKey: 'categoriaId', as: 'deportistas' });
Deportista.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });

Deportista.hasMany(Asistencia, { foreignKey: 'deportistaId', as: 'asistencias' });
Asistencia.belongsTo(Deportista, { foreignKey: 'deportistaId', as: 'deportista' });

Sede.hasMany(Usuario, { foreignKey: 'sedeId', as: 'usuarios' });
Usuario.belongsTo(Sede, { foreignKey: 'sedeId', as: 'sede' });

Sede.hasMany(Horario, { foreignKey: 'sedeId', as: 'horarios' });
Horario.belongsTo(Sede, { foreignKey: 'sedeId', as: 'sede' });

Usuario.hasMany(Asignacion, { foreignKey: 'entrenadorId', as: 'asignaciones' });
Asignacion.belongsTo(Usuario, { foreignKey: 'entrenadorId', as: 'entrenador' });

Horario.hasMany(Asignacion, { foreignKey: 'horarioId', as: 'asignaciones' });
Asignacion.belongsTo(Horario, { foreignKey: 'horarioId', as: 'horario' });

Asignacion.hasMany(Deportista, { foreignKey: 'asignacionId', as: 'deportistasAsignados' });
Deportista.belongsTo(Asignacion, { foreignKey: 'asignacionId', as: 'asignacion' });

Horario.belongsToMany(Categoria, {
  through: HorarioCategoria,
  foreignKey: 'horarioId',
  as: 'categorias'
});

Categoria.belongsToMany(Horario, {
  through: HorarioCategoria,
  foreignKey: 'categoriaId',
  as: 'horarios'
});

module.exports = {
  Usuario,
  Categoria,
  Deportista,
  Asistencia,
  Sede,
  Horario,
  Asignacion,
  HorarioCategoria
};
