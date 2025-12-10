const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue')
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/admin/AdminHome.vue')
      },
      {
        path: 'usuarios',
        component: () => import('pages/admin/UsuariosPage.vue') // futuro
      },
      {
        path: 'deportistas',
        component: () => import('pages/admin/DeportistasPage.vue')
      },
      {
        path: 'horarios',
        component: () => import('pages/admin/HorariosPage.vue')
      },
      {
        path: 'asignaciones',
        component: () => import('pages/admin/AsignacionesPage.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]
  

export default routes
