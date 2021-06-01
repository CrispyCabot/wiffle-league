<template>
  <div class="home">
    <h1 class="site-title">Wiffle League</h1>
    <button class="btn red_btn">Sign up today!</button>
    <div class="league-table">
      <grid-table
        :columns="leagueTable.columns"
        :rows="leagueTable.rows"
        :hasHeader="true"
        :title="'Active Leagues'"
        :hasPagination="leagueTable.hasPagination"
        :pageIndex="leagueTable.pageIndex"
        :pageSize="leagueTable.pageSize"
        :startingPage="leagueTable.startingPage"
        :endingPage="leagueTable.endingPage"
        @page-index-change="changePageIndex($event)"
        @page-size-change="changePageSize($event)"
      ></grid-table>
    </div>
  </div>
</template>

<script src="./home.ts"></script>
<style src="./home.scss" lang="scss"></style>
