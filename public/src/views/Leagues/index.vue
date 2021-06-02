<template>
  <div class="leagues-container">
    <h1 class="site-title">Leagues</h1>
    <div class="leagues-table white_card_background ">
      <search-input @search-value-change="searchValueChange" />
      <radio-slider :values="displayValues" :selectedValue="selectedDisplayValue" @value-change="displayViewChange" />
    </div>
  </div>
</template>

<script src="./leagues.ts"></script>
<style src="./leagues.scss" lang="scss"></style>