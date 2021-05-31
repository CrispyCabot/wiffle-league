import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import routeNames from './routeNames'
import Home from '../views/Home/index.vue'
import NotFound from '../views/NotFound/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: routeNames.Home,
    component: Home
  },
  {
    path: '/not-found',
    name: routeNames.NotFound,
    component: NotFound
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: {
      name: routeNames.NotFound
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
