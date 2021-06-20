import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import NOTIFICATION_TYPES from '@/utils/notificationTypes'
import CollapsibleTable from '@/components/tables/collapsible-table/index.vue'
import ContactModal from '@/components/popups/contact-modal/index.vue'

export default defineComponent({
  name: 'notifications',
  components: {
    CollapsibleTable,
    ContactModal
  },
  data() {
    return {
      collapsedSections: new Array<any>(),
      notifications: new Array<any>(),
      orderedNotificationSections: new Array<any>(),
      contactModalIsOpen: false,
      contactPlayer: {_id: ''},
      contactPlayerMessage: ''
    }
  },
  computed: {
    ...mapGetters(['getLoggedInPlayer'])
  },
  async created() {
    this.notifications = this.getLoggedInPlayer.notifications
    this.orderedNotificationSections = await this.getOrderedNotificationSections()
  },
  methods: {
    ...mapActions([
      'fetchPlayerById',
      'fetchLeagueById',
      'deleteNotifications',
      'reorderNotifications',
      'acceptLeagueInvitationNotification',
      'addPlayerToLeagueGivenId',
      'collapseNotifications',
      'sendNotification'
    ]),
    getSectionTitle(type: String): String {
      switch (type) {
        case 'LeagueInvitation':
        case 'league_invitations':
          return 'League Invitations'
        case 'LeagueUpdate':
        case 'league_updates':
          return 'League Updates'
        case 'LeagueJoinRequest':
        case 'league_join_requests':
          return 'League Join Requests'
        case 'ContactRequest':
        case 'contact_requests':
          return 'Contact Requests'
        case 'GeneralUpdate':
        case 'general_updates':
          return 'General Updates'
        case 'Other':
        case 'other':
          return 'Other'
        default:
          return ''
      }
    },
    getRowBtns(type: String): Array<any> {
      switch (type) {
        case 'LeagueInvitation':
        case 'league_invitations':
          return ['Accept', 'Deny']
        case 'LeagueUpdate':
        case 'league_updates':
          return ['View', 'Dismiss']
        case 'LeagueJoinRequest':
        case 'league_join_requests':
          return ['Accept', 'Deny']
        case 'ContactRequest':
        case 'contact_requests':
          return ['View', 'Dismiss']
        case 'GeneralUpdate':
        case 'general_updates':
          return ['View', 'Dismiss']
        case 'Other':
        case 'other':
          return ['Dismiss']
        default:
          return []
      }
    },
    getOrderedNotificationKeys(): Array<any> {
      if (!this.notifications) return []
      const sortedNotificationsKeys: Array<String> = Object.keys(this.notifications).sort((a: any, b: any) => {
        if (this.notifications[a].order_index < this.notifications[b].order_index) return -1
        if (this.notifications[a].order_index > this.notifications[b].order_index) return 1
        return 0
      })
      return sortedNotificationsKeys
    },
    async getOrderedNotificationSections(): Promise<any> {
      const sortedNotificationsKeys = this.getOrderedNotificationKeys()
      const sortedNotifications: any = []
      for (let i = 0; i < sortedNotificationsKeys.length; i++) {
        const key: any = sortedNotificationsKeys[i]
        sortedNotifications.push({
          rows: await Promise.all(this.getLoggedInPlayer.notifications[key].notifications
            .map(async (n: any) => {
              const sender = n.senderId ? await this.fetchPlayerById(n.senderId) : null
              const senderName = n.senderId ? `${sender.firstname} ${sender.lastname}` : ''
              const league = n.leagueId ? await this.fetchLeagueById(n.leagueId) : null
              const leagueName = n.leagueId ? league.name : ''
              return {
                ...n,
                title: (n.type === 'LeagueInvitation' || n.type === 'LeagueUpdate')
                  ? leagueName
                  : senderName,
                btns: !((n.type === 'LeagueUpdate' || n.type === 'league_updates') && n.message === 'League Deleted') ? this.getRowBtns(n.type) : ['Dismiss'] 
              }
            })
          ),
          sectionTitle: this.getSectionTitle(key),
          hasSubtitle: (key == 'league_join_requests' || key == 'league_updates'),
          sectionKey: key,
          isCollapsed: this.getLoggedInPlayer.notifications[key].collapsed
        })
      }
      return sortedNotifications
    },
    async handleRowHeaderClick(section: any) {
      this.notifications[section.sectionKey].collapsed = !this.notifications[section.sectionKey].collapsed
      await this.collapseNotifications({ playerId: this.getLoggedInPlayer._id, notifications: this.notifications})
      this.orderedNotificationSections = await this.getOrderedNotificationSections()
    },
    async handleRowBtnClick({btn, row, section}: any) {
      if (btn === 'Accept') {
        if (section.sectionKey === 'league_invitations') {
          const res = await this.acceptLeagueInvitationNotification({ playerId: this.getLoggedInPlayer._id, notification: row, sectionKey: section.sectionKey  })
          if (res.status === 200) {
            // TODO Toast message
          }
        } else if (section.sectionKey === 'league_join_requests') {
          const res = await this.addPlayerToLeagueGivenId({ playerId: this.getLoggedInPlayer._id, senderId: row.senderId, leagueId: row.leagueId })
          if (res.status === 200) {
            // TODO Toast message
            await this.deleteNotification(row, section)
          }
        }
      } else if (btn === 'View') {
        if (section.sectionKey === 'contact_requests') {
          this.contactPlayer = await this.fetchPlayerById(row.senderId)
          this.contactPlayerMessage = row.message
          this.toggleContactModal()
        } else {
          this.handleRowTitleClick({ row, section })
        }
      } else if (btn === 'Deny' || btn === 'Dismiss') {
        await this.deleteNotification(row, section)
      }
    },
    async handleRowTitleClick({ row, section}: any) {
      if ((section.sectionKey === 'league_updates' && row.message === '') || section.sectionKey === 'league_invitations') {
        this.$router.push(`/league/${row.leagueId}`)
      } else if (section.sectionKey === 'league_updates' && row.message !== '') {
        if (row.message === 'Scores posted' || row.message === 'Scores overwritten' || row.message === 'Game scheduled' || row.message === 'Game schedule changed') {
          this.$router.push(`/game-summary/${row.gameId}`)
        } else {
          this.$router.push(`/league/${row.leagueId}`)
        }
      } else if (section.sectionKey === 'contact_requests') {
        this.$router.push(`/player/${row.senderId}`)
      }
    },
    async deleteNotification(notification: any, notificationSection: any) {
      this.notifications[notificationSection.sectionKey].notifications = this.notifications[notificationSection.sectionKey].notifications.filter((n: any) => {
        return !(
          n.senderId === notification.senderId &&
          n.leagueId === notification.leagueId &&
          n.gameId === notification.gameId &&
          n.message === notification.message &&
          n.type === notification.type
        )
      })
      this.orderedNotificationSections = await this.getOrderedNotificationSections()
      const res = await this.deleteNotifications({ playerId: this.getLoggedInPlayer._id, notification: notification, sectionKey: notificationSection.sectionKey  })
      if (res.status === 200) {
        console.log('success')
      }
    },
    async mutatedSections(sections: any) {
      this.orderedNotificationSections = sections
      let orderHasChanged = false
      for (let i = 0; i < this.orderedNotificationSections.length; i++) {
        if (this.notifications[this.orderedNotificationSections[i].sectionKey].order_index !== i) orderHasChanged = true
        this.notifications[this.orderedNotificationSections[i].sectionKey].order_index = i
      }

      if (orderHasChanged) {
        const res = await this.reorderNotifications({ playerId: this.getLoggedInPlayer._id, notifications: this.notifications})
        if (res.status === 200) {
          console.log('success')
        }
      }
    },
    toggleContactModal() {
      this.contactModalIsOpen = !this.contactModalIsOpen
    },
    closeContactModal() {
      this.contactModalIsOpen = false
    },
    async sendContactNotification({ isSending, message, response }: any) {
      const playerId = this.contactPlayer._id
      const notification = {
        senderId: this.getLoggedInPlayer._id,
        leagueId: '',
        gameId: '',
        message: response,
        type: 'ContactRequest'
      }
      await this.sendNotification({ playerId, notification, notificationKey: 'contact_requests' })
      this.closeContactModal()
    },
  },
  watch: {
    async getLoggedInPlayer() {
      if (this.getLoggedInPlayer &&
        this.getLoggedInPlayer.notifications) {
        this.notifications = this.getLoggedInPlayer.notifications
        this.orderedNotificationSections = await this.getOrderedNotificationSections()
      }
    }
  }
})