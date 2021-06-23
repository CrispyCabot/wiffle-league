<template>
  <div class="signup-container">
    <div class="signup-container_title">
      <img src="../../assets/logo.png">
      <h1 class="site-title">Wiffle League</h1>
    </div>
    <div class="signup-container_fields">
      <div class="signup-container_fields_field" v-for="field in fields" :key="field.name">
        <div v-if="field.name !== 'gender'"
          class="login-input"
          :class="{
            'extra-margin-top': field.value !== '',
            'error': (field.name == 'email' && !validEmail) ||
              (field.name == 'password' && !validPassword) ||
              (field.name == 'confirm' && !confirmPassMatch) ||
              (field.name == 'phone' && !validPhone)

          }"
        >
          <transition name="slide">
            <label v-if="field.value !== ''" class="signup-container_fields_field_label" :for="field.name">{{field.placeholder}}</label>
          </transition>
          <input class="default-input"
            :id="field.name + '_elm'"
            :type="field.name !== 'phone' ? 'text' : 'tel'"
            :placeholder="field.placeholder"
            :name="field.name"
            v-model="field.value"
            @input="formatPhone($event, field.name == 'phone')"
          >
          <span class="login-input_required" v-if="field.isRequired">*</span>
          <span class="login-input_error email-error" v-if="(field.name == 'email' && !validEmail)">Please enter a valid email</span>
          <span class="login-input_error password-error" v-else-if="(field.name == 'password' && !validPassword)">Password must have at least 6 characters</span>
          <span class="login-input_error confirm-password-error" v-else-if="(field.name == 'confirm' && !confirmPassMatch)">Passwords do not match</span>
          <span class="login-input_error confirm-phone-error" v-else-if="(field.name == 'phone' && !validPhone)">Please enter a valid phone number</span>
        </div>
        <radio-button-group v-else class="signup-container_fields_field" :buttons="genderRadioButtons" :selectedRadioButton="field.value" @radio-button-change="setGender" />
      </div>
    </div>

    <button class="btn red_btn" :class="{'disabled': !enabledSignUpButton}" @click="signUp">Sign Up</button>
  </div>
</template>

<script src="./signup.ts"></script>
<style src="./signup.scss" lang="scss"></style>