<template>
  <div class="schedules-container">
    <h1 class="site-title">Schedules</h1>

    <div class="leagues-schedules white_card_background">
      <multi-item-selector
        :selectedItems="selectedSchedulesNames"
        :items="allLeagueNames"
        :overrideText="selectedSchedules.filter(id => id != 'All').length == allLeagueNames.length
          ? 'All'
          : selectedSchedulesNames.length == 0
            ? 'None'
            : ''
          "
        :itemMaxCharacters="Math.floor((allLeagueNames.length / selectedSchedulesNames.length) * 3)"
        @multi-item-selection="handleScheduleSelection"
      />

      <div class="leagues-schedules_dropdowns">
        <content-dropdown class="leagues-schedules_dropdowns_dropdown" v-for="league in splicedLeagues" :label="league.name" :key="league._id" @click.stop="loadGames(league)">
          <grid-table
            v-if="columns.length > 0 && (!loadingGames || gamesShown.some(g => g.leagueId == league._id))"
            class="leagues-schedules_table"
            :columns="columns"
            :rows="findGames(league)"
            :rowsCount="findGames(league) ? findGames(league).length : 0"
            :hasHeader="true"
            :hasPagination="false"
            :hasSizeSelector="false"
            @row-clicked="handleGameClick"
          ></grid-table>
          <div v-if="loadingGames && !gamesShown.some(g => g.leagueId == league._id)" class="leagues-schedules_dropdowns_dropdown_loading">
            <span>Loading</span>
            <font-awesome-icon :icon="['fas', 'spinner']" class="fa-spin"></font-awesome-icon>
          </div>
          <p v-if="!loadingGames || gamesShown.some(g => g.leagueId == league._id)" class="leagues-schedules_dropdowns_dropdown_link" @click.stop="viewLeague(league)">View League...</p>
        </content-dropdown>

        <div v-if="splicedLeagues.length == 0" class="leagues-schedules_dropdowns_no-dropdowns">
          <h1>No leagues selected</h1>
          <font-awesome-icon class="no-dropdown-frown" :icon="['fas', 'frown']" ></font-awesome-icon>
        </div>

        <pagination
          v-if="splicedLeagues.length != 0"
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