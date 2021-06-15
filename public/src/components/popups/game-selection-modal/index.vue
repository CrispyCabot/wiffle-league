<template>
  <div class="game-selection-modal">
    <div class="game-selection-modal_background" @click="$emit('cancel')"></div>

    <div class="game-selection-modal_content white_card_background">

      <div class="game-selection-modal_content_arrows">
        <font-awesome-icon class="icon" :icon="['fas', 'chevron-left']" @click="prevGame"></font-awesome-icon>
        <font-awesome-icon class="icon" :icon="['fas', 'chevron-right']" @click="nextGame"></font-awesome-icon>
      </div>

      <h1>Game {{currGameNum}}</h1>

      <div class="game-selection-modal_content_teams">
        <multi-item-selector
          :label="'Team 1'"
          :selectedItems="currentGame.team1Selections.map(p => { return { text: p.firstname, id: p._id } })"
          :items="[...currentGame.team1Selections.map(p => { return { text: p.firstname, id: p._id } }), ...unselectedPlayers.map(p => { return { text: p.firstname, id: p._id } })]"
          @multi-item-selection="team1Selection"
          @search-value-change="searchValueChange($event)"
          @closing-popup="searchValueChange('')"
        />
        <multi-item-selector
          :label="'Team 2'"
          :selectedItems="currentGame.team2Selections.map(p => { return { text: p.firstname, id: p._id } })"
          :items="[...currentGame.team2Selections.map(p => { return { text: p.firstname, id: p._id } }), ...unselectedPlayers.map(p => { return { text: p.firstname, id: p._id } })]"
          @multi-item-selection="team2Selection"
          @search-value-change="searchValueChange($event)"
          @closing-popup="searchValueChange('')"
        />
      </div>

      <div class="game-selection-modal_content_info">
        <label for="date">Date</label>
        <input class="default-input" type="date" name="date" id="date" v-model="currentGame.date">
        <label for="time">Time</label>
        <input class="default-input" type="time" name="time" id="time" v-model="currentGame.time">
        <label for="location">Location</label>
        <input class="default-input" type="text" name="location" id="location" placeholder="Location" v-model="currentGame.location">
      </div>

      <button class="btn red_btn" :class="{'disabled': !areAllGamesSubmitted}" @click="startLeague">Start League</button>
      <p class="cancel-btn" @click="$emit('cancel')">Cancel</p>
    </div>

  </div>
</template>

<script src="./game-selection-modal.ts"></script>
<style src="./game-selection-modal.scss" lang="scss"></style>
