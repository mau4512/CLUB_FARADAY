<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Menú lateral -->
    <q-drawer show-if-above v-model="drawer" side="left" bordered>
      <q-list padding>
        <q-item-label header>Administrador</q-item-label>

        <q-item clickable v-ripple to="/admin" exact>
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Inicio</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/usuarios">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>Usuarios</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/deportistas">
          <q-item-section avatar>
            <q-icon name="sports_handball" />
          </q-item-section>
          <q-item-section>Jugadores</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/horarios">
          <q-item-section avatar>
            <q-icon name="schedule" />
          </q-item-section>
          <q-item-section>Horarios</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/asignaciones">
          <q-item-section avatar>
            <q-icon name="assignment_ind" />
          </q-item-section>
          <q-item-section>Asignaciones</q-item-section>
        </q-item>

        <!-- Puedes seguir agregando más rutas -->
      </q-list>
    </q-drawer>

    <!-- Barra superior -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title>Panel Administrativo</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Contenido de la página -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
const drawer = ref(true)
</script>
