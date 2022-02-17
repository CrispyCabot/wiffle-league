<template>
  <div class="home">
    <div class="home_top">
      <h1 class="site-title">League Ninja</h1>
      <h4 class="site-title home_subtitle">
        You Play. We’ll Handle the Rest.
      </h4>
      <button class="btn white_btn" @click="redirect('/signup')">
        Sign up today!
      </button>
    </div>
    <div class="home_img-container">
      <img
        class="home_img-container_backgroundImg"
        :src="require('@/assets/multisport.png')"
      />
    </div>
    <div class="home_services">
      <div class="home_services_group">
        <i class="fas fa-medal fa-4x home_services_group_icon"></i>
        <p>Create Leagues</p>
      </div>
      <div class="home_services_group">
        <i class="fas fa-pen fa-4x home_services_group_icon"></i>
        <p>Track Stats</p>
      </div>
      <div class="home_services_group">
        <i class="fas fa-calendar-plus fa-4x home_services_group_icon"></i>
        <p>Build Schedules</p>
      </div>
    </div>
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
        :isLoading="tableLoading"
        @page-index-change="changePageIndex($event)"
        @page-size-change="changePageSize($event)"
        @row-clicked="handleLeagueClick"
        @sort-change="handleSortChange"
      ></grid-table>
    </div>
    <div class="home_btns">
      <h3>Want to join in on the fun?</h3>
      <button class="btn red_btn" @click="redirect('/players')">
        Find players
      </button>
      <button class="btn red_btn" @click="redirect('/leagues/create')">
        Create a League
      </button>
    </div>
    <div class="home_about">
      <h2>About</h2>
      <p>
        This website sprouted from the idea of creating a wiffle ball league
        with minimal planning. Through this website, you no longer need to go
        through some complex process to try and gather friends into a league.
        Using this can keep track of all the stats you need, and even
        automatically create the games for you, leaving you to just select dates
        and locations. Furthermore, you don’t even have to worry about trying to
        create balanced teams, since teams will be randomized every game!
        <br /><br />
        One key factor which led to the creation of this site was the idea of
        signing up individually, rather than with teams. This makes it super
        quick and easy to join a league and get in on the fun of wiffle ball!
        All you have to do is join a league, then let the league creator take
        care of selecting dates for games. Teams will be randomized every game
        and you are scored individually for the league, rather than as a team
        (though a win sure helps out your own score!)
        <br /><br />
        If you’ve got any ideas, suggestions, complaints, or whatever else,
        don’t hesitate to check out the ‘Contact’ page which can be found in the
        navigation above.
      </p>
    </div>
  </div>
</template>

<script src="./home.ts"></script>
<style src="./home.scss" lang="scss"></style>
