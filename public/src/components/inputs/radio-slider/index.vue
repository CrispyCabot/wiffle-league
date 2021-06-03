<template>
  <div class="radio-slider" @click="changeSelectedValue">
    <div class="radio-slider_label">
      <p>{{ selectedValue }}</p>
    </div>
    <div class="radio-slider_input">
      <input type="checkbox" :value="Boolean(getSelectedValueIndex)" @change="changeSelectedValue">
      <div class="radio-slider_input_display" :class="{'selected': Boolean(getSelectedValueIndex)}">
        <div class="radio-slider_input_display-circle" :class="{'selected': Boolean(getSelectedValueIndex)}"></div>
      </div>
    </div>
  </div>
</template>

<script src="./radio-slider.ts"></script>
<style src="./radio-slider.scss" lang="scss"></style>