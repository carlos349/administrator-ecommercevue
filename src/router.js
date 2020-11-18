import Vue from 'vue'
import Router from 'vue-router'
import DashboardLayout from '@/layout/DashboardLayout'
import AuthLayout from '@/layout/AuthLayout'
Vue.use(Router)

export default new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: 'login',
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import(/* webpackChunkName: "demo" */ './views/Login.vue')
        },
        {
          path: '/register',
          name: 'register',
          component: () => import(/* webpackChunkName: "demo" */ './views/Register.vue')
        }
      ]
    },
    {
      path: '/',
      redirect: 'dashboard',
      component: DashboardLayout,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "demo" */ './views/Dashboard.vue')
        },
        {
          path: '/productos',
          name: 'productos',
          component: () => import(/* webpackChunkName: "demo" */ './views/Products.vue')
        },
        {
          path: '/clientes',
          name: 'clientes',
          component: () => import(/* webpackChunkName: "demo" */ './views/Clients.vue')
        },
        {
          path: '/promociones',
          name: 'promociones',
          component: () => import(/* webpackChunkName: "demo" */ './views/Promotions.vue')
        },
        {
          path: '/cotizaciones',
          name: 'cotizaciones',
          component: () => import(/* webpackChunkName: "demo" */ './views/Quotations.vue')
        },
        {
          path: '/usuarios',
          name: 'Usuarios',
          component: () => import(/* webpackChunkName: "demo" */ './views/Users.vue')
        },
        {
          path: '/tables',
          name: 'tables',
          component: () => import(/* webpackChunkName: "demo" */ './views/Tables.vue')
        }
      ]
    }
  ]
})
