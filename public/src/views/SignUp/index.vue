<template>
  <div class="signup-container">
    <h1 class="home site-title">Wiffle League</h1>
    <img src="../../assets/logo.png">
    <div class="signup-container_fields">
      <div class="signup-container_fields_field" v-for="field in fields" :key="field.name">
        <div v-if="field.name !== 'gender'" class="login-input" :class="{'extra-margin-top': field.value !== ''}">
          <label v-if="field.value !== ''" class="signup-container_fields_field_label" :for="field.name">{{field.placeholder}}</label>
          <input class="default-input"
            :type="field.name !== 'phone' ? 'text' : 'tel'"
            :pattern="field.name !== 'phone' ? '' : '[0-9]{3}-[0-9]{3}-[0-9]{4}'"
            :placeholder="field.placeholder"
            :name="field.name"
            v-model="field.value"
          >
          <span v-if="field.isRequired">*</span>
        </div>
        <radio-button-group v-else class="signup-container_fields_field" :buttons="genderRadioButtons" :selectedRadioButton="field.value" @radio-button-change="setGender" />
      </div>
    </div>

    <button class="btn red_btn" @click="signUp">Sign Up</button>
  </div>
</template>

<script src="./signup.ts"></script>
<style src="./signup.scss" lang="scss"></style>