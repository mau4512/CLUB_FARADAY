<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">Asignación de Entrenadores</div>

    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Nueva asignación</div>
        <q-form @submit.prevent="guardarAsignacion">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-select
                v-model="form.entrenadorId"
                :options="entrenadorOptions"
                label="Entrenador"
                dense
                outlined
                emit-value
                map-options
                :loading="cargandoUsuarios"
                :rules="[val => !!val || 'Obligatorio']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="form.horarioId"
                :options="horarioOptions"
                label="Horario"
                dense
                outlined
                emit-value
                map-options
                :loading="cargandoHorarios"
                :rules="[val => !!val || 'Obligatorio']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="form.nombreGrupo" label="Nombre del grupo (opcional)" dense outlined />
            </div>
            <div class="col-12 col-md-4">
              <q-toggle v-model="form.activo" label="Asignación activa" left-label />
            </div>
          </div>
          <div class="q-mt-md">
            <q-btn :label="editando ? 'Actualizar' : 'Crear'" color="primary" type="submit" :loading="guardando" />
            <q-btn flat label="Cancelar" class="q-ml-sm" @click="resetForm" v-if="editando" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Asignaciones creadas</div>
        <q-table
          flat
          :rows="asignaciones"
          :columns="columnas"
          row-key="id"
          :loading="cargandoAsignaciones"
          no-data-label="Sin asignaciones"
        >
          <template #body-cell-entrenador="props">
            <q-td :props="props">
              {{ props.row.entrenador?.nombre }}<br>
              <span class="text-caption">{{ props.row.entrenador?.correo }}</span>
            </q-td>
          </template>
          <template #body-cell-horario="props">
            <q-td :props="props">
              {{ props.row.horario?.nombre }}<br>
              <span class="text-caption">
                {{ props.row.horario?.diasSemana?.split(',').join(', ') }}<br>
                {{ props.row.horario?.horaInicio }} - {{ props.row.horario?.horaFin }}<br>
                Categorías: {{ props.row.horario?.categorias?.map(cat => cat.nombre).join(', ') || '—' }}
              </span>
            </q-td>
          </template>
          <template #body-cell-activo="props">
            <q-td :props="props">
              <q-badge :color="props.row.activo ? 'green' : 'grey'">
                {{ props.row.activo ? 'Activo' : 'Inactivo' }}
              </q-badge>
            </q-td>
          </template>
          <template #body-cell-acciones="props">
            <q-td :props="props">
              <q-btn dense flat icon="edit" color="primary" @click="editarAsignacion(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()

const asignaciones = ref([])
const entrenadores = ref([])
const horarios = ref([])

const cargandoAsignaciones = ref(false)
const cargandoUsuarios = ref(false)
const cargandoHorarios = ref(false)
const guardando = ref(false)
const editando = ref(false)

const form = ref({
  id: null,
  entrenadorId: null,
  horarioId: null,
  nombreGrupo: '',
  activo: true
})

const entrenadorOptions = computed(() =>
  entrenadores.value
    .filter(usuario => usuario.rol === 'entrenador')
    .map(usuario => ({ label: usuario.nombre, value: usuario.id }))
)

const horarioOptions = computed(() => {
  return horarios.value.map(h => ({
    label: `${h.nombre} (${h.diasSemana})`,
    value: h.id
  }))
})

const columnas = [
  { name: 'entrenador', label: 'Entrenador', field: 'entrenador', align: 'left' },
  { name: 'horario', label: 'Horario', field: 'horario', align: 'left' },
  { name: 'nombreGrupo', label: 'Grupo', field: 'nombreGrupo', align: 'left' },
  { name: 'activo', label: 'Estado', field: 'activo', align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
]

const resetForm = () => {
  form.value = {
    id: null,
    entrenadorId: entrenadorOptions.value[0]?.value || null,
    horarioId: horarioOptions.value[0]?.value || null,
    nombreGrupo: '',
    activo: true
  }
  editando.value = false
}

watch(horarioOptions, (nuevasOpciones) => {
  const idsDisponibles = nuevasOpciones.map(opt => opt.value)
  if (form.value.horarioId && !idsDisponibles.includes(form.value.horarioId)) {
    form.value.horarioId = null
  }
})

const cargarAsignaciones = async () => {
  cargandoAsignaciones.value = true
  try {
    const { data } = await api.get('/asignaciones')
    asignaciones.value = data
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'No se pudieron cargar las asignaciones' })
  } finally {
    cargandoAsignaciones.value = false
  }
}

const cargarUsuarios = async () => {
  cargandoUsuarios.value = true
  try {
    const { data } = await api.get('/usuarios')
    entrenadores.value = data
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'No se pudieron cargar los usuarios' })
  } finally {
    cargandoUsuarios.value = false
  }
}

const cargarHorarios = async () => {
  cargandoHorarios.value = true
  try {
    const { data } = await api.get('/horarios')
    horarios.value = data
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'No se pudieron cargar los horarios' })
  } finally {
    cargandoHorarios.value = false
  }
}

const guardarAsignacion = async () => {
  if (!form.value.entrenadorId || !form.value.horarioId) {
    $q.notify({ type: 'warning', message: 'Completa todos los campos obligatorios' })
    return
  }

  guardando.value = true
  try {
    const payload = { ...form.value }
    if (payload.id) {
      await api.put(`/asignaciones/${payload.id}`, payload)
      $q.notify({ type: 'positive', message: 'Asignación actualizada' })
    } else {
      await api.post('/asignaciones', payload)
      $q.notify({ type: 'positive', message: 'Asignación creada' })
    }
    resetForm()
    await cargarAsignaciones()
  } catch (error) {
    console.error(error)
    const mensaje = error.response?.data?.error || 'No se pudo guardar la asignación'
    $q.notify({ type: 'negative', message: mensaje })
  } finally {
    guardando.value = false
  }
}

const editarAsignacion = (asignacion) => {
  form.value = {
    id: asignacion.id,
    entrenadorId: asignacion.entrenadorId,
    horarioId: asignacion.horarioId,
    nombreGrupo: asignacion.nombreGrupo || '',
    activo: asignacion.activo
  }
  editando.value = true
}

onMounted(async () => {
  await Promise.all([cargarUsuarios(), cargarHorarios()])
  resetForm()
  await cargarAsignaciones()
})
</script>
