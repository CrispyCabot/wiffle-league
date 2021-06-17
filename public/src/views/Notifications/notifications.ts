import { defineComponent } from "vue";
import CollapsibleTable from '@/components/tables/collapsible-table/index.vue'
import { mapGetters } from "vuex";

export default defineComponent({
  name: 'notifications',
  components: {
    CollapsibleTable
  },
  computed: {
    ...mapGetters(['getLoggedInPlayer']),
    notificationSections(): Array<Object> {
      if (!this.getLoggedInPlayer || !this.getLoggedInPlayer.notifications) return []
      const reducedNotifications = Object.keys(this.getLoggedInPlayer.notifications).reduce((acc: any, key: any) => {
        return [...acc, ...this.getLoggedInPlayer.notifications[key]]
      }, [])

      return reducedNotifications.map((n: any) => {
        n.title = this.getSectionTitle(n.type)
        return n
      })
    }
  },
  async created() {

  },
  methods: {
    getSectionTitle(type: String): String {
      switch (type) {
        case 'LeagueInvitation':
          return 'League Invitations'
        case 'LeagueUpdate':
          return 'League Updates'
        case 'LeagueJoinRequest':
          return 'League Join Requests'
        case 'ContactRequest':
          return 'Contact Requests'
        case 'GeneralUpdate':
          return 'General Updates'
        case 'Other':
          return 'Other'
        default:
          return ''
      }
    }
  }
})