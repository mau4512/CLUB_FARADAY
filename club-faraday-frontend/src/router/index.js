import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { isAuthenticated, getUserRole } from 'src/utils/auth'  // 👈 importar funciones

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // ✅ PROTECCIÓN GLOBAL DE RUTAS
  Router.beforeEach((to, from, next) => {
    if (to.path.startsWith('/admin')) {
      if (!isAuthenticated()) {
        return next('/login')
      }
      if (getUserRole() !== 'admin') {
        return next('/') // o puedes redirigir a otra ruta según rol
      }
    }

    next()
  })

  return Router
})
