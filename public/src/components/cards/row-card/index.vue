<template>
  <div class="row-card" @click="$emit('row-click', row)">
    <div v-for="(col, key, index) in row"
    :key="index" class="row-card_column"
    :class="{
      'hidden': col.type == 'hidden',
      'numeric': col.type === 'numeric',
      'date': col.type === 'date',
      'string': col.type === 'string',
      'title': col.type === 'title',
      'info': col.type === 'info',
      'paddingBottom': col.type === 'title' && col.subtitle,
      'paddingTop': col.type === 'info' && col.heading
    }"
    :style="{'max-width': columns[index].maxWidth}">
      <p v-if="col.type == 'info'" class="row-card_column-heading">{{col.heading}}</p>
      <p>{{col.text}}</p>
      <p v-if="col.type == 'title'" class="row-card_column-subtitle">{{col.subtitle}}</p>
    </div>
    <div class="row-card_column arrow">
      <font-awesome-icon :icon="['fas', 'chevron-right']"></font-awesome-icon>
    </div>
  </div>
</template>

<script src="./row-card.ts"></script>
<style src="./row-card.scss" lang="scss"></style>