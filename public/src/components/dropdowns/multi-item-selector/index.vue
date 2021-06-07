<template>
  <div class="multi-item-selector" v-click-away="closePopup">

    <p v-if="label" class="multi-item-selector_label">{{ label }}</p>
    <div class="multi-item-selector_selector" @click="togglePopup">
      <p v-if="overrideText">{{ overrideText }}</p>
      <p v-else>{{ selections }}</p>
      <font-awesome-icon :icon="['fas', 'chevron-down']"></font-awesome-icon>
    </div>

    <div v-if="isPopupOpen" class="multi-item-selector_popup">
      <div class="multi-item-selector_popup_links">
        <div class="multi-item-selector_popup_links_arrow"></div>
        <div class="multi-item-selector_popup_links_search">
          <search-input @search-value-change="$emit('search-value-change', $event)"/>
        </div>
        <div class="multi-item-selector_popup_links_items">
          <div v-for="item in items" :key="item" class="multi-item-selector_popup_links_items_item" @click="$emit('multi-item-selection', item)">
            <p>{{ item }}</p>
            <font-awesome-icon class="item-check" v-if="selectedItems.includes(item)" :icon="['fas', 'check']"></font-awesome-icon>
          </div>
          <div v-if="items.length == 0" class="multi-item-selector_popup_links_items_no-items">
            <p>No data to show</p>
            <font-awesome-icon class="no-items-frown" :icon="['fas', 'frown']" ></font-awesome-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./multi-item-selector.ts"></script>
<style src="./multi-item-selector.scss" lang="scss"></style>