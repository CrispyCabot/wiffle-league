<template>
  <div class="content-dropdown">
    <div class="content-dropdown_label" :class="{'open': isOpen}" @click="toggleIsOpen">
      <div class="content-dropdown_label_text">
        <font-awesome-icon v-if="iconClass" :icon="iconClass.split(' ')"></font-awesome-icon>
        <p v-if="label">{{ label }}</p>
      </div>
      <div class="content-dropdown_label_arrow">
        <font-awesome-icon :icon="['fas', 'chevron-down']"></font-awesome-icon>
      </div>
    </div>

      <transition name="slide-and-grow">
        <div v-if="isOpen" class="content-dropdown_content">
          <slot></slot>
        </div>
      </transition>
  </div>
</template>

<script src="./content-dropdown.ts"></script>
<style src="./content-dropdown.scss" lang="scss"></style>