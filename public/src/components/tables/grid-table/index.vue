<template>
  <div class="grid-table">
    <div v-if="title" class="grid-table_title">{{ title }}</div>

    <div class="grid-table_table-container">
      <div v-if="label" class="grid-table_label">{{ label }}</div>
      <table class="grid-table_table">
        <thead v-if="hasHeader" class="grid-table_table_head">
          <th v-for="column in columns" :key="column.columnLabel">{{column.columnLabel}}</th>
        </thead>
        <tbody class="grid-table_table_body">
          <tr v-for="row in rows" :key="row.name" class="grid-table_table_body_row">
            <td v-for="(col, key, index) in row"
              :key="col"
              class="grid-table_table_body_row_cell"
              :class="{
                'numeric': col.type === 'numeric',
                'date': col.type === 'date',
                'string': col.type === 'string'
              }"
              :style="{'max-width': columns[index].maxWidth}"
            >{{col.text}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="hasPagination" class="grid-table_pagination">
      <div class="grid-table_pagination_page-size"></div>
      <div class="grid-table_pagination_page-index">
        <div class="arrow arrow-left" :class="{'inactive-arrow': startingPage == 1}">
          <font-awesome-icon :icon="['fas', 'chevron-left']"></font-awesome-icon>
        </div>
        <div class="indexs">
          <p v-for="page in pageCount"
            :key="page"
            :class="{'active-page': page == pageIndex}"
            @click="$emit('page-index-change', page)"
          >{{page}}</p>
        </div>
        <div class="arrow arrow-right" :class="{'inactive-arrow': endingPage == pageCount}">
          <font-awesome-icon :icon="['fas', 'chevron-right']"></font-awesome-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./grid-table.ts"></script>
<style src="./grid-table.scss" lang="scss"></style>