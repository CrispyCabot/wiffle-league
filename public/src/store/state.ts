import { reactive } from "@vue/reactivity"

export default reactive({
  isLoggedIn: false,
  loggedInPlayer: {},
  accessToken: ''
})