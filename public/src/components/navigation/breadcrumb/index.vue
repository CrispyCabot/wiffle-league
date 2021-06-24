<template>
  <div class="breadcrumb">
    <div class="breadcrumb_links">
      <div v-for="(crumb, index) in currentBreadcrumbs" :key="crumb.name" class="breadcrumb_links_link">
        <router-link
          class="breadcrumb_links_link-route"
          :to="crumb.path"
          @keydown.space.prevent="redirect(crumb.path)"
        >
          {{ crumb.displayName }}
        </router-link>
        <div v-if="index < currentBreadcrumbs.length - 1" class="breadcrumb_links_link-seperator"><font-awesome-icon :icon="['fas', 'chevron-right']"></font-awesome-icon></div>
      </div>
    </div>
  </div>
</template>

<script src="./breadcrumb.ts"></script>
<style src="./breadcrumb.scss" lang="scss"></style>
