<template>
  <div class="players-container">

    <h1 class="site-title">Players</h1>

    <div class="players-container_content white_card_background">
      <div class="content-section players-container_content_overall-stats">
        <grid-table
          class="league-container_content_overall-stats_table"
          :columns="overallStatsColumns"
          :rows="statsRows"
          :rowsCount="statsRows ? statsRows.length : 0"
          :hasHeader="overallStatsColumns.length > 0"
          :label="'Overall Stats'"
          :hasPagination="true"
          :hasSizeSelector="true"
          :canHideContent="false"
          @row-clicked="playerClick"
        ></grid-table>
      </div>
    </div>

  </div>
</template>

<script src="./players.ts"></script>
<style src="./players.scss" lang="scss"></style>