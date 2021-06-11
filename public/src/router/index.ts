import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import routeNames from './routeNames'
import Home from '../views/Home/index.vue'
import NotFound from '../views/NotFound/index.vue'
import Rules from '../views/Rules/index.vue'
import SignUp from '../views/SignUp/index.vue'
import Login from '../views/Login/index.vue'
import Schedules from '../views/Schedules/index.vue'
import Leagues from '../views/Leagues/index.vue'
import League from '../views/League/index.vue'
import Contact from '../views/Contact/index.vue'
import Players from '../views/Players/index.vue'
import TopStats from '../views/TopStats/index.vue'
import CreateLeague from '../views/CreateLeague/index.vue'
import Profile from '../views/Profile/index.vue'
import Games from '../views/Games/index.vue'
import GameSummary from '../views/GameSummary/index.vue'

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
    path: '/profile',
    name: routeNames.Profile,
    component: Profile
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
    path: '/leagues',
    name: routeNames.Leagues,
    component: Leagues
  },
  {
    path: '/league/:id',
    name: routeNames.League,
    component: League
  },
  {
    path: '/league/:id/games',
    name: routeNames.Games,
    component: Games
  },
  {
    path: '/leagues/schedules',
    name: routeNames.Schedules,
    component: Schedules
  },
  {
    path: '/leagues/create',
    name: routeNames.CreateLeague,
    component: CreateLeague
  },
  {
    path: '/players',
    name: routeNames.Players,
    component: Players
  },
  {
    path: '/players/top-stats',
    name: routeNames.TopStats,
    component: TopStats
  },
  {
    path: '/game-summary/:id',
    name: routeNames.GameSummary,
    component: GameSummary
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
  routes,
  scrollBehavior() {
    window.scrollTo({ left: 0, top: 0, behavior: 'auto' })
  }
})

export default router
