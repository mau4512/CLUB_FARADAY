<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h6">Gestión de Jugadores</div>
      </div>
      <div class="col-auto">
        <q-toggle
          v-model="mostrarSoloImpares"
          label="Mostrar solo categorías impares"
          dense
        />
      </div>
    </div>

    <q-card>
      <q-tabs v-model="tab" dense>
        <q-tab name="registro" label="Registro" icon="person_add" />
        <q-tab name="listado" label="Listado" icon="format_list_bulleted" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="registro">
          <q-banner class="bg-grey-2 text-grey-8 q-mb-md" dense>
            El número de camiseta no puede repetirse en la misma categoría ni en las
            dos categorías inferiores inmediatas (ej. un número en U17 no puede repetirse en U15 ni U13).
          </q-banner>
          <q-form @submit.prevent="registrarJugador">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.nombres"
                  label="Nombres"
                  dense
                  outlined
                  :rules="[val => !!val || 'Obligatorio']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.apellidos"
                  label="Apellidos"
                  dense
                  outlined
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.dni"
                  label="DNI / Documento"
                  dense
                  outlined
                  :rules="[val => !!val || 'Obligatorio']"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.fechaNacimiento"
                  type="date"
                  label="Fecha de nacimiento"
                  dense
                  outlined
                  :rules="[val => !!val || 'Obligatorio']"
                />
              </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="form.categoriaId"
                :options="categoriaOptions"
                label="Categoría"
                dense
                outlined
                emit-value
                map-options
                :loading="cargandoCategorias"
                :rules="[val => !!val || 'Obligatorio']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="form.asignacionId"
                :options="asignacionOptions"
                label="Asignación / Horario"
                dense
                outlined
                emit-value
                map-options
                :loading="cargandoAsignaciones"
                :disable="!form.categoriaId"
                hint="Selecciona una categoría para ver horarios disponibles"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="form.genero"
                :options="generoOptions"
                label="Género"
                  dense
                  outlined
                  emit-value
                  map-options
                  :rules="[val => !!val || 'Obligatorio']"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model.number="form.numeroCamiseta"
                  type="number"
                  min="0"
                  label="Número de camiseta (opcional)"
                  dense
                  outlined
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.contacto"
                  label="Contacto"
                  dense
                  outlined
                />
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="form.tallaPolo"
                  :options="tallaOptions"
                  label="Talla polo (opcional)"
                  dense
                  outlined
                  emit-value
                  map-options
                  clearable
                />
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="form.tallaShort"
                  :options="tallaOptions"
                  label="Talla short (opcional)"
                  dense
                  outlined
                  emit-value
                  map-options
                  clearable
                />
              </div>
            </div>
            <div class="q-mt-md">
              <q-btn
                label="Registrar"
                color="primary"
                type="submit"
                :loading="guardando"
              />
              <q-btn label="Limpiar" flat class="q-ml-sm" @click="resetForm" />
            </div>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="listado">
          <div class="row items-center q-col-gutter-sm q-mb-md">
            <div class="col">
              <div class="text-subtitle2">Listado de jugadores</div>
              <div class="text-caption text-grey-7">
                Filtra por categoría para revisar los cupos y dorsales disponibles.
              </div>
            </div>
            <div class="col-auto row items-center q-col-gutter-sm">
              <div>
                <q-select
                  v-model="filtros.categoriaId"
                  :options="[ { label: 'Todas las categorías', value: null }, ...categoriaOptions ]"
                  label="Filtrar por categoría"
                  dense
                  outlined
                  emit-value
                  map-options
                  style="min-width: 220px"
                  :loading="cargandoCategorias"
                  @update:model-value="cargarDeportistas"
                />
              </div>
              <div>
                <q-select
                  v-model="filtros.genero"
                  :options="[ { label: 'Todos los géneros', value: null }, ...generoOptions ]"
                  label="Filtrar por género"
                  dense
                  outlined
                  emit-value
                  map-options
                  style="min-width: 160px"
                  @update:model-value="cargarDeportistas"
                />
              </div>
            </div>
          </div>

          <q-table
            flat
            :rows="deportistas"
            :columns="columnas"
            row-key="id"
            :loading="cargandoDeportistas"
            no-data-label="Sin jugadores registrados"
            class="shadow-1"
          >
            <template #body-cell-fechaNacimiento="props">
              <q-td :props="props">
                {{ formatearFecha(props.row.fechaNacimiento) }}
              </q-td>
            </template>
          <template #body-cell-categoria="props">
            <q-td :props="props">
              {{ props.row.categoria?.nombre }}<br>
              <span class="text-caption text-grey-7">
                {{ rangeNacimiento(props.row.categoria) }}
              </span>
            </q-td>
          </template>
          <template #body-cell-asignacion="props">
            <q-td :props="props">
              <div v-if="props.row.asignacion">
                {{ props.row.asignacion?.horario?.nombre || 'Horario' }}<br>
                <span class="text-caption text-grey-7">
                  {{ props.row.asignacion?.horario?.diasSemana }} -
                  {{ props.row.asignacion?.horario?.horaInicio }} / {{ props.row.asignacion?.horario?.horaFin }}
                </span>
              </div>
              <div v-else>—</div>
            </q-td>
          </template>
          <template #body-cell-numeroCamiseta="props">
              <q-td :props="props">
                {{ props.row.numeroCamiseta ?? '—' }}
              </q-td>
            </template>
            <template #body-cell-tallas="props">
              <q-td :props="props">
                Polo: {{ props.row.tallaPolo || '—' }}<br>
                Short: {{ props.row.tallaShort || '—' }}
              </q-td>
            </template>
            <template #body-cell-genero="props">
              <q-td :props="props">
                {{ labelGenero(props.row.genero) }}
              </q-td>
            </template>
            <template #body-cell-acciones="props">
              <q-td :props="props">
                <q-btn
                  dense
                  round
                  flat
                  color="primary"
                  icon="edit"
                  @click="abrirDialogoEdicion(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 500px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Editar jugador</div>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="editForm">
          <q-form @submit.prevent="guardarEdicion">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input v-model="editForm.nombres" label="Nombres" dense outlined :rules="[val => !!val || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="editForm.apellidos" label="Apellidos" dense outlined />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="editForm.dni" label="DNI / Documento" dense outlined :rules="[val => !!val || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="editForm.genero"
                  :options="generoOptions"
                  label="Género"
                  dense
                  outlined
                  emit-value
                  map-options
                  :rules="[val => !!val || 'Obligatorio']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="editForm.fechaNacimiento" type="date" label="Fecha de nacimiento" dense outlined :rules="[val => !!val || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="editForm.categoriaId"
                  :options="categoriaOptionsFull"
                  label="Categoría"
                  dense
                  outlined
                  emit-value
                  map-options
                  :rules="[val => !!val || 'Obligatorio']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="editForm.asignacionId"
                  :options="asignacionOptionsEdit"
                  label="Asignación / Horario"
                  dense
                  outlined
                  emit-value
                  map-options
                  :loading="cargandoAsignaciones"
                  :disable="!editForm.categoriaId"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model.number="editForm.numeroCamiseta" type="number" min="0" label="Número de camiseta" dense outlined />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="editForm.contacto" label="Contacto" dense outlined />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="editForm.tallaPolo"
                  :options="tallaOptions"
                  label="Talla polo"
                  dense
                  outlined
                  emit-value
                  map-options
                  clearable
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="editForm.tallaShort"
                  :options="tallaOptions"
                  label="Talla short"
                  dense
                  outlined
                  emit-value
                  map-options
                  clearable
                />
              </div>
            </div>
            <div class="q-mt-md text-right">
              <q-btn flat label="Cancelar" color="primary" class="q-mr-sm" @click="cerrarDialogoEdicion" />
              <q-btn label="Guardar" color="primary" type="submit" :loading="editLoading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const tab = ref('registro')
const categorias = ref([])
const deportistas = ref([])
const asignaciones = ref([])
const cargandoCategorias = ref(false)
const cargandoDeportistas = ref(false)
const cargandoAsignaciones = ref(false)
const guardando = ref(false)
const filtros = ref({
  categoriaId: null,
  genero: null
})
const mostrarSoloImpares = ref(true)

const editDialog = ref(false)
const editLoading = ref(false)
const editForm = ref(null)

const form = ref({
  nombres: '',
  apellidos: '',
  dni: '',
  genero: null,
  fechaNacimiento: '',
  contacto: '',
  tallaPolo: null,
  tallaShort: null,
  numeroCamiseta: null,
  categoriaId: null,
  asignacionId: null
})

const tallaOptions = [
  { label: '4', value: '4' },
  { label: '6', value: '6' },
  { label: '8', value: '8' },
  { label: '10', value: '10' },
  { label: '12', value: '12' },
  { label: '14', value: '14' },
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'XL' }
]

const generoOptions = [
  { label: 'Masculino', value: 'M' },
  { label: 'Femenino', value: 'F' }
]

const columnas = [
  { name: 'nombres', label: 'Nombres', field: 'nombres', align: 'left' },
  { name: 'apellidos', label: 'Apellidos', field: 'apellidos', align: 'left' },
  { name: 'dni', label: 'DNI', field: 'dni', align: 'left' },
  { name: 'fechaNacimiento', label: 'Nacimiento', field: 'fechaNacimiento', align: 'left' },
  { name: 'categoria', label: 'Categoría', field: 'categoria', align: 'left' },
  { name: 'asignacion', label: 'Asignación', field: 'asignacion', align: 'left' },
  { name: 'genero', label: 'Género', field: 'genero', align: 'center' },
  { name: 'numeroCamiseta', label: 'N° Camiseta', field: 'numeroCamiseta', align: 'center' },
  { name: 'tallas', label: 'Tallas', field: 'tallas', align: 'left' },
  { name: 'contacto', label: 'Contacto', field: 'contacto', align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
]

const esCategoriaImpar = (categoria) => {
  if (!categoria?.nombre) return false
  const numero = parseInt(categoria.nombre.replace(/\D/g, ''), 10)
  return Number.isNaN(numero) ? false : numero % 2 === 1
}

const categoriaOptionsFull = computed(() =>
  categorias.value.map(cat => ({
    label: `${cat.nombre} (${cat.anioDesde}-${cat.anioHasta})`,
    value: cat.id
  }))
)

const categoriaOptions = computed(() => {
  const lista = mostrarSoloImpares.value
    ? categorias.value.filter(cat => esCategoriaImpar(cat))
    : categorias.value

  return lista.map(cat => ({
    label: `${cat.nombre} (${cat.anioDesde}-${cat.anioHasta})`,
    value: cat.id
  }))
})

const obtenerOpcionesAsignacion = (categoriaId) => {
  if (!categoriaId) {
    return []
  }
  const categoriaIdNum = Number(categoriaId)
  return asignaciones.value
    .filter(asignacion => asignacion.horario?.categorias?.some(cat => cat.id === categoriaIdNum))
    .map(asignacion => ({
      label: `${asignacion.horario?.nombre || 'Horario'} (${asignacion.horario?.diasSemana || ''})`,
      value: asignacion.id
    }))
}

const asignacionOptions = computed(() => obtenerOpcionesAsignacion(form.value.categoriaId))
const asignacionOptionsEdit = computed(() => (editForm.value ? obtenerOpcionesAsignacion(editForm.value.categoriaId) : []))

watch(categoriaOptions, (nuevasOpciones) => {
  const idsDisponibles = nuevasOpciones.map(opt => opt.value)
  if (form.value.categoriaId && !idsDisponibles.includes(form.value.categoriaId)) {
    form.value.categoriaId = null
  }
  if (filtros.value.categoriaId && !idsDisponibles.includes(filtros.value.categoriaId)) {
    filtros.value.categoriaId = null
    cargarDeportistas()
  }
})

watch(asignacionOptions, (nuevasOpciones) => {
  const idsDisponibles = nuevasOpciones.map(opt => opt.value)
  if (form.value.asignacionId && !idsDisponibles.includes(form.value.asignacionId)) {
    form.value.asignacionId = null
  }
})

watch(asignacionOptionsEdit, (nuevasOpciones) => {
  if (!editForm.value) return
  const idsDisponibles = nuevasOpciones.map(opt => opt.value)
  if (editForm.value.asignacionId && !idsDisponibles.includes(editForm.value.asignacionId)) {
    editForm.value.asignacionId = null
  }
})

const resetForm = () => {
  form.value = {
    nombres: '',
    apellidos: '',
    dni: '',
    genero: null,
    fechaNacimiento: '',
    contacto: '',
    tallaPolo: null,
    tallaShort: null,
    numeroCamiseta: null,
    categoriaId: null,
    asignacionId: null
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

const cargarDeportistas = async () => {
  cargandoDeportistas.value = true
  try {
    const params = {}
    if (filtros.value.categoriaId) {
      params.categoriaId = filtros.value.categoriaId
    }
    if (filtros.value.genero) {
      params.genero = filtros.value.genero
    }
    const { data } = await api.get('/deportistas', { params })
    deportistas.value = data
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'No se pudieron cargar los jugadores' })
  } finally {
    cargandoDeportistas.value = false
  }
}

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

const registrarJugador = async () => {
  guardando.value = true
  try {
    await api.post('/deportistas', form.value)
    $q.notify({ type: 'positive', message: 'Jugador registrado correctamente' })
    resetForm()
    await cargarDeportistas()
  } catch (error) {
    console.error(error)
    const mensaje = error.response?.data?.error || 'No se pudo registrar al jugador'
    $q.notify({ type: 'negative', message: mensaje })
  } finally {
    guardando.value = false
  }
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString()
}

const rangeNacimiento = (categoria) => {
  if (!categoria) return ''
  return `${categoria.anioDesde}-${categoria.anioHasta}`
}

const labelGenero = (genero) => {
  if (genero === 'M') return 'Masculino'
  if (genero === 'F') return 'Femenino'
  return '—'
}

const abrirDialogoEdicion = (jugador) => {
  editForm.value = {
    id: jugador.id,
    nombres: jugador.nombres,
    apellidos: jugador.apellidos,
    dni: jugador.dni,
    genero: jugador.genero,
    fechaNacimiento: jugador.fechaNacimiento,
    contacto: jugador.contacto,
    tallaPolo: jugador.tallaPolo,
    tallaShort: jugador.tallaShort,
    numeroCamiseta: jugador.numeroCamiseta,
    categoriaId: jugador.categoriaId,
    asignacionId: jugador.asignacionId || null
  }
  editDialog.value = true
}

const cerrarDialogoEdicion = () => {
  editDialog.value = false
  editForm.value = null
}

const guardarEdicion = async () => {
  if (!editForm.value) return
  editLoading.value = true
  try {
    await api.put(`/deportistas/${editForm.value.id}`, editForm.value)
    $q.notify({ type: 'positive', message: 'Jugador actualizado' })
    cerrarDialogoEdicion()
    await cargarDeportistas()
  } catch (error) {
    console.error(error)
    const mensaje = error.response?.data?.error || 'No se pudo actualizar al jugador'
    $q.notify({ type: 'negative', message: mensaje })
  } finally {
    editLoading.value = false
  }
}

onMounted(async () => {
  await cargarCategorias()
  await cargarAsignaciones()
  await cargarDeportistas()
})
</script>
