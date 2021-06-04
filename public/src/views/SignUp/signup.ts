import { defineComponent } from "@vue/runtime-core";
import RadioButtonGroup from '@/components/inputs/radio-button-group/index.vue'

export default defineComponent({
  name: 'signup',
  components: {
    RadioButtonGroup
  },
  data() {
    return {
      email: '',
      password: '',
      confirm: '',
      fname: '',
      lname: '',
      nname: '',
      phone: '',
      genderRadioButtons: [
        'Male',
        'Female',
        'Other'
      ],
      selectedGender: ''
    }
  },
  methods: {
    setGender(gender: string) {
      this.selectedGender = gender
    }
  }
})