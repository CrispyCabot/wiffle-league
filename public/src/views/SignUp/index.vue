<template>
  <div class="signup-container">
    <h1 class="home site-title">Wiffle League</h1>
    <img src="../../assets/logo.png">
    <input class="default-input login-input" type="text" placeholder="email" name="email" v-model="email">
    <input class="default-input login-input" type="text" placeholder="password" name="password">
    <input class="default-input login-input" type="text" placeholder="confirm password" name="confirm password">
    <input class="default-input login-input" type="text" placeholder="First Name" name="fname">
    <input class="default-input login-input" type="text" placeholder="Last Name" name="lname">
    <input class="default-input login-input" type="text" placeholder="Nickname (Optional)" name="nickname">
    <input class="default-input login-input" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="Phone Number (Optional)" name="phonenumber">
    <radio-button-group :buttons="genderRadioButtons" :selectedRadioButton="selectedGender" @radio-button-change="setGender" />
    <button class="btn red_btn">Sign Up</button>
    <div style="height: 1vh;"></div>
  </div>
</template>

<script src="./signup.ts"></script>
<style src="./signup.scss" lang="scss"></style>