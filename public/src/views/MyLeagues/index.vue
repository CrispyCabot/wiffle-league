<template>
  <div class="leagues-container">
    <h1 class="site-title">My Leagues</h1>
    <div v-if="!getIsLoggedIn" class="white_card_background">
      <h3 class="not-logged-in" @click="redirect({redirect: '/login'})">Login to view your leagues</h3>
    </div>
      
    <div v-if="getIsLoggedIn" class="leagues-table white_card_background ">

      <div class="leagues-table_navigation">
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
        :isLoading="tableLoading"
        @page-index-change="changePageIndex($event)"
        @page-size-change="changePageSize($event)"
        @row-clicked="handleLeagueClick"
        @sort-change="handleSortChange"
      ></grid-table>

      <div v-if="selectedDisplayValue == 'Simple' && columns.length > 0 && splicedRows.length > 0" class="leagues-table_cards">
        <row-card v-for="row in splicedRows" :key="row.id.text" :row="row" :columns="columns" @row-click="handleLeagueClick" />
        <pagination
          class="leagues-table_cards_pagination"
          :totalItemCount="rows.length"
          :pageIndex="pageIndex"
          :pageSize="pageSize"
          :hasSizeSelector="hasSizeSelector"
          :paginationRefresh="paginationRefresh"
          @page-index-change="changePageIndex($event)"
          @page-size-change="changePageSize($event)"
        />
      </div>
      <div v-if="selectedDisplayValue == 'Simple' && splicedRows.length == 0" class="leagues-table_no-cards">
        <h1>No data</h1>
        <font-awesome-icon :icon="['fas', 'frown']"></font-awesome-icon>
      </div>

      <button class="leagues-table_btn btn red_btn" @click="$router.push('/leagues/schedules')">View schedules</button>
    </div>

    <div class="leagues-container_btns">
      <h3>Want to join in on the fun?</h3>
      <button class="create-league-btn btn red_btn" @click="$router.push('/leagues/create')">Create a League</button>
    </div>
  </div>
</template>

<script src="./my-leagues.ts"></script>
<style src="./my-leagues.scss" lang="scss"></style>