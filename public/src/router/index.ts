import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import routeNames from './routeNames'
import Home from '../views/Home/index.vue'
import NotFound from '../views/NotFound/index.vue'
import Rules from '../views/Rules/index.vue'
import SignUp from '../views/SignUp/index.vue'
import Login from '../views/Login/index.vue'
import Schedules from '../views/Schedules/index.vue'
import Leagues from '../views/Leagues/index.vue'
import Contact from '../views/Contact/index.vue'
import Players from '../views/Players/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: routeNames.Home,
    component: Home
  },
  {
    path: '/signup',
    name: routeNames.SignUp,
    component: SignUp
  },
  {
    path: '/login',
    name: routeNames.Login,
    component: Login
  },
  {
    path: '/leagues',
    name: routeNames.Leagues,
    component: Leagues
  },
  {
    path: '/rules',
    name: routeNames.Rules,
    component: Rules
  },
  {
    path: '/contact',
    name: routeNames.Contact,
    component: Contact
  },
  {
    path: '/schedules',
    name: routeNames.Schedules,
    component: Schedules
  },
  {
    path: '/players',
    name: routeNames.Players,
    component: Players
  },
  // Catch All Routes
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
