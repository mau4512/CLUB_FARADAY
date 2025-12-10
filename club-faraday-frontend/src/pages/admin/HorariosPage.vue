<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">Gestión de Horarios</div>

    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Nuevo horario</div>
        <q-form @submit.prevent="guardarHorario">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input v-model="form.nombre" label="Nombre" dense outlined :rules="[val => !!val || 'Obligatorio']" />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.sedeId"
                :options="sedeOptions"
                label="Sede"
                dense
                outlined
                emit-value
                map-options
                :loading="cargandoSedes"
                :rules="[val => !!val || 'Obligatorio']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.temporada" label="Temporada (opcional)" dense outlined />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.diasSemana"
                :options="diasOptions"
                label="Días de entrenamiento"
                dense
                outlined
                multiple
                emit-value
                map-options
                use-chips
                :rules="[val => (val && val.length) || 'Selecciona al menos un día']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.horaInicio" type="time" label="Hora inicio" dense outlined :rules="[val => !!val || 'Obligatorio']" />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.horaFin" type="time" label="Hora fin" dense outlined :rules="[val => !!val || 'Obligatorio']" />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.fechaInicio" type="date" label="Fecha inicio (opcional)" dense outlined />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.fechaFin" type="date" label="Fecha fin (opcional)" dense outlined />
            </div>
            <div class="col-12">
              <q-select
                v-model="form.categoriaIds"
                :options="categoriaOptions"
                label="Categorías asociadas"
                dense
                outlined
                :multiple="true"
                emit-value
                map-options
                use-chips
                hint="Puedes asociar varias categorías (por ejemplo, U19 y U17)"
              />
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
        <div class="text-subtitle2 q-mb-sm">Horarios creados</div>
        <q-table
          flat
          :rows="horarios"
          :columns="columnas"
          row-key="id"
          :loading="cargandoHorarios"
          no-data-label="Sin horarios"
        >
          <template #body-cell-dias="props">
            <q-td :props="props">
              {{ props.row.diasSemana?.split(',').join(', ') }}
            </q-td>
          </template>
          <template #body-cell-sede="props">
            <q-td :props="props">
              {{ props.row.sede?.nombre || '-' }}
            </q-td>
          </template>
          <template #body-cell-categorias="props">
            <q-td :props="props">
              <div v-if="props.row.categorias?.length">
                {{ props.row.categorias.map(cat => cat.nombre).join(', ') }}
              </div>
              <div v-else>—</div>
            </q-td>
          </template>
          <template #body-cell-acciones="props">
            <q-td :props="props">
              <q-btn dense flat icon="edit" color="primary" @click="editarHorario(props.row)" />
              <q-btn dense flat icon="delete" color="negative" @click="eliminarHorario(props.row.id)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const horarios = ref([])
const sedes = ref([])
const categorias = ref([])
const cargandoHorarios = ref(false)
const cargandoSedes = ref(false)
const cargandoCategorias = ref(false)
const guardando = ref(false)
const editando = ref(false)

const diasOptions = [
  { label: 'Lunes', value: 'LUN' },
  { label: 'Martes', value: 'MAR' },
  { label: 'Miércoles', value: 'MIE' },
  { label: 'Jueves', value: 'JUE' },
  { label: 'Viernes', value: 'VIE' },
  { label: 'Sábado', value: 'SAB' },
  { label: 'Domingo', value: 'DOM' }
]

const sedeOptions = computed(() =>
  sedes.value.map(sede => ({ label: sede.nombre, value: sede.id }))
)

const categoriaOptions = computed(() =>
  categorias.value.map(cat => ({ label: cat.nombre, value: cat.id }))
)

const form = ref({
  id: null,
  nombre: '',
  sedeId: null,
  temporada: '',
  diasSemana: [],
  horaInicio: '',
  horaFin: '',
  fechaInicio: '',
  fechaFin: '',
  categoriaIds: []
})

const columnas = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' },
  { name: 'sede', label: 'Sede', field: 'sede', align: 'left' },
  { name: 'dias', label: 'Días', field: 'diasSemana', align: 'left' },
  { name: 'categorias', label: 'Categorías', field: 'categorias', align: 'left' },
  { name: 'horas', label: 'Horario', field: row => `${row.horaInicio} - ${row.horaFin}`, align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
]

const resetForm = () => {
  form.value = {
    id: null,
    nombre: '',
    sedeId: sedes.value[0]?.id || null,
    temporada: '',
    diasSemana: [],
    horaInicio: '',
    horaFin: '',
    fechaInicio: '',
    fechaFin: '',
    categoriaIds: []
  }
  editando.value = false
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

const cargarSedes = async () => {
  cargandoSedes.value = true
  try {
    const { data } = await api.get('/sedes')
    sedes.value = data
    if (!form.value.sedeId && data.length) {
      form.value.sedeId = data[0].id
    }
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'No se pudieron cargar las sedes' })
  } finally {
    cargandoSedes.value = false
  }
}

const cargarCategorias = async () => {
  cargandoCategorias.value = true
  try {
    const { data } = await api.get('/categorias')
    categorias.value = data
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'No se pudieron cargar las categorías' })
  } finally {
    cargandoCategorias.value = false
  }
}

const guardarHorario = async () => {
  guardando.value = true
  const payload = {
    nombre: form.value.nombre,
    sedeId: form.value.sedeId,
    temporada: form.value.temporada || null,
    diasSemana: form.value.diasSemana.join(','),
    horaInicio: form.value.horaInicio,
    horaFin: form.value.horaFin,
    fechaInicio: form.value.fechaInicio || null,
    fechaFin: form.value.fechaFin || null,
    categoriaIds: form.value.categoriaIds
  }
  try {
    if (form.value.id) {
      await api.put(`/horarios/${form.value.id}`, payload)
      $q.notify({ type: 'positive', message: 'Horario actualizado' })
    } else {
      await api.post('/horarios', payload)
      $q.notify({ type: 'positive', message: 'Horario creado' })
    }
    resetForm()
    await cargarHorarios()
  } catch (error) {
    console.error(error)
    const mensaje = error.response?.data?.error || 'No se pudo guardar el horario'
    $q.notify({ type: 'negative', message: mensaje })
  } finally {
    guardando.value = false
  }
}

const editarHorario = (horario) => {
  form.value = {
    id: horario.id,
    nombre: horario.nombre,
    sedeId: horario.sedeId,
    temporada: horario.temporada || '',
    diasSemana: horario.diasSemana?.split(',') || [],
    horaInicio: horario.horaInicio,
    horaFin: horario.horaFin,
    fechaInicio: horario.fechaInicio || '',
    fechaFin: horario.fechaFin || '',
    categoriaIds: horario.categorias?.map(cat => cat.id) || []
  }
  editando.value = true
}

const eliminarHorario = async (id) => {
  $q.dialog({
    title: 'Confirmar',
    message: '¿Eliminar este horario?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/horarios/${id}`)
      $q.notify({ type: 'positive', message: 'Horario eliminado' })
      await cargarHorarios()
    } catch (error) {
      console.error(error)
      const mensaje = error.response?.data?.error || 'No se pudo eliminar el horario'
      $q.notify({ type: 'negative', message: mensaje })
    }
  })
}

onMounted(async () => {
  await Promise.all([cargarSedes(), cargarCategorias()])
  await cargarHorarios()
})
</script>
