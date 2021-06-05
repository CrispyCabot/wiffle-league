<template>
  <div class="home">
    <h1 class="site-title">Wiffle League</h1>
    <button class="btn red_btn" @click="redirect('/signup')">Sign up today!</button>
    <div class="league-table white_card_background ">
      <grid-table
        v-if="columns.length > 0"
        :columns="columns"
        :rows="splicedRows"
        :rowsCount="rows.length"
        :hasHeader="true"
        :title="'Leagues'"
        :hasPagination="hasPagination"
        :hasSizeSelector="hasSizeSelector"
        :pageIndex="pageIndex"
        :pageSize="pageSize"
        @page-index-change="changePageIndex($event)"
        @page-size-change="changePageSize($event)"
        @row-clicked="handleLeagueClick"
      ></grid-table>
    </div>
    <div class="thingy">
      <h3>Want to join in on the fun?</h3>
      <button class="btn red_btn" @click="redirect('/signup')">Sign Up</button>
      <button class="btn red_btn" @click="redirect('/leagues/create')">Create a League</button>
    </div>
    <div class="about">
      <h2>About</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ut metus eget libero facilisis aliquam. Phasellus in lobortis eros, ac dapibus elit. Curabitur ac magna ut metus finibus dapibus at in purus. Aenean consequat ipsum et orci mattis, a tristique ex mattis. Vestibulum eleifend libero quis arcu consequat, ac imperdiet purus feugiat. Nullam mauris quam, ultrices nec pellentesque vel, efficitur a nibh. Curabitur in enim quis velit sodales egestas luctus ac purus. Etiam nibh nulla, porttitor sit amet fringilla at, pretium ut quam. Maecenas dolor est, viverra non lobortis et, rutrum sit amet ligula.
        <br><br>
Morbi nisl nibh, facilisis at vehicula rhoncus, porttitor non dolor. Sed ac orci sagittis, accumsan ex sit amet, faucibus lacus. Quisque felis libero, blandit eget semper eu, scelerisque eu quam. Nunc vulputate lorem risus, ac hendrerit tellus consequat efficitur. Pellentesque nec tempor urna. Nam suscipit accumsan tortor molestie ultricies. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce ut erat sed dolor dignissim rhoncus eget id orci. Aenean erat quam, scelerisque tempor sapien id, varius volutpat mi. Quisque vulputate quis enim ut ultricies. Nam maximus, dui sed elementum gravida, nisi nibh aliquam libero, nec mollis quam tellus sit amet sem. Etiam eget massa sagittis, maximus metus id, molestie eros. Aliquam maximus orci eu lobortis porta. Etiam fringilla enim non blandit vehicula.</p>
    </div>
  </div>
</template>

<script src="./home.ts"></script>
<style src="./home.scss" lang="scss"></style>
