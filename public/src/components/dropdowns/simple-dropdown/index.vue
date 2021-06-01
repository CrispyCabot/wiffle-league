<template>
  <div class="simple-dropdown" v-click-away="closeContent">
    <div v-if="label" class="simple-dropdown_label">
      <p>{{label}}</p>
    </div>

    <div class="simple-dropdown_selected-item" @click="toggleContent">
      <p v-if="placeholder && !selectedItem">{{ placeholder }}</p>
      <p v-else>{{ selectedItem }}</p>
      <font-awesome-icon class="simple-dropdown_selected-item_icon" :class="{'open': !isCollapsed}" :icon="['fas', 'chevron-down']"></font-awesome-icon>
    </div>

    <div v-if="!isCollapsed" class="simple-dropdown_content-arrow"></div>
    <div v-if="!isCollapsed" class="simple-dropdown_content">
      <div v-for="item in items" :key="item" class="simple-dropdown_content_item" @click="selectItem(item)">
        <p>{{item}}</p>
      </div>
    </div>
  </div>
</template>

<script src="./simple-dropdown.ts"></script>
<style src="./simple-dropdown.scss" lang="scss"></style>