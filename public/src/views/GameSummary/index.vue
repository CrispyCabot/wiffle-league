<template>
  <div class="game-summary">
    <h1 class="site-title">Game Summary</h1>

    <div class="game-summary_summary white_card_background">
      <div class="game-summary_summary_teams">
        <div class="game-summary_summary_teams_team1">
          <h2>{{team1.map(p => p.firstname).join(', ')}}</h2>
        </div>
        <h6>vs</h6>
        <div class="game-summary_summary_teams_team2">
          <h2>{{team2.map(p => p.firstname).join(', ')}}</h2>
        </div>
      </div>

      <div class="game-summary_summary_info">
        <h2 v-if="gameData && gameData.game_date">{{new Date(gameData.game_date).toLocaleDateString()}}</h2>
        <h2 v-if="gameData && gameData.game_date">{{new Date(gameData.game_date).toLocaleTimeString(undefined, {hour: 'numeric', minute:'2-digit', hour12: true})}}</h2>
        <h2 v-if="gameData && gameData.game_location">{{gameData.game_location}}</h2>
      </div>

      <div v-if="!gameIsCompleted && playerIsInGame && !playerHasSubmittedScores" class="game-summary_summary_submission">
        <h1>Submit your scores</h1>
        <div class="game-summary_summary_submission_scores">
          <div class="game-summary_summary_submission_scores_team1">
            <h6>{{team1.map(p => p.firstname).join(', ')}}</h6>
            <input type="number" v-model="team1Score">
          </div>

          <h6 class="scores-dash">-</h6>

          <div class="game-summary_summary_submission_scores_team2">
            <input type="number" v-model="team2Score">
            <h6>{{team2.map(p => p.firstname).join(', ')}}</h6>
          </div>
        </div>
        <div class="game-summary_summary_submission_stats">
          <div v-for="stat in fields" :key="stat" class="stat-field">
            <h6>{{stat.text}}</h6>
            <input type="number" v-model="stat.value">
          </div>
        </div>
        <button class="btn red_btn" :class="{'disabled': !canSubmitScores}">Submit</button>
      </div>
      <div v-if="!gameIsCompleted && playerIsInGame && playerHasSubmittedScores" class="game-summary_summary_submission-has-submitted">
        <p>( Waiting for all players scores to be recorded... )</p>
        <h1>You have already submitted your scores for this game.</h1>
        <button class="btn red_btn">Re-Submit</button>
      </div>

      <div v-if="gameIsCompleted" class="game-summary_summary_completed">

        <div class="game-summary_summary_completed_scores">
          <div class="game-summary_summary_completed_scores_team1">
            <h6>{{team1.map(p => p.firstname).join(', ')}}</h6>
            <input type="number" v-model="team1Score">
          </div>

          <h6 class="scores-dash">-</h6>

          <div class="game-summary_summary_completed_scores_team2">
            <input type="number" v-model="team2Score">
            <h6>{{team2.map(p => p.firstname).join(', ')}}</h6>
          </div>
        </div>

        <div class="game-summary_summary_completed_stats">
          <grid-table
            class="game-summary_summary_completed_stats_table"
            :columns="overallStatsColumns"
            :rows="statsRows"
            :rowsCount="statsRows ? statsRows.length : 0"
            :hasHeader="overallStatsColumns.length > 0"
            :label="'Overall Stats'"
            :hasPagination="false"
            :hasSizeSelector="false"
          ></grid-table>
        </div>

      </div>
    </div>

  </div>
</template>

<script src="./game-summary.ts"></script>
<style src="./game-summary.scss" lang="scss"></style>