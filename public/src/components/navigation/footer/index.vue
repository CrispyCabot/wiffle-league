<template>
  <div class="footer-container">
    <div class="flex-container">
      <div class="logo">
        <img src="../../../assets/logo.png">
      </div>
      <div class="rhs">
        <div class="links">
          <p class="link" @click="redirect('top')">Top</p>
          <p class="link" @click="redirect('/leagues')">Leagues</p>
          <p class="link" @click="redirect('/')">Home</p>
          <p class="link" @click="redirect('/leagues/create')">Create League</p>
          <p class="link" @click="redirect('/leagues/schedules')">Schedules</p>
          <p class="link" @click="redirect('/rules')">Rules</p>
        </div>
        <p class="tiny-stuff">Copyright Wiffle League 2021</p>
      </div>
      <div v-if="!getIsLoggedIn" class="login-signup-links">
        <p class="link" @click="redirect('/login')">Log In</p>
        <p class="link" @click="redirect('/signup')">Sign Up</p>
      </div>
    </div>
  </div>
</template>

<script src="./footer.ts"></script>
<style src="./footer.scss" lang="scss"></style>