<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Encabezado -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Panel Administrativo</q-toolbar-title>

        <q-space />
        <q-btn
          flat
          round
          dense
          icon="logout"
          @click="logout"
          :title="'Cerrar sesión'"
        />
      </q-toolbar>
    </q-header>

    <!-- Contenido -->
    <q-page-container>
      <q-page class="q-pa-md">
        <div class="text-h5">Bienvenido, {{ usuario?.nombre || 'Administrador' }}</div>
        <div class="q-mt-md">Aquí irán los accesos rápidos y herramientas de gestión del Club Faraday.</div>

        <!-- Sección futura de tarjetas / accesos -->
        <div class="row q-col-gutter-md q-mt-lg">
          <q-card class="col-12 col-md-4" flat bordered>
            <q-card-section class="text-center">
              <div class="text-subtitle1">Gestión de Usuarios</div>
              <q-btn
                label="Ver usuarios"
                color="primary"
                class="q-mt-sm"
                @click="router.push('/admin/usuarios')"
              />
            </q-card-section>
          </q-card>

          <!-- Puedes duplicar tarjetas para más funcionalidades -->
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const usuario = ref(null)

onMounted(() => {
  const stored = localStorage.getItem('usuario')
  usuario.value = stored ? JSON.parse(stored) : null
})

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  router.push('/login')
}
</script>
