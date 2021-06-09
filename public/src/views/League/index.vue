<template>
  <div class="league-container">

    <div v-if="leagueData" class="league-container_content white_card_background">
      <p v-if="leagueData && leagueData.name" class="league-container_content_title">{{ leagueData.name }}</p>
      <p v-if="leagueData && !leagueData.games_created" class="league-container_content_sub-title">(League has not started)</p>

      <div v-if="isLeagueStarted" class="content-section league-container_content_leaderboard"></div>
      <div v-if="isLeagueStarted" class="content-section league-container_content_schedule"></div>
      <div v-if="isLeagueStarted" class="content-section league-container_content_overall-stats"></div>

      <div v-if="!isLeagueStarted" class="content-section league-container_content_players">
        <grid-table
          :label="'Players'"
          :columns="playersColumns"
          :rows="playersRows"
          :rowsCount="playersRows.length"
          :hasHeader="false"
          :hasPagination="false"
          :hasSizeSelector="false"
          @row-button-clicked="handleKickPlayerClick"
        ></grid-table>
      </div>

      <div class="content-section league-container_content_league-info">
        <p>League Info</p>
        <div class="league-container_content_league-info_table">
          <table>
            <thead>
              <th>Creator</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Games Played</th>
            </thead>
            <tbody>
              <td>{{ creator.firstname + ' ' + creator.lastname }}</td>
              <td>{{ new Date(leagueData.start_date).toLocaleDateString() }}</td>
              <td>{{ new Date(leagueData.end_date).toLocaleDateString() }}</td>
              <td>{{ leagueData.num_games_completed ? leagueData.num_games_completed : 0 + '/' + leagueData.num_games }}</td>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="isLoggedInPlayerCreatorOfLeague || isLeagueStarted" class="content-section league-container_content_buttons">
        <button v-if="isLoggedInPlayerCreatorOfLeague && !isLeagueStarted" class="btn red_btn" @click="startLeague">Start League</button>
        <button v-if="isLeagueStarted" class="btn red_btn" @click="submitScores">Submit scores</button>
        <p v-if="isLoggedInPlayerCreatorOfLeague" @click="deleteLeague">Delete League</p>
      </div>
    </div>

    <div class="league-container_about white_card_background">
      <p class="league-container_about_title">About</p>

      <div class="league-container_about_content">
        <p>{{leagueData.about_text}}</p>
      </div>
    </div>

    <div v-if="isLoggedInPlayerCreatorOfLeague" class="league-container_edit white_card_background">
      <p class="league-container_edit_title">Edit League</p>
    </div>

  </div>
</template>

<script src="./league.ts"></script>
<style src="./league.scss" lang="scss"></style>