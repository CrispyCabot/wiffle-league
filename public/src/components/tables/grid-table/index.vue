<template>
  <div class="grid-table">
    <div v-if="title" class="grid-table_title">{{ title }}</div>

    <div v-if="label" class="grid-table_label" :class="{'open': isContentOpen, 'closed': !isContentOpen}">
      <font-awesome-icon v-if="canHideContent" class="grid-table_label-icon" :icon="['fas', 'chevron-circle-down']" @click="toggleIsContentOpen"></font-awesome-icon>
      <p @click="toggleIsContentOpen">{{ label }}</p>
    </div>
    <div v-if="isContentOpen || !canHideContent" class="grid-table_table-container">
      <table class="grid-table_table">
        <thead v-if="hasHeader" class="grid-table_table_head">
          <th v-for="column in columns" :key="column.columnLabel" :class="{'hidden': column.isHidden}">{{column.columnLabel}}</th>
        </thead>
        <tbody v-if="rowsCount > 0" class="grid-table_table_body">
          <tr v-for="row in rows" :key="row.name" class="grid-table_table_body_row" @click="$emit('row-clicked', row)">
            <td v-for="(col, key, index) in row"
              :key="col"
              class="grid-table_table_body_row_cell"
              :class="{
                'numeric': col.type === 'numeric' || col.type == 'numeric-wrap',
                'numeric-left': col.type === 'numeric-left' || col.type == 'numeric-left-wrap',
                'date': col.type === 'date' || col.type == 'date-wrap',
                'string': col.type === 'string' || col.type == 'string-wrap',
                'location': col.type === 'location' || col.type == 'location-wrap',
                'wrap': col.type === 'string-wrap' || col.type === 'date-wrap' || col.type === 'numeric-wrap' || col.type === 'location-wrap',
                'button': col.type === 'button',
                'hidden': col.type === 'hidden'
              }"
              :style="{'max-width': columns[index] ? columns[index].maxWidth : 'unset'}"
            >
              <span v-if="col.type != 'button'">{{col.text}}</span>
              <span v-if="col.type == 'button'"> <button class="btn red_btn" @click.stop="$emit('row-button-clicked', row, col)">{{col.text}}</button> </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="rowsCount == 0" class="grid-table_table-empty">
        <h6>Oops!</h6>
        <p>No Data Found</p>
      </div>
    </div>

    <div v-if="hasPagination" class="grid-table_pagination">
      <pagination
        :totalItemCount="rowsCount"
        :pageIndex="pageIndex"
        :pageSize="pageSize"
        :hasSizeSelector="hasSizeSelector"
        :paginationRefresh="paginationRefresh"
        @page-index-change="$emit('page-index-change', $event)"
        @page-size-change="$emit('page-size-change', $event)"
      />
    </div>
  </div>
</template>

<script src="./grid-table.ts"></script>
<style src="./grid-table.scss" lang="scss"></style>