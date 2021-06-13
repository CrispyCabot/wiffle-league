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
    </div>

    <div v-if="!gameIsCompleted && playerIsInGame" class="game-summary_submission white_card_background">
      <h1>Submit your scores...</h1>
      
      <div class="game-summary_submission_scores">
        <div class="game-summary_submission_scores_team1">
          <h6>{{team1.map(p => p.firstname).join(', ')}}</h6>
          <input type="number">
        </div>

        <h6 class="scores-dash">-</h6>

        <div class="game-summary_submission_scores_team2">
          <input type="number">
          <h6>{{team2.map(p => p.firstname).join(', ')}}</h6>
        </div>
      </div>

      <div class="game-summary_submission_stats">
        <div v-for="stat in fields" :key="stat" class="stat-field">
          <h6>{{stat.text}}</h6>
          <input type="number" v-model="stat.value">
        </div>
      </div>

      <button class="btn red_btn">Submit</button>
    </div>
  </div>
</template>

<script src="./game-summary.ts"></script>
<style src="./game-summary.scss" lang="scss"></style>