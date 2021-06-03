<template>
  <div class="league-container">
    <h1 class="site-title" v-if="leagueData && leagueData.name">{{ leagueData.name }}</h1>
  </div>
</template>

<script src="./league.ts"></script>
<style src="./league.scss" lang="scss"></style>