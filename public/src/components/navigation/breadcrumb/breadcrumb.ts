import { defineComponent } from "vue"
import routeNames from '@/router/routeNames'
import { mapGetters } from "vuex"

export default defineComponent({
  name: 'breadcrumb',
  computed: {
    ...mapGetters(['getCurrentLeagueName', 'getCurrentPlayerName']),
    currentBreadcrumbs(): Array<any> {
      if (!this.$route.meta.breadcrumbs) return []
      if (!Array.isArray(this.$route.meta.breadcrumbs)) return []
      return this.$route.meta.breadcrumbs.map((crumb: any) => {
        return {
          path: this.$router.resolve({ name: crumb.name, params: this.$route.params, query: this.$route.query }).href,
          name: crumb.name,
          displayName: this.getDisplayNameData(crumb.name)
        }
      })
    }
  },
  methods: {
    getDisplayNameData(name: string) {
      if (name != 'league' && name != 'player') {
        return name.charAt(0).toUpperCase() + name.slice(1)
      } else if (name == 'league') {
        return this.getCurrentLeagueName
      } else if (name == 'player') {
        return this.getCurrentPlayerName
      }
    },
    redirect(path: any) {
      this.$router.replace(path)
    }
  }
})