<template>
  <div class="games-container">
    <h1 class="site-title">{{ leagueData.name }}</h1>
    <breadcrumb />

    <div class="games-container_content white_card_background">
      <grid-table
        class="games-container_content_schedule"
        :columns="scheduleColumns"
        :rows="scheduleRows"
        :rowsCount="scheduleRows ? scheduleRows.length : 0"
        :hasHeader="scheduleColumns.length > 0"
        :title="'Games'"
        :hasPagination="false"
        :hasSizeSelector="false"
        :isLoading="tableLoading"
        @row-clicked="handleGameClick"
        @row-button-clicked="handleSubmitScoreClick"
      ></grid-table>
    </div>
  </div>
</template>

<script src="./games.ts"></script>
<style src="./games.scss" lang="scss"></style>