<template>
  <div class="signup-container">
    <h1 class = "home site-title">Wiffle League</h1>
    <img src="../../assets/logo.png">
    <input class = "default-input login-input" type="text" placeholder = "email" id="email" name="email">
    <input class = "default-input login-input" type="text" placeholder = "password" id="password" name="password">
    <input class = "default-input login-input" type="text" placeholder = "confirm password" id="confirm-password" name="confirm password">
    <input class = "default-input login-input" type="text" placeholder = "First Name" id="fname" name="fname">
    <input class = "default-input login-input" type="text" placeholder = "Last Name" id="lname" name="lname">
    <input class = "default-input login-input" type="text" placeholder = "Nickname (Optional)" id="nickname" name="nickname">
    <input class = "default-input login-input" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder = "Phone Number (Optional)" id="phonenumber" name="phonenumber">
    <div class = "gender">
      <input type="radio" name="gender" value="male"> Male
      <input type="radio" name="gender" value="female"> Female
      <input type="radio" name="gender" value="other"> Other
    </div>
    <button class="btn red_btn">Sign Up</button>
    <div style = "height: 1vh;"></div>
  </div>
</template>

<script src="./signup.ts"></script>
<style src="./signup.scss" lang="scss"></style>