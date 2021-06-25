<template>
  <div class="home">
    <h1 class="site-title">Wiffle League</h1>
    <button class="btn red_btn" @click="redirect('/signup')">Sign up today!</button>
    <div class="home_league-table white_card_background ">
      <grid-table
        :columns="columns"
        :rows="splicedRows"
        :rowsCount="rows.length"
        :hasHeader="columns.length > 0"
        :title="'Leagues'"
        :hasPagination="hasPagination && columns.length > 0"
        :hasSizeSelector="hasSizeSelector"
        :pageIndex="pageIndex"
        :pageSize="pageSize"
        @page-index-change="changePageIndex($event)"
        @page-size-change="changePageSize($event)"
        @row-clicked="handleLeagueClick"
      ></grid-table>
    </div>
    <div class="home_btns">
      <h3>Want to join in on the fun?</h3>
      <button class="btn red_btn" @click="redirect('/players')">Find players</button>
      <button class="btn red_btn" @click="redirect('/leagues/create')">Create a League</button>
    </div>
    <div class="home_about">
      <h2>About</h2>
      <p>This website sprouted from the idea of creating a wiffle ball league with minimal planning. Through this website, you no longer need to go through some complex process to try and gather friends into a league. Using this can keep track of all the stats you need, and even automatically create the games for you, leaving you to just select dates and locations. Furthermore, you don’t even have to worry about trying to create balanced teams, since teams will be randomized every game!
        <br><br>
        One key factor which led to the creation of this site was the idea of signing up individually, rather than with teams. This makes it super quick and easy to join a league and get in on the fun of wiffle ball! All you have to do is join a league, then let the league creator take care of selecting dates for games. Teams will be randomized every game and you are scored individually for the league, rather than as a team (though a win sure helps out your own score!)
        <br><br>
        If you’ve got any ideas, suggestions, complaints, or whatever else, don’t hesitate to check out the ‘Contact’ page which can be found in the navigation above.
        </p>
    </div>
  </div>
</template>

<script src="./home.ts"></script>
<style src="./home.scss" lang="scss"></style>
