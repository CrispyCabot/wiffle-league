<template>
  <div class="players-container">

    <h1 class="site-title">Players</h1>
    <breadcrumb />
    <div class="players-table white_card_background ">
      <grid-table
        class="players-table_table"
        :columns="overallStatsColumns"
        :rows="splicedRows"
        :rowsCount="statsRows ? statsRows.length : 0"
        :hasHeader="overallStatsColumns.length > 0"
        :label="'Overall Stats'"
        :hasPagination="hasPagination"
        :hasSizeSelector="hasSizeSelector"
        :pageIndex="pageIndex"
        :pageSize="pageSize"
        :paginationRefresh="paginationRefresh"
        @page-index-change="changePageIndex($event)"
        @page-size-change="changePageSize($event)"
        :canHideContent="false"
        :isLoading="tableLoading"
        @row-clicked="playerClick"
        @sort-change="handleSortChange"
      ></grid-table>
    </div>

  </div>
</template>

<script src="./players.ts"></script>
<style src="./players.scss" lang="scss"></style>