<template>
  <div class="user-popup-container">
    <div class="user-popup-container_arrow" :class="alignment"></div>
    <div class="user-popup-container_links" :class="{'center-content': !getIsLoggedIn}">
      <div v-if="getIsLoggedIn" class="logged_in_links">
        <div class="link" @click="redirectLink('/profile')">
          <font-awesome-icon class="icon" :icon="['fas', 'user-circle']"></font-awesome-icon>
          <p>My profile</p>
        </div>
        <div class="link" @click="redirectLink('/stats')">
          <font-awesome-icon class="icon" :icon="['fas', 'clipboard']"></font-awesome-icon>
          <p>My stats</p>
        </div>
        <p class="signout-link" @click="redirectLink('/logout')">Sign out...</p>
      </div>
      <div v-else-if="!getIsLoggedIn" class="not_logged_in_links">
        <p class="logged-out-text">You're not currently logged in</p>
        <button class="btn red_btn" @click="redirectLink('/signup')">Sign up</button>
        <button class="btn red_btn" @click="redirectLink('/login')">Log in</button>
      </div>
    </div>
  </div>
</template>

<script src="./user-popup.ts"></script>
<style src="./user-popup.scss" lang="scss"></style>