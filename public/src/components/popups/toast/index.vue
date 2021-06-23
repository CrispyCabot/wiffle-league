<template>
  <div class="toast" @dblclick="close">
    <div class="toast_sidebar" :class="type" :style="{'height': slider + '%'}"></div>
    <div class="toast_sidebar_background" :class="type"></div>
    <font-awesome-icon class="toast_close-icon" :icon="['fas', 'times']" @click="close"></font-awesome-icon>

    <div class="toast_content">
      <div class="toast_content_icon" :class="type">
        <font-awesome-icon v-if="toastTypeIcon" :icon="toastTypeIcon"></font-awesome-icon>
      </div>
      <div class="toast_content_text">
        <div class="toast_content_text_type"><p>{{ type.charAt(0).toUpperCase() + type.slice(1) }}</p></div>
        <div class="toast_content_text_message"><p>{{ message }}</p></div>
      </div>
    </div>
  </div>
</template>

<script src="./toast.ts"></script>
<style src="./toast.scss" lang="scss"></style>
