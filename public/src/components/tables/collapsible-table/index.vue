<template>
  <div class="collapsible-table">
    <div v-if="title" class="collapsible-table_title">{{ title }}</div>

    <div v-if="label" class="collapsible-table_label">
      <p>{{ label }}</p>
    </div>
    <div class="collapsible-table_table-container">
      <table class="collapsible-table_table">
        <tbody v-if="sections.length > 0" class="collapsible-table_table_body">        
          <tr v-for="section in sections" :key="section.title">
            <h6>{{section.title}}</h6>
            <font-awesome-icon :icon="['fas', 'chevron-down']"></font-awesome-icon>
          </tr>
        </tbody>
      </table>
      <div v-if="sections.length == 0" class="collapsible-table_table-empty">
        <h6>Oops!</h6>
        <p>No Data Found</p>
      </div>
    </div>
  </div>
</template>

<script src="./collapsible-table.ts"></script>
<style src="./collapsible-table.scss" lang="scss"></style>