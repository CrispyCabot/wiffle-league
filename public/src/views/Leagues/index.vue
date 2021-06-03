<template>
  <div class="leagues-container">
    <h1 class="site-title">Leagues</h1>
    <div class="leagues-table white_card_background ">

      <div class="leagues-table_navigation">
        <search-input class="leagues-table_navigation_search" @search-value-change="searchValueChange" />
        <radio-slider class="leagues-table_navigation_radio" :values="displayValues" :selectedValue="selectedDisplayValue" @value-change="displayViewChange" />
      </div>

      <grid-table
        v-if="selectedDisplayValue == 'Detailed' && columns.length > 0"
        class="leagues-table_table"
        :columns="columns"
        :rows="splicedRows"
        :rowsCount="rows.length"
        :hasHeader="true"
        :hasPagination="hasPagination"
        :hasSizeSelector="hasSizeSelector"
        :pageIndex="pageIndex"
        :pageSize="pageSize"
        :paginationRefresh="paginationRefresh"
        @page-index-change="changePageIndex($event)"
        @page-size-change="changePageSize($event)"
        @row-clicked="handleLeagueClick"
      ></grid-table>

    </div>
  </div>
</template>

<script src="./leagues.ts"></script>
<style src="./leagues.scss" lang="scss"></style>