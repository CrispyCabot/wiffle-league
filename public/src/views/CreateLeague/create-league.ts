import { defineComponent } from "@vue/runtime-core";
import RadioButtonGroup from '@/components/inputs/radio-button-group/index.vue'
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: 'create-league',
  components: {
    RadioButtonGroup
  },
  data() {
    return {
      fields: {
        name: { value: '', label: 'League Name', placeholder: 'League Name', name: 'name', isRequired: true  },
        maxPlayers: { value: '', label: 'Max Players', placeholder: 'Max Players', name: 'maxPlayers', isRequired: true  },
        numGames: { value: '', label: 'Number of Games', placeholder: 'Number of Games', name: 'numGames', isRequired: true  },
        teamSize: { value: '', label: 'Team Size', placeholder: 'Team Size', name: 'teamSize', isRequired: true  },
        startDate: { value: '', label: 'Start Date', placeholder: 'Start Date', name: 'startDate', isRequired: true  },
        endDate: { value: '', label: 'End Date',  placeholder: 'End Date', name: 'endDate', isRequired: true  },
        deadlineDate: { value: '', label: 'Deadline Date', placeholder: 'Deadline Date', name: 'deadlineDate', isRequired: true  },
        gender: { value: '', label: 'Gender', placeholder: 'Gender', name: 'gender', isRequired: true  },
        other: { value: '', label: 'Other Info', placeholder: 'Other Info (Unique Rules, prizes, etc...)', name: 'other', isRequired: false  }
      },
      genderRadioButtons: [
        'Male',
        'Female',
        'Coed'
      ]
    }
  },
  computed: {
    ...mapGetters(['getIsLoggedIn', 'getLoggedInPlayer']),
    enabledCreateButton(): Boolean {
      return Boolean(
        this.fields.name.value &&
        this.fields.startDate.value &&
        this.fields.endDate.value &&
        this.fields.deadlineDate.value &&
        this.fields.maxPlayers.value &&
        this.fields.numGames.value &&
        this.fields.teamSize.value &&
        this.fields.gender.value &&
        this.isStartDateValid && 
        this.isEndDateValid && 
        this.isDeadlineDateValid &&
        this.getIsLoggedIn
      )
    },
    isStartDateValid(): Boolean {
      return Boolean(
        (new Date(this.fields.startDate.value) < new Date(this.fields.endDate.value)) ||
        this.fields.startDate.value == ''
      )
    },
    isEndDateValid(): Boolean {
      return Boolean(
        (new Date(this.fields.endDate.value)) > (new Date(this.fields.startDate.value)) ||
        this.fields.endDate.value == ''
      )
    },
    isDeadlineDateValid(): Boolean {
      return Boolean(
        (new Date(this.fields.deadlineDate.value) <= new Date(this.fields.startDate.value)) ||
        this.fields.deadlineDate.value == ''
      )
    }
  },
  methods: {
    ...mapActions(['createLeague']),
    async createLeagueClick() {
      const res = await this.createLeague({
        creatorId: this.getLoggedInPlayer._id,
        name: this.fields.name.value,
        maxPlayers: this.fields.maxPlayers.value,
        numGames: this.fields.numGames.value,
        teamSize: this.fields.teamSize.value,
        startDate: this.fields.startDate.value,
        endDate: this.fields.endDate.value,
        deadlineDate: this.fields.deadlineDate.value,
        other: this.fields.other.value,
        gender: this.fields.gender.value
      })
      if (res.status == 200) {
        this.$router.push(`/league/${res.league._id}`)
      }
    },
    setGender(gender: string) {
      this.fields.gender.value = gender
    }
  }
})