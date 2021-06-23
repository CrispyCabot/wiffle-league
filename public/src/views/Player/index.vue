<template>
  <div class="player">
    <div class="player-stats-table white_card_background ">

      <h1 v-if="player.firstname" class="player-stats-table_firstname">{{player.firstname}}</h1>
      <p v-if="player.nickname" class="player-stats-table_nickname">
        <span>a.k.a</span> <br> {{player.nickname}}
      </p>

      <grid-table
        class="player-stats-table_table"
        :columns="columns"
        :rows="row"
        :rowsCount="1"
        :hasHeader="columns.length > 0"
        :label="'Overall Stats'"
        :hasPagination="false"
        :hasSizeSelector="false"
        :hoverable="false"
      ></grid-table>

      <div class="player_leagues-info">
        <p class="player_leagues-info_label">League Standings</p>
        <row-card v-for="row in leagueRows" :key="row.id.text" :row="row" :columns="leagueColumns" @row-click="handleLeagueClick"/>
      </div>
      
      <div class="player_btns">
        <button class="btn red_btn" @click="toggleInviteToLeague">Invite to League</button>
        <div v-if="isInvitingToLeague" class="invite-to-league" v-click-away="closeInviteToLeague">
          <div class="invite-to-league_arrow"></div>
          <div class="invite-to-league_leagues">
            <div v-for="league in loggedInPlayersLeagues.filter(l => !l.player_ids.includes(player._id))" :key="league._id" class="invite-to-league_leagues_league" @click="inviteToLeague(league)">
              <p>{{ league.name }}</p>
            </div>
            <div v-if="loggedInPlayersLeagues.filter(l => !l.player_ids.includes(player._id)).length == 0" class="invite-to-league_leagues_no-leagues">
              <p>No leagues to invite this player to</p>
              <font-awesome-icon :icon="['fas', 'frown']"></font-awesome-icon>
            </div>
          </div>
        </div>
        
        <button  v-if="player.show_information" class="btn red_btn" @click.stop="toggleContactModal">Contact</button>
      </div>

      <div v-if="contactModalIsOpen" class="contact-modal-container">
        <contact-modal
          :player="player"
          :isSending="true"
          @close="closeContactModal"
          @send="sendContactNotification"
          v-click-away="closeContactModal"
        />
      </div>
    </div>

  </div>
</template>

<script src="./player.ts"></script>
<style src="./player.scss" lang="scss"></style>