<template>
  <div class="schedules-container">
    <h1 class="site-title">Schedules</h1>

    <div class="leagues-schedules white_card_background">
      <div class="leagues-schedules_dropdowns">
        <content-dropdown class="leagues-schedules_dropdowns_dropdown" v-for="league in splicedLeagues" :label="league.name" :key="league._id" @click="loadGames(league)">
          <Suspense>
            <template #default>
              <grid-table
                v-if="columns.length > 0 && !loadingGames"
                class="leagues-schedules_table"
                :columns="columns"
                :rows="findGames(league)"
                :rowsCount="findGames(league) ? findGames(league).length : 0"
                :hasHeader="true"
                :hasPagination="false"
                :hasSizeSelector="false"
                @row-clicked="handleGameClick"
              ></grid-table>
            </template>
            <template #fallback>
              <div>Loading...</div>
            </template>
          </Suspense>
        </content-dropdown>
        <pagination
          class="leagues-table_cards_pagination"
          :totalItemCount="shownLeagues.length"
          :pageIndex="pageIndex"
          :pageSize="pageSize"
          :hasSizeSelector="hasSizeSelector"
          :paginationRefresh="paginationRefresh"
          @page-index-change="changePageIndex($event)"
          @page-size-change="changePageSize($event)"
        />
      </div>
    </div>
  </div>
</template>

<script src="./schedules.ts"></script>
<style src="./schedules.scss" lang="scss"></style>