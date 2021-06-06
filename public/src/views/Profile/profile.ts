import { defineComponent } from "@vue/runtime-core"
import GridTable from '@/components/tables/grid-table/index.vue'
import ContentDropdown from '@/components/dropdowns/content-dropdown/index.vue'
import PaginationMixin from '@/mixins/pagination-mixin'
import RadioSlider from '@/components/inputs/radio-slider/index.vue'
import RadioButtonGroup from '@/components/inputs/radio-button-group/index.vue'
import { mapActions, mapGetters } from "vuex"

export default defineComponent({
  name: 'profile',
  components: {
    GridTable,
    ContentDropdown,
    RadioSlider,
    RadioButtonGroup
  },
  mixins: [PaginationMixin],
  data() {
    return {
      columns: [],
      fields: {
        phone: { value: '', placeholder: 'Phone', name: 'phone', isRequired: false, type: 'input' },
        email: { value: '', placeholder: 'Email', name: 'email', isRequired: true, type: 'input' },
        fname: { value: '', placeholder: 'First Name', name: 'fname', isRequired: false, type: 'input' },
        lname: { value: '', placeholder: 'Last Name', name: 'lname', isRequired: false, type: 'input' },
        nname: { value: '', placeholder: 'Nick Name', name: 'nname', isRequired: false, type: 'input' },
        contactInfo: { value: false, placeholder: 'Show contact info', name: 'contactInfo', isRequired: true, type: 'radio' },
        password: { value: '', placeholder: 'New password', name: 'password', isRequired: false, type: 'input' },
        confirm: { value: '', placeholder: 'Confirm password', name: 'confirm', isRequired: false, type: 'input' },
        gender: { value: '', placeholder: 'Gender', name: 'gender', isRequired: true, type: 'radio-group' }
      },
      genderRadioButtons: [
        'Male',
        'Female',
        'Other'
      ],
      isSettingsEditing: false
    }
  },
  computed: {
    ...mapGetters(['getIsLoggedIn', 'getLoggedInPlayer']),
    stats(): any {
      if (!this.getLoggedInPlayer) return {}
      const stats: { [key: string]: any } = {}

      if (this.getLoggedInPlayer.player_stats) {
        Object.keys(this.getLoggedInPlayer.player_stats).forEach((s: string) => {
          stats[s] = { text: this.getLoggedInPlayer.player_stats[s], type: 'numeric-left' } 
        })
      }

      return stats
    },
    row(): Array<Object> {
      if (!this.stats) return []
      return [ this.stats ]
    },
    splicedRows(): Array<Object> {
      return this.row.slice(this.startingIndex, this.endingIndex)
    },
    isFieldShown(): any {
      return (field: any) => {
        return (field.name != 'confirm' && field.name != 'password') ? true : this.isSettingsEditing
      }
    }
  },
  async created() {
    this.columns = await this.fetchPlayerStatsTableColumns()
    this.setupFieldsValues()
  },
  methods: {
    ...mapActions(['fetchPlayerStatsTableColumns']),
    changeRadioValue(e: boolean, field: any) {
      if (field.name == 'contactInfo') {
        this.fields.contactInfo.value = e
      }
    },
    editSettings() {
      this.isSettingsEditing = true
    },
    cancelSettings() {
      this.isSettingsEditing = false
      this.setupFieldsValues()
    },
    saveSettings() {
      console.log(this.fields)
    },
    setupFieldsValues() {
      if (this.getLoggedInPlayer) {
        this.fields.phone.value = this.getLoggedInPlayer.phone_number
        this.fields.email.value = this.getLoggedInPlayer.email
        this.fields.fname.value = this.getLoggedInPlayer.firstname
        this.fields.lname.value = this.getLoggedInPlayer.lastname
        this.fields.nname.value = this.getLoggedInPlayer.nickname
        this.fields.contactInfo.value = this.getLoggedInPlayer.show_information
        this.fields.gender.value = this.getLoggedInPlayer.gender
      }
    },
    setGender(gender: string) {
      this.fields.gender.value = gender
    }
  },
  watch: {
    getLoggedInPlayer() {
      if (this.fields) {
        this.setupFieldsValues()
      }
    }
  }
})