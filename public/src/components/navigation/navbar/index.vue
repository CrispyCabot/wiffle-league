<template>
  <div class="navbar-container">
    <div v-if="isMobileView" class="navbar-container_mobile">
      <Hamburger :links="links" />
    </div>
    <div v-else class="navbar-container_desktop">
      <p v-for="link in links" :key="link.redirect">{{ link.label }}</p>
    </div>

    <div class="navbar-container_profile">
      <font-awesome-icon :icon="['fas', 'user-circle']"></font-awesome-icon>
    </div>
  </div>
</template>

<script src="./navbar.ts"></script>
<style src="./navbar.scss" lang="scss"></style>