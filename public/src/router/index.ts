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
import Player from '../views/Player/index.vue'
import CreateLeague from '../views/CreateLeague/index.vue'
import Profile from '../views/Profile/index.vue'
import Games from '../views/Games/index.vue'
import GameSummary from '../views/GameSummary/index.vue'
import Notifications from '../views/Notifications/index.vue'
import MyLeagues from '../views/MyLeagues/index.vue'

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
    path: '/notifications',
    name: routeNames.Notifications,
    component: Notifications
  },
  {
    path: '/my-leagues',
    name: routeNames.MyLeagues,
    component: MyLeagues
  },
  {
    path: '/rules',
    name: routeNames.Rules,
    component: Rules,
    meta: {
      breadcrumbs: [
        { name: routeNames.Home },
        { name: routeNames.Rules }
      ]
    }
  },
  {
    path: '/contact',
    name: routeNames.Contact,
    component: Contact,
    meta: {
      breadcrumbs: [
        { name: routeNames.Home },
        { name: routeNames.Contact }
      ]
    }
  },
  {
    path: '/leagues',
    name: routeNames.Leagues,
    component: Leagues,
    meta: {
      breadcrumbs: [
        { name: routeNames.Home },
        { name: routeNames.Leagues }
      ]
    }
  },
  {
    path: '/league/:leagueId',
    name: routeNames.League,
    component: League,
    meta: {
      breadcrumbs: [
        { name: routeNames.Home },
        { name: routeNames.Leagues },
        { name: routeNames.League }
      ]
    }
  },
  {
    path: '/league/:leagueId/player/:playerId',
    name: routeNames.LeaguePlayer,
    component: Player,
    meta: {
      breadcrumbs: [
        { name: routeNames.Home },
        { name: routeNames.Leagues },
        { name: routeNames.League },
        { name: routeNames.Player }
      ]
    }
  },
  {
    path: '/league/:leagueId/games',
    name: routeNames.Games,
    component: Games,
    meta: {
      breadcrumbs: [
        { name: routeNames.Home },
        { name: routeNames.Leagues },
        { name: routeNames.League },
        { name: routeNames.Games }
      ]
    }
  },
  {
    path: '/league/:leagueId/game-summary/:gameId',
    name: routeNames.GameSummary,
    component: GameSummary,
    meta: {
      breadcrumbs: [
        { name: routeNames.Home },
        { name: routeNames.Leagues },
        { name: routeNames.League },
        { name: routeNames.Games },
        { name: routeNames.GameSummary }
      ]
    }
  },
  {
    path: '/leagues/schedules',
    name: routeNames.Schedules,
    component: Schedules,
    meta: {
      breadcrumbs: [
        { name: routeNames.Home },
        { name: routeNames.Leagues },
        { name: routeNames.Schedules }
      ]
    }
  },
  {
    path: '/leagues/create',
    name: routeNames.CreateLeague,
    component: CreateLeague,
    meta: {
      breadcrumbs: [
        { name: routeNames.Home },
        { name: routeNames.Leagues },
        { name: routeNames.CreateLeague }
      ]
    }
  },
  {
    path: '/players',
    name: routeNames.Players,
    component: Players,
    meta: {
      breadcrumbs: [
        { name: routeNames.Home },
        { name: routeNames.Players }
      ]
    }
  },
  {
    path: '/player/:playerId',
    name: routeNames.Player,
    component: Player,
    meta: {
      breadcrumbs: [
        { name: routeNames.Home },
        { name: routeNames.Players },
        { name: routeNames.Player }
      ]
    }
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
