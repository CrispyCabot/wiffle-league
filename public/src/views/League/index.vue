<template>
  <div class="league-container">

    <div v-if="leagueData" class="league-container_content white_card_background">
      <p v-if="leagueData && leagueData.name" class="league-container_content_title">{{ leagueData.name }}</p>
      <p v-if="leagueData && !leagueData.games_created" class="league-container_content_sub-title">(League has not started)</p>

      <div v-if="isLeagueStarted" class="content-section league-container_content_leaderboard">
        <grid-table
          class="league-container_content_leaderboard"
          :columns="leaderboardColumns"
          :rows="leaderboardRows"
          :rowsCount="leaderboardRows ? leaderboardRows.length : 0"
          :hasHeader="true"
          :label="'Leaderboard'"
          :hasPagination="false"
          :hasSizeSelector="false"
          :canHideContent="true"
        ></grid-table>
      </div>
      <div v-if="isLeagueStarted" class="content-section league-container_content_schedule">
        <grid-table
          class="league-container_content_schedule"
          :columns="scheduleColumns"
          :rows="scheduleRows"
          :rowsCount="scheduleRows ? scheduleRows.length : 0"
          :hasHeader="scheduleColumns.length > 0"
          :label="'Schedule'"
          :hasPagination="false"
          :hasSizeSelector="false"
          :canHideContent="true"
        ></grid-table>
      </div>
      <div v-if="isLeagueStarted" class="content-section league-container_content_overall-stats">
        <grid-table
          class="league-container_content_overall-stats_table"
          :columns="overallStatsColumns"
          :rows="statsRows"
          :rowsCount="statsRows ? statsRows.length : 0"
          :hasHeader="overallStatsColumns.length > 0"
          :label="'Overall Stats'"
          :hasPagination="false"
          :hasSizeSelector="false"
          :canHideContent="true"
      ></grid-table>
      </div>

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
        <p class="league-rules" @click="$router.push('/rules')">View league rules...</p>
      </div>

      <div class="content-section league-container_content_buttons">
        <button v-if="isLoggedInPlayerCreatorOfLeague && !isLeagueStarted" class="btn red_btn" @click="startLeague">Start League</button>
        <button v-if="!isLeagueStarted && !isLoggedInPlayerInLeague" class="btn red_btn" @click="joinLeague">Request to join</button>
        <button v-if="isLeagueStarted && isLoggedInPlayerInLeague" class="btn red_btn" @click="submitScores">Submit scores</button>
        <p v-if="isLoggedInPlayerCreatorOfLeague" class="delete-league" @click="deleteLeague">Delete League</p>
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

      <div class="league-container_edit_settings">
        <div class="league-container_edit_settings_grid">
          <div v-for="field in fields" :key="field.name" class="league-container_edit_settings_grid_field" :class="{'full-width': field.type == 'radio-group'}">
            <div v-if="field.type === 'input' || field.type === 'date' || field.type === 'number'"
              class="league-container_edit_settings_grid_field_input"
              :class="{'invalid': 
                (field.isRequired && field.value == '') ||
                (field.name === 'deadlineDate' && !isDeadlineDateValid) ||
                (field.name === 'startDate' && !isStartDateValid) ||
                (field.name === 'endDate' && !isEndDateValid)
              }"
            >
              <label :for="field.name">{{ field.placeholder }}<span>{{ field.isRequired ? '*' : '' }}</span></label>
              <input class="default-input field-input"
                :disabled="!isSettingsEditing"
                :type="field.type === 'input' ? 'text' : field.type"
                :placeholder="field.placeholder"
                :name="field.name"
                v-model="field.value"
              >
            </div>
            <div v-if="field.type === 'text-area'"
              class="league-container_edit_settings_grid_field_text-area"
              :class="{'invalid': 
                (field.isRequired && field.value == '')
              }"
            >
              <label :for="field.name">{{ field.placeholder }}<span>{{ field.isRequired ? '*' : '' }}</span></label>
              <textarea class="default-input field-input"
                :disabled="!isSettingsEditing"
                :placeholder="field.placeholder"
                :name="field.name"
                :rows="3"
                v-model="field.value"
              ></textarea>
            </div>
            <div v-else-if="field.type === 'radio-group'" class="league-container_edit_settings_grid_field_radio-group">
              <radio-button-group :class="{'league-container_edit_settings_grid_field_radio-group-disabled': !isSettingsEditing}" :buttons="genderRadioButtons" :selectedRadioButton="field.value" @radio-button-change="setGender" />
            </div>
          </div>
        </div>
        <button v-if="!isSettingsEditing" class="btn red_btn league-container_edit_settings_btn-edit" @click="editSettings">Edit</button>
        <button v-else-if="isSettingsEditing" class="btn red_btn league-container_edit_settings_btn-save" :class="{'disabled': !isSaveEnabled}" @click="saveSettings">Save</button>
        <p v-if="isSettingsEditing" class="league-container_edit_settings_btn-cancel"  @click="cancelSettings">Cancel</p>
      </div>
    </div>

  </div>
</template>

<script src="./league.ts"></script>
<style src="./league.scss" lang="scss"></style>