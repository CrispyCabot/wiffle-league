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
        fname: { value: '', placeholder: 'First Name', name: 'fname', isRequired: true, type: 'input' },
        lname: { value: '', placeholder: 'Last Name', name: 'lname', isRequired: true, type: 'input' },
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
          stats[s] = { text: this.getLoggedInPlayer.player_stats[s], type: 'numeric' } 
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
    },
    isSaveEnabled(): Boolean {
      return Boolean(
        this.fields.email.value &&
        this.fields.fname.value &&
        this.fields.lname.value &&
        this.fields.gender.value &&
        this.confirmPassMatch &&
        this.validEmail &&
        this.validPassword &&
        this.validPhone
      )
    },
    confirmPassMatch(): Boolean {
      return Boolean(this.fields.password.value == this.fields.confirm.value)
    },
    validEmail(): Boolean {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.fields.email.value).toLowerCase()) || this.fields.email.value == ''
    },
    validPassword(): Boolean {
      return (this.fields.password.value.length >= 6) || this.fields.password.value == ''
    },
    validPhone(): Boolean {
      const re = /^[0-9]{3}-[0-9]{3}-[0-9]{4}/
      const reNoDash = /^[0-9]{3}[0-9]{3}[0-9]{4}/
      return reNoDash.test(String(this.fields.phone.value.toLowerCase())) || re.test(String(this.fields.phone.value.toLowerCase())) || this.fields.phone.value == ''
    }
  },
  async created() {
    this.columns = await this.fetchPlayerStatsTableColumns()
    this.setupFieldsValues()
  },
  methods: {
    ...mapActions(['fetchPlayerStatsTableColumns', 'updateUserSettings']),
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
    async saveSettings() {
      this.updateUserSettings({ 
        playerId: this.getLoggedInPlayer._id,
        updates: {
          phone_number: Number(this.fields.phone.value.split('-').join('')),
          email: this.fields.email.value,
          firstname: this.fields.fname.value,
          lastname: this.fields.lname.value,
          nickname: this.fields.nname.value,
          password: this.fields.password.value,
          confirm_password: this.fields.confirm.value,
          show_information: Boolean(this.fields.contactInfo.value),
          gender: this.fields.gender.value
        }
      })
    },
    setupFieldsValues() {
      if (this.getLoggedInPlayer) {
        this.fields.phone.value = this.getLoggedInPlayer.phone_number
        this.formatPhone(null, true)
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
    },
    formatPhone(e: any, isPhone: boolean) {
      if (isPhone && this.fields.phone.value) {
        const phoneWithoutDashes = this.fields.phone.value.split('-').join('')
        const newValue = [
          phoneWithoutDashes.slice(0, 3),
          phoneWithoutDashes.slice(3, 6),
          phoneWithoutDashes.slice(6, 10)
        ]
        if (this.fields.phone.value.length >= 10) {
          this.fields.phone.value = newValue.filter(v => v != "").join('-')
        }
      }
    },
    redirect(link: string) {
      if (link == "top") {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      }
      else {
        this.$router.push(link)
      }
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