<template>
  <div class="login-container">
    <div class="login-container_title">
      <img :src="getLogo">
      <h1 class="site-title">Wiffle Ninja</h1>
    </div>
    <div class="login-container_fields">
      <div class="login-container_fields_field" v-for="field in fields" :key="field.name">
        <div v-if="field.name !== 'gender'"
          class="login-input"
          :class="{
            'extra-margin-top': field.value !== '',
            'error': (field.name == 'email' && !validEmail) ||
              (field.name == 'password' && !validPassword)
          }"
        >
          <transition name="slide">
            <label v-if="field.value !== ''" class="login-container_fields_field_label" :for="field.name">{{field.placeholder}}</label>
          </transition>
          <input class="default-input"
            :type="'text'"
            :placeholder="field.placeholder"
            :name="field.name"
            v-model="field.value"
          >
          <span class="login-input_required" v-if="field.isRequired">*</span>
          <span class="login-input_error email-error" v-if="(field.name == 'email' && !validEmail)">Please enter a valid email</span>
          <span class="login-input_error password-error" v-else-if="(field.name == 'password' && !validPassword)">Password must have at least 6 characters</span>
        </div>
        <radio-button-group v-else class="login-container_fields_field" :buttons="genderRadioButtons" :selectedRadioButton="field.value" @radio-button-change="setGender" />
      </div>
    </div>

    <button class="btn red_btn" :class="{'disabled': !enabledLoginButton}" @click="login">Log in</button>
    <p class="no_account_text" @click="redirect('/signup')">Don't have an account? Create one now</p>
  </div>
</template>

<script src="./login.ts"></script>
<style src="./login.scss" lang="scss"></style>