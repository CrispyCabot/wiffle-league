<template>
  <div class="search-input" @click="focusInput">
    <input id="search_input" class="search-input_input" type="text" placeholder="Search..." v-model="searchValue" @input="valueChange" @keydown.enter.prevent="valueChange">
    <font-awesome-icon  class="search-input_icon" :icon="['fas', 'search']"></font-awesome-icon>
  </div>
</template>

<script src="./search-input.ts"></script>
<style src="./search-input.scss" lang="scss"></style>