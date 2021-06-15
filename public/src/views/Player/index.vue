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

      <row-card v-for="row in leagueRows" :key="row.id.text" :row="row" :columns="leagueColumns" @row-click="handleLeagueClick"/>

      <button class="btn red_btn" @click="contact()">Contact</button>
      <button class="btn red_btn" @click="inviteToLeague()">Invite to League</button>
      <button class="btn red_btn" @click="contact()">Contact</button>
    </div>

  </div>
</template>

<script src="./player.ts"></script>
<style src="./player.scss" lang="scss"></style>