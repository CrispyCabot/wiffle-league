<template>
  <div class="user-popup-container">
    <div class="user-popup-container_arrow" :class="alignment"></div>
    <div class="user-popup-container_links" :class="{'center-content': !getIsLoggedIn}">
      <div v-if="getIsLoggedIn" class="logged_in_links">
        <div class="link" @click="redirectLink('/profile')">
          <font-awesome-icon class="icon" :icon="['fas', 'user-circle']"></font-awesome-icon>
          <p>My profile</p>
        </div>
        <div class="link" @click="redirectLink('/notifications')">
          <font-awesome-icon class="icon" :icon="['fas', 'bell']"></font-awesome-icon>
          <p>My notifications</p>
        </div>
        <div class="link" @click="redirectLink('/my-leagues')">
          <font-awesome-icon class="icon" :icon="['fas', 'clipboard']"></font-awesome-icon>
          <p>My leagues</p>
        </div>
        <div class="link" @click="redirectLink('/logout')">
          <font-awesome-icon class="icon" :icon="['fas', 'sign-out-alt']"></font-awesome-icon>
          <p>Sign out</p>
        </div>
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