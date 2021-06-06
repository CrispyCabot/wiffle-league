<template>
  <div class="radio-button" @click="$emit('radio-button-click', button)">
    <div class="radio-button_circle" :class="{'radio-button_circle_selected': isSelected}"></div>
    <div class="radio-button_label">
      <p>{{button}}</p>
    </div>
  </div>
</template>

<script src='./radio-button.ts'></script>
<style src='./radio-button.scss' lang="scss" scoped></style>