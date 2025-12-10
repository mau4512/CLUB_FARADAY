<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="q-pa-lg shadow-2" style="width: 400px; max-width: 90vw;">
          
          <!-- Logo arriba -->
          <q-card-section class="flex flex-center q-pb-none">
            <q-img
              src="~assets/sharks.png"
              alt="Logo Club Faraday"
              style="max-width: 120px"
              fit="contain"
            />
          </q-card-section>

          <!-- Título debajo del logo -->
          <q-card-section>
            <div class="text-h6 text-center">Ingreso - Club Faraday</div>
          </q-card-section>

          <!-- Formulario -->
          <q-card-section>
            <q-form @submit.prevent="handleLogin">
              <q-input
                v-model="correo"
                label="Correo"
                type="email"
                outlined
                dense
                class="q-mb-md"
                required
              />
              <q-input
                v-model="password"
                label="Contraseña"
                type="password"
                outlined
                dense
                required
              />
              <q-btn
                label="Ingresar"
                type="submit"
                color="primary"
                class="full-width q-mt-md"
                unelevated
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'  // usamos 'api' en lugar de 'axios'

const correo = ref('')
const password = ref('')
const router = useRouter()
const $q = useQuasar()

const handleLogin = async () => {
  try {
    const res = await api.post('/auth/login', {
      correo: correo.value,
      password: password.value
    })

    const { token, usuario } = res.data

    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))

    $q.notify({ type: 'positive', message: `Bienvenido, ${usuario.nombre}` })

    const destino = usuario.rol === 'admin' ? '/admin' : '/'
    router.push(destino)

  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.mensaje || 'Error al iniciar sesión'
    })
  }
}
</script>
