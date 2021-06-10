<template>
  <div class="navbar-container">
    <div v-if="isMobileView" class="navbar-container_mobile">
      <Hamburger :links="links" />
    </div>
    <div v-else class="navbar-container_desktop">
      <img src="../../../assets/logo.png" @click="redirect({redirect: '/'})">
      <p v-for="link in links" :key="link.redirect" :class="{'active': link.redirect === $route.path}" @click="redirect(link)">{{ link.label }}</p>
    </div>

    <div class="navbar-container_profile" v-click-away="closeUserPopup">
      <font-awesome-icon :icon="['fas', 'user-circle']" @click="toggleUserPopup"></font-awesome-icon>
      <transition name="popup">
        <user-popup v-if="isUserPopupOpen" class="user-popup" @link-click="closeUserPopup" />
      </transition>
    </div>
  </div>
</template>

<script src="./navbar.ts"></script>
<style src="./navbar.scss" lang="scss"></style>