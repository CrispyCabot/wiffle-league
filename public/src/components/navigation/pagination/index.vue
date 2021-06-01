<template>
  <div class="pagination-container">
    <div v-if="hasSizeSelector" class="pagination-container_pagination_page-size">
      <SimpleDropdown :items="pageSizes" :label="'Page size'" :selectedItem="pageSize" @select-item="pageSelection($event)"/>
    </div>
    <div class="pagination-container_pagination_page-index">
      <div class="arrow arrow-left" :class="{'inactive-arrow': startingPage == 1}">
        <font-awesome-icon :icon="['fas', 'chevron-left']" @click="pageStartChange"></font-awesome-icon>
      </div>
      <div class="indexs">
        <p v-for="(page, i) in displayedPageCount"
          :key="page"
          :class="{'active-page': startingPage + i - 1 == pageIndex}"
          @click="pageIndexChange(startingPage + i - 1)"
        >{{startingPage + i}}</p>
      </div>
      <div class="arrow arrow-right" :class="{'inactive-arrow': endingPage == maxPageCount}">
        <font-awesome-icon :icon="['fas', 'chevron-right']" @click="pageEndChange"></font-awesome-icon>
      </div>
    </div>
  </div>
</template>

<script src="./pagination.ts"></script>
<style src="./pagination.scss" lang="scss"></style>