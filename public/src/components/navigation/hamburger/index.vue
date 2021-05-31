<template>
  <div class="hamburger-container">
    <div class="hamburger-container_icon">
      <font-awesome-icon :icon="['fas', 'bars']" @click="toggleLinks"></font-awesome-icon>
    </div>

    <transition name="links">
      <div v-show="isLinksOpen" class="hamburger-container_links">
        <font-awesome-icon class="hamburger-container_links_icon" :icon="['fas', 'times']" @click="closeLinks"></font-awesome-icon>
        <div v-for="link in links" :key="link" class="hamburger-container_links_link">
          <font-awesome-icon class="hamburger-container_links_link_icon" :icon="['fas', link.icon]"></font-awesome-icon>
          <p class="hamburger-container_links_link_label">{{link.label}}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script src="./hamburger.ts"></script>
<style src="./hamburger.scss" lang="scss"></style>