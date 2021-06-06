<template>
  <div class="radio-button-group">
    <div class="radio-button-group_buttons">
      <radio-button class="radio-button-group_buttons_button"
        v-for="button in buttons"
        :key="button"
        :button="button"
        :isSelected="button === selectedRadioButton"
        @radio-button-click="radioButtonClick"
      />
    </div>
  </div>
</template>

<script src='./radio-button-group.ts'></script>
<style src='./radio-button-group.scss' lang="scss" scoped></style>