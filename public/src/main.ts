import { createApp } from 'vue'
import App from './app.vue'
import router from './router'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas  } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueClickAway from "vue3-click-away"
const InlineSvg = require('vue-inline-svg')

library.add(fas)
library.add(fab)

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('inline-svg', InlineSvg)
  .use(store)
  .use(router)
  .use(VueClickAway)
  .mount('#app')
