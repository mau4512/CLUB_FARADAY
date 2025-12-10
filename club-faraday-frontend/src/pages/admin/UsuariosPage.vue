<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">Gestión de Usuarios</div>

    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Registrar nuevo usuario</div>
        <q-form @submit.prevent="registrarUsuario">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="form.nombre"
                label="Nombre completo"
                dense
                outlined
                :rules="[val => !!val || 'Obligatorio']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="form.correo"
                label="Correo"
                type="email"
                dense
                outlined
                :rules="[val => !!val || 'Obligatorio']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="form.password"
                label="Contraseña"
                type="password"
                dense
                outlined
                :rules="[val => !!val || 'Obligatorio']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="form.rol"
                :options="rolesOptions"
                label="Rol"
                dense
                outlined
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="form.sedeId"
                :options="sedeOptions"
                label="Sede"
                dense
                outlined
                emit-value
                map-options
                :rules="[val => !!val || 'Obligatorio']"
                :loading="cargandoSedes"
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
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section class="row items-center q-col-gutter-sm">
        <div class="col">
          <div class="text-subtitle2">Usuarios registrados</div>
          <div class="text-caption text-grey-7">Solo los administradores pueden crear nuevos usuarios.</div>
        </div>
        <div class="col-auto">
          <q-select
            v-model="filtroRol"
            :options="[{ label: 'Todos los roles', value: null }, ...rolesOptions]"
            label="Filtrar por rol"
            dense
            outlined
            emit-value
            map-options
            style="min-width: 200px"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table
          flat
          :rows="usuariosFiltrados"
          :columns="columnas"
          row-key="id"
          :loading="cargando"
          no-data-label="Sin usuarios registrados"
        >
          <template #body-cell-sede="props">
            <q-td :props="props">
              {{ props.row.sede?.nombre || '-' }}
            </q-td>
          </template>
          <template #body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                dense
                round
                flat
                icon="edit"
                color="primary"
                @click="abrirDialogoEdicion(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width:500px; max-width:90vw;">
        <q-card-section>
          <div class="text-h6">Editar usuario</div>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="editForm">
          <q-form @submit.prevent="guardarEdicion">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input v-model="editForm.nombre" label="Nombre completo" dense outlined :rules="[val => !!val || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="editForm.correo" label="Correo" type="email" dense outlined :rules="[val => !!val || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="editForm.password" label="Nueva contraseña (opcional)" type="password" dense outlined />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="editForm.rol"
                  :options="rolesOptions"
                  label="Rol"
                  dense
                  outlined
                  emit-value
                  map-options
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="editForm.sedeId"
                  :options="sedeOptions"
                  label="Sede"
                  dense
                  outlined
                  emit-value
                  map-options
                  :loading="cargandoSedes"
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
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const usuarios = ref([])
const cargando = ref(false)
const guardando = ref(false)
const filtroRol = ref(null)
const editDialog = ref(false)
const editLoading = ref(false)
const editForm = ref(null)

const rolesOptions = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Entrenador', value: 'entrenador' }
]

const sedes = ref([])
const cargandoSedes = ref(false)
const sedeOptions = computed(() =>
  sedes.value.map(sede => ({
    label: sede.nombre,
    value: sede.id
  }))
)

const form = ref({
  nombre: '',
  correo: '',
  password: '',
  rol: 'entrenador',
  sedeId: null
})

const columnas = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' },
  { name: 'correo', label: 'Correo', field: 'correo', align: 'left' },
  { name: 'rol', label: 'Rol', field: 'rol', align: 'center', format: val => (val === 'admin' ? 'Administrador' : 'Entrenador') },
  { name: 'sede', label: 'Sede', field: row => row.sede?.nombre || '-', align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
]

const usuariosFiltrados = computed(() => {
  if (!filtroRol.value) {
    return usuarios.value
  }
  return usuarios.value.filter(usuario => usuario.rol === filtroRol.value)
})

const resetForm = () => {
  form.value = {
    nombre: '',
    correo: '',
    password: '',
    rol: 'entrenador',
    sedeId: sedes.value[0]?.id || null
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

const cargarUsuarios = async () => {
  cargando.value = true
  try {
    const { data } = await api.get('/usuarios')
    usuarios.value = data
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'No se pudieron cargar los usuarios' })
  } finally {
    cargando.value = false
  }
}

const registrarUsuario = async () => {
  guardando.value = true
  try {
    await api.post('/usuarios', form.value)
    $q.notify({ type: 'positive', message: 'Usuario creado correctamente' })
    resetForm()
    await cargarUsuarios()
  } catch (error) {
    console.error(error)
    const mensaje = error.response?.data?.error || 'No se pudo crear el usuario'
    $q.notify({ type: 'negative', message: mensaje })
  } finally {
    guardando.value = false
  }
}

const abrirDialogoEdicion = (usuario) => {
  editForm.value = {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    password: '',
    rol: usuario.rol,
    sedeId: usuario.sede?.id || null
  }
  if (!editForm.value.sedeId && sedes.value.length) {
    editForm.value.sedeId = sedes.value[0].id
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
    const payload = { ...editForm.value }
    if (!payload.password) {
      delete payload.password
    }
    await api.put(`/usuarios/${payload.id}`, payload)
    $q.notify({ type: 'positive', message: 'Usuario actualizado' })
    cerrarDialogoEdicion()
    await cargarUsuarios()
  } catch (error) {
    console.error(error)
    const mensaje = error.response?.data?.error || 'No se pudo actualizar el usuario'
    $q.notify({ type: 'negative', message: mensaje })
  } finally {
    editLoading.value = false
  }
}

onMounted(async () => {
  await cargarSedes()
  await cargarUsuarios()
})
</script>
