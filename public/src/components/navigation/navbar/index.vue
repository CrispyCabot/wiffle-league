<template>
  <div class="navbar-container">
    <div v-if="isMobileView" class="navbar-container_mobile">
      <Hamburger :links="links" />
    </div>
    <div v-else class="navbar-container_desktop">
      <img :src="getLogo" @click="redirect({redirect: '/'})">
      <p v-for="link in links" :key="link.redirect" :class="{'active': link.redirect === $route.path}" @click="redirect(link)">{{ link.label }}</p>
    </div>

    <div class="navbar-container_profile" v-click-away="closeUserPopup">
      <div class="navbar-container_profile_icon">
        <div ref="notification_count" v-if="notificationCount > 0"><span>{{notificationCount}}</span></div>
        <font-awesome-icon class="user-icon" :icon="['fas', 'user-circle']" @click="toggleUserPopup"></font-awesome-icon>
      </div>
      <transition name="popup">
        <user-popup v-if="isUserPopupOpen" class="user-popup" @link-click="closeUserPopup" />
      </transition>
    </div>
  </div>
</template>

<script src="./navbar.ts"></script>
<style src="./navbar.scss" lang="scss"></style>