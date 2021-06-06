<template>
  <div class="profile">

    <div class="profile-stats-table white_card_background ">

      <h1 class="profile-stats-table_firstname">{{getLoggedInPlayer.firstname}}</h1>
      <p v-if="getLoggedInPlayer.nickname" class="profile-stats-table_nickname">
        <span>a.k.a</span> <br> {{getLoggedInPlayer.nickname}}
      </p>

      <grid-table
        class="profile-stats-table_table"
        :columns="columns"
        :rows="splicedRows"
        :rowsCount="1"
        :hasHeader="columns.length > 0"
        :label="'Overall Stats'"
        :hasPagination="false"
        :hasSizeSelector="false"
      ></grid-table>
    </div>

  </div>
</template>

<script src="./profile.ts"></script>
<style src="./profile.scss" lang="scss"></style>